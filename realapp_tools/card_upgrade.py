import math
from typing import Annotated, TypedDict

from fastapi import APIRouter
from pydantic import BaseModel, Field

# https://docs.realapp.link/collect/player-cards
TIERS = (
    ("General", 0, 1),
    ("Common", 10, 2),
    ("Uncommon", 30, 3),
    ("Rare", 80, 4),
    ("Epic", 180, 10),
    ("Legendary", 380, 25),
    ("Legendary 2", 520, 28),
    ("Legendary 3", 720, 32),
    ("Legendary 4", 1000, 35),
    ("Legendary 5", 1180, 40),
    ("Mystic", 1380, 75),
    ("Mystic 2", 1560, 79),
    ("Mystic 3", 1760, 83),
    ("Mystic 4", 1980, 87),
    ("Mystic 5", 2220, 91),
    ("Mystic 6", 2480, 95),
    ("Mystic 7", 2760, 98),
    ("Mystic 8", 3000, 101),
    ("Mystic 9", 3180, 103),
    ("Mystic 10", 3250, 105),
    ("Iconic", 3380, 150),
    ("Iconic 2", 3800, 153),
    ("Iconic 3", 4300, 156),
    ("Iconic 4", 4900, 159),
    ("Iconic 5", 5600, 163),
    ("Iconic 6", 6400, 167),
    ("Iconic 7", 7300, 171),
    ("Iconic 8", 8300, 175),
    ("Iconic 9", 9400, 180),
    ("Iconic 10", 10600, 185),
    ("Iconic 11", 12000, 190),
    ("Iconic 12", 13600, 196),
    ("Iconic 13", 15400, 202),
    ("Iconic 14", 17500, 208),
    ("Iconic 15", 19900, 214),
    ("Iconic 16", 22700, 220),
    ("Iconic 17", 26000, 226),
    ("Iconic 18", 29000, 233),
    ("Iconic 19", 34500, 240),
    ("Iconic 20", 40000, 250),
)

Rax = Annotated[int, Field(ge=0, le=1_000_000_000, strict=True)]
router = APIRouter(prefix="/card-upgrade", tags=["Card upgrades"])


class UpgradeInputs(BaseModel):
    rating: Annotated[float, Field(ge=0, le=1_000_000)]
    budget: Rax
    games: Annotated[int, Field(ge=0, le=1000, strict=True)]
    base_rax: Annotated[float, Field(ge=0, le=1_000_000)]
    price_per_point: Annotated[float, Field(gt=0, le=1_000_000)]
    prices: dict[int, Rax] = Field(default_factory=dict, max_length=len(TIERS))


class Upgrade(TypedDict):
    name: str
    threshold: int
    multiplier: int
    points_needed: float
    cost: int
    affordable: bool
    net_gain: float
    roi: float | None
    break_even_games: int | None


class Comparison(TypedDict):
    current_tier: str
    current_multiplier: int
    recommendation: Upgrade | None
    upgrades: list[Upgrade]


def compare_upgrades(inputs: UpgradeInputs) -> Comparison:
    current_tier, _, current_multiplier = next(
        tier for tier in reversed(TIERS) if tier[1] <= inputs.rating
    )
    upgrades: list[Upgrade] = []
    for name, threshold, multiplier in TIERS:
        if threshold <= inputs.rating:
            continue
        points_needed = threshold - inputs.rating
        estimated_cost = max(1, math.ceil(round(points_needed * inputs.price_per_point, 8)))
        cost = inputs.prices.get(threshold, estimated_cost)
        extra_per_game = inputs.base_rax * (multiplier - current_multiplier)
        net_gain = extra_per_game * inputs.games - cost
        break_even = cost / extra_per_game if extra_per_game else math.inf
        upgrades.append(
            {
                "name": name,
                "threshold": threshold,
                "multiplier": multiplier,
                "points_needed": points_needed,
                "cost": cost,
                "affordable": cost <= inputs.budget,
                "net_gain": net_gain,
                "roi": net_gain / cost if cost else None,
                "break_even_games": math.ceil(break_even) if math.isfinite(break_even) else None,
            },
        )

    recommendation = max(
        (upgrade for upgrade in upgrades if upgrade["affordable"] and upgrade["net_gain"] > 0),
        key=lambda upgrade: (
            upgrade["roi"] if upgrade["roi"] is not None else math.inf,
            upgrade["net_gain"],
        ),
        default=None,
    )
    return {
        "current_tier": current_tier,
        "current_multiplier": current_multiplier,
        "recommendation": recommendation,
        "upgrades": upgrades,
    }


router.add_api_route("/compare", compare_upgrades, methods=["POST"])
