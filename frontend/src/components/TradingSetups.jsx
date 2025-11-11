"use client";

export default function TradingSetups({ data }) {
  if (!data || !data.setups || data.setups.length === 0) {
    return (
      <div className="card">
        <div className="card-content">No trading setups identified</div>
      </div>
    );
  }

  return (
    <div>
      {data.setups.map((setup, index) => {
        const probClass = setup.probability.toLowerCase().includes("high")
          ? "high"
          : setup.probability.toLowerCase().includes("medium")
          ? "medium"
          : "low";

        return (
          <div key={index} className="setup-card">
            <div className="setup-header">
              <div className="setup-title">{setup.name}</div>
              <div className={`probability-badge ${probClass}`}>
                {setup.probability}
              </div>
            </div>
            <div className="setup-info">
              <div style={{ marginBottom: "8px" }}>
                <strong>Condition:</strong> {setup.condition}
              </div>
              <div style={{ marginBottom: "8px" }}>
                <strong>Risk:Reward:</strong> {setup.riskReward}
              </div>
              {setup.calculation && (
                <div
                  style={{
                    marginTop: "12px",
                    padding: "10px",
                    backgroundColor: "#1e3a5f",
                    borderRadius: "6px",
                    border: "1px solid #3b82f6",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.85em",
                      fontWeight: "600",
                      color: "#60a5fa",
                      marginBottom: "6px",
                    }}
                  >
                    📊 Risk:Reward Calculation
                  </div>
                  <div
                    style={{
                      fontSize: "0.85em",
                      color: "#d1d5db",
                      lineHeight: "1.5",
                    }}
                  >
                    {setup.calculation}
                  </div>
                </div>
              )}
              {setup.timeframe_analysis && (
                <div
                  style={{
                    marginTop: "16px",
                    padding: "12px",
                    backgroundColor: "#1f2937",
                    borderRadius: "8px",
                    border: "1px solid #374151",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.9em",
                      fontWeight: "600",
                      marginBottom: "10px",
                      color: "#60a5fa",
                    }}
                  >
                    📊 Multi-Timeframe Analysis
                  </div>
                  <div style={{ fontSize: "0.85em", lineHeight: "1.6" }}>
                    <div style={{ marginBottom: "6px" }}>
                      <strong>HTF Bias:</strong>{" "}
                      <span
                        style={{
                          color:
                            setup.timeframe_analysis.htf_bias === "Bullish"
                              ? "#10b981"
                              : setup.timeframe_analysis.htf_bias === "Bearish"
                              ? "#ef4444"
                              : "#9ca3af",
                        }}
                      >
                        {setup.timeframe_analysis.htf_bias}
                      </span>{" "}
                      ({setup.timeframe_analysis.htf_timeframe})
                    </div>
                    <div style={{ marginBottom: "6px" }}>
                      <strong>HTF POI:</strong>{" "}
                      {setup.timeframe_analysis.htf_poi}
                    </div>
                    <div style={{ marginBottom: "6px" }}>
                      <strong>LTF Timeframe:</strong>{" "}
                      {setup.timeframe_analysis.ltf_timeframe}
                    </div>
                    <div style={{ marginBottom: "6px" }}>
                      <strong>LTF Confirmation:</strong>{" "}
                      {setup.timeframe_analysis.ltf_confirmation}
                    </div>
                    <div style={{ marginBottom: "6px" }}>
                      <strong>Setup Type:</strong>{" "}
                      <span
                        style={{
                          color:
                            setup.timeframe_analysis.setup_type === "Bullish"
                              ? "#10b981"
                              : "#ef4444",
                        }}
                      >
                        {setup.timeframe_analysis.setup_type}
                      </span>
                    </div>
                    {setup.timeframe_analysis.entry_reasoning && (
                      <div
                        style={{
                          marginTop: "10px",
                          padding: "8px",
                          backgroundColor: "#111827",
                          borderRadius: "6px",
                          borderLeft: "3px solid #60a5fa",
                        }}
                      >
                        <strong>Entry Reasoning:</strong>{" "}
                        <span style={{ color: "#d1d5db" }}>
                          {setup.timeframe_analysis.entry_reasoning}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="setup-boxes">
              <div className="setup-box entry">
                <div className="setup-box-label">➤ ENTRY</div>
                <div className="setup-box-value">{setup.entry}</div>
                {setup.entryExplanation && (
                  <div
                    style={{
                      marginTop: "8px",
                      fontSize: "0.75em",
                      color: "#9ca3af",
                      fontStyle: "italic",
                      lineHeight: "1.4",
                      padding: "6px",
                      backgroundColor: "#111827",
                      borderRadius: "4px",
                    }}
                  >
                    {setup.entryExplanation}
                  </div>
                )}
              </div>
              <div className="setup-box stop-loss">
                <div className="setup-box-label">⛔ STOP LOSS</div>
                <div className="setup-box-value">{setup.stopLoss}</div>
                {setup.stopLossExplanation && (
                  <div
                    style={{
                      marginTop: "8px",
                      fontSize: "0.75em",
                      color: "#9ca3af",
                      fontStyle: "italic",
                      lineHeight: "1.4",
                      padding: "6px",
                      backgroundColor: "#111827",
                      borderRadius: "4px",
                    }}
                  >
                    {setup.stopLossExplanation}
                  </div>
                )}
              </div>
              <div className="setup-box targets">
                <div className="setup-box-label">🎯 TARGETS</div>
                <div className="setup-box-value">
                  {setup.targets.map((t, i) => (
                    <div key={i} style={{ marginBottom: "8px" }}>
                      <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                        {t} (TP{i + 1})
                      </div>
                      {setup.targetsExplanation &&
                        (i === 0
                          ? setup.targetsExplanation.tp1
                          : i === 1
                          ? setup.targetsExplanation.tp2
                          : setup.targetsExplanation.tp3) && (
                          <div
                            style={{
                              fontSize: "0.7em",
                              color: "#9ca3af",
                              fontStyle: "italic",
                              lineHeight: "1.3",
                              padding: "4px",
                              backgroundColor: "#111827",
                              borderRadius: "4px",
                              marginTop: "4px",
                            }}
                          >
                            {i === 0
                              ? setup.targetsExplanation.tp1
                              : i === 1
                              ? setup.targetsExplanation.tp2
                              : setup.targetsExplanation.tp3}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
