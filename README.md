# Real App Tools

A React interface and Python API for calculators that use Real Sports data entered
by the user. The first tool compares player card upgrades by projected Rax ROI.

## Run locally

Use Python 3.15 with uv and Node.js 22.12 or newer on a supported LTS release.

```sh
uv sync --locked
uv run --locked uvicorn realapp_tools.main:app --port 8000
```

In another terminal at the repository root:

```sh
npm --prefix frontend ci
npm --prefix frontend run dev
```

Open the [calculator](http://localhost:5173). The Vite server proxies API
requests to port 8000. FastAPI provides [API docs](http://127.0.0.1:8000/docs).

## Card upgrade calculator

Enter your current same-season card rating, budget, expected games played, base
Rax per game, and estimated Rax per 10 rating points. The rate defaults to
200 Rax per 10 rating points and can be changed.
A quoted cost in the table overrides the estimate for that target tier. Use the
full cost from your current rating to the target. Estimated costs round up to a
whole Rax.

Projected extra Rax equals games × base Rax per game × the increase in card
multiplier. Net gain subtracts the upgrade cost. ROI divides net gain by cost.
The calculator ranks affordable upgrades with positive net gain by ROI, breaking
ties by net gain. A zero-cost upgrade with positive gain takes priority and shows
as free. The projection assumes a constant average payout, with the upgrade
applied before the first projected game. Include expected playoff payouts in your
average if relevant. The projection covers game payouts and excludes boosters
and On This Day earnings.

[Real player card tiers and earnings](https://docs.realapp.link/collect/player-cards)

## Add another tool

Give each tool a package under `realapp_tools/tools/` and a matching folder
under `frontend/src/tools/`. The card upgrade tool keeps its calculation and
input model in `calculator.py`, with HTTP registration in `routes.py`. Register
each router in `realapp_tools/main.py` under `/api/v1`. Keep each tool's React
components and styles in its folder, and expose the tool from
`frontend/src/main.jsx`. Tool calculations are
stateless, so API instances can scale independently of the frontend. A deployed
frontend should route `/api` to the Python service on the same origin.

## Validate

```sh
uv run --locked python -m unittest discover -s tests
uv run --locked ruff check .
uv run --locked ruff format --check .
uv run --locked pre-commit run --all-files
npm --prefix frontend run build
```
