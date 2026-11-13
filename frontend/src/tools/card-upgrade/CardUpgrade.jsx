import React, { useEffect, useState } from "react";
import { UpgradeComparison } from "./UpgradeComparison.jsx";

import "./card-upgrade.css";

const fields = [
  { id: "rating", label: "Current card rating", value: "160", max: 1_000_000, step: "any" },
  { id: "budget", label: "Rax budget", value: "2500", max: 1_000_000_000, step: 1 },
  { id: "games", label: "Expected games played", value: "20", max: 1000, step: 1 },
  { id: "base_rax", label: "Base Rax per game", value: "10", max: 1_000_000, step: "any" },
  { id: "price_per_point", label: "Rax per 10 rating points", value: "200", max: 10_000_000, step: "any" },
];

export function CardUpgrade() {
  const [values, setValues] = useState(() =>
    Object.fromEntries(fields.map(({ id, value }) => [id, value])),
  );
  const [prices, setPrices] = useState({});
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("Calculating…");

  useEffect(() => {
    const valid = fields.every(({ id, step, max }) => {
      const value = Number(values[id]);
      return values[id] !== "" && value >= 0 && value <= max
        && (step !== 1 || Number.isInteger(value))
        && (id !== "price_per_point" || value > 0);
    });
    const quotedPrices = Object.entries(prices).filter(([, price]) => price !== "");
    if (!valid || quotedPrices.some(([, price]) =>
      !Number.isInteger(Number(price)) || Number(price) < 0 || Number(price) > 1_000_000_000
    )) {
      setStatus("Enter valid inputs to update the comparison.");
      return;
    }

    const controller = new AbortController();
    setStatus("Calculating…");
    const timer = setTimeout(async () => {
      try {
        const response = await fetch("/api/v1/card-upgrade/compare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...Object.fromEntries(Object.entries(values).map(([key, value]) => [
              key,
              key === "price_per_point" ? Number(value) / 10 : Number(value),
            ])),
            prices: Object.fromEntries(quotedPrices.map(([tier, price]) => [tier, Number(price)])),
          }),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Calculation failed");
        const comparison = await response.json();
        if (!controller.signal.aborted) {
          setResult(comparison);
          setStatus("");
        }
      } catch {
        if (!controller.signal.aborted) setStatus("Could not calculate. Check the API and reload.");
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [values, prices]);

  return (
    <>
      <section className="panel" aria-labelledby="inputs">
        <h2 id="inputs">Card and budget</h2>
        <div className="fields">
          {fields.map(({ id, label, max, step }) => (
            <label key={id}>
              {label}
              <input
                type="number" min="0" max={max} step={step} required value={values[id]}
                onChange={(event) => {
                  setValues({ ...values, [id]: event.target.value });
                  if (id === "rating") setPrices({});
                }}
              />
            </label>
          ))}
        </div>
        <p className="hint">
          Use the player’s average payout per game before the card multiplier and boosters.
        </p>
      </section>
      <UpgradeComparison
        result={result}
        status={status}
        prices={prices}
        onPriceChange={(threshold, value) => setPrices({ ...prices, [threshold]: value })}
      />
    </>
  );
}
