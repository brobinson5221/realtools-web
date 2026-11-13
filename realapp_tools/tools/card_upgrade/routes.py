from fastapi import APIRouter

from realapp_tools.tools.card_upgrade.calculator import compare_upgrades

router = APIRouter(prefix="/card-upgrade", tags=["Card upgrades"])
router.add_api_route("/compare", compare_upgrades, methods=["POST"])
