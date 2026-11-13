import unittest

from realapp_tools.tools.card_upgrade.calculator import UpgradeInputs, compare_upgrades


class CardUpgradeTests(unittest.TestCase):
    def test_roi_ranks_affordable_upgrades(self):
        result = compare_upgrades(
            UpgradeInputs(
                rating=160,
                budget=2500,
                games=20,
                base_rax=10,
                price_per_point=10,
            ),
        )
        recommendation = result["recommendation"]
        self.assertIsNotNone(recommendation)
        self.assertEqual(recommendation["name"], "Epic")
        self.assertEqual(recommendation["net_gain"], 1000)
        self.assertEqual(recommendation["break_even_games"], 4)

    def test_budget_can_rule_out_every_upgrade(self):
        result = compare_upgrades(
            UpgradeInputs(
                rating=160,
                budget=199,
                games=20,
                base_rax=10,
                price_per_point=10,
            ),
        )
        self.assertIsNone(result["recommendation"])

    def test_exact_price_can_make_a_higher_tier_affordable(self):
        result = compare_upgrades(
            UpgradeInputs(
                rating=160,
                budget=300,
                games=20,
                base_rax=10,
                price_per_point=10,
                prices={380: 300},
            ),
        )
        recommendation = result["recommendation"]
        self.assertIsNotNone(recommendation)
        self.assertEqual(recommendation["name"], "Legendary")

    def test_no_projected_earnings_recommends_holding(self):
        result = compare_upgrades(
            UpgradeInputs(
                rating=0,
                budget=1000,
                games=0,
                base_rax=10,
                price_per_point=10,
            ),
        )
        self.assertIsNone(result["recommendation"])
