import React from "react";

const number = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });
const percent = new Intl.NumberFormat(undefined, { style: "percent", maximumFractionDigits: 1 });

export function UpgradeComparison({ result, status, prices, onPriceChange }) {
  const pick = result?.recommendation;
  return (
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
                      onChange={(event) => onPriceChange(row.threshold, event.target.value)}
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
  );
}
