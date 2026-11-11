import React, { useEffect, useState } from "react";

const fields = [
  { id: "rating", label: "Current card rating", value: "160", max: 1_000_000, step: "any" },
  { id: "budget", label: "Rax budget", value: "2500", max: 1_000_000_000, step: 1 },
  { id: "games", label: "Expected games played", value: "20", max: 1000, step: 1 },
  { id: "base_rax", label: "Base Rax per game", value: "10", max: 1_000_000, step: "any" },
  { id: "price_per_point", label: "Rax per 10 rating points", value: "200", max: 10_000_000, step: "any" },
];
const number = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });
const percent = new Intl.NumberFormat(undefined, { style: "percent", maximumFractionDigits: 1 });

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

  const pick = result?.recommendation;
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
      <section className="panel" aria-labelledby="comparison">
        <h2 id="comparison">Upgrade comparison</h2>
        <div className="recommendation" role="status">
          {status || (pick
            ? <><strong>Upgrade to {pick.name}</strong><span>
              +{number.format(pick.points_needed)} rating · {number.format(pick.cost)} Rax ·{" "}
              {pick.roi === null ? "Free upgrade" : `${percent.format(pick.roi)} ROI`}
            </span></>
            : <><strong>Hold {result.current_tier}</strong><span>
              No affordable upgrade has a positive projected gain.
            </span></>)}
        </div>
        {result && <>
          <p className="hint">
            Current tier: {result.current_tier} ({result.current_multiplier}×). Enter a quoted total
            cost to override the estimate for that tier. Gains and ROI are relative to holding.
          </p>
          {result.upgrades.length > 0 && (
            <div className="table-wrap" tabIndex={0} role="region" aria-label="Upgrade tiers">
              <table>
                <thead><tr>
                  <th scope="col">Tier</th><th scope="col">Rating needed</th>
                  <th scope="col">Cost (Rax)</th><th scope="col">Quoted cost</th>
                  <th scope="col">Net gain (Rax)</th><th scope="col">ROI</th>
                  <th scope="col">Break-even games</th><th scope="col">Budget</th>
                </tr></thead>
                <tbody>
                  {result.upgrades.map((row) => (
                    <tr key={row.threshold} className={row.threshold === pick?.threshold ? "selected" : ""}>
                      <th scope="row">{row.name} <span className="multiplier">{row.multiplier}×</span></th>
                      <td>{number.format(row.points_needed)}</td>
                      <td>{number.format(row.cost)}</td>
                      <td><input
                        aria-label={`${row.name} quoted cost in Rax`}
                        type="number" min="0" max="1000000000" step="1"
                        value={prices[row.threshold] ?? ""} placeholder="Estimate"
                        onChange={(event) => setPrices({ ...prices, [row.threshold]: event.target.value })}
                      /></td>
                      <td>{number.format(row.net_gain)}</td>
                      <td>{row.roi === null ? "Free" : percent.format(row.roi)}</td>
                      <td>{row.break_even_games === null ? "—" : number.format(row.break_even_games)}</td>
                      <td>{row.affordable ? "Within budget" : "Over budget"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>}
      </section>
    </>
  );
}
