"use client";

export default function MarketAnalysis({ data }) {
  if (!data) return null;

  let jsonData = null;
  try {
    if (typeof data === "string") {
      const jsonMatch = data.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonData = JSON.parse(jsonMatch[0]);
      } else {
        jsonData = JSON.parse(data);
      }
    } else {
      jsonData = data;
    }
  } catch (e) {
    console.error("Failed to parse Market Analysis JSON:", e);
    return (
      <div
        style={{
          background: "#1a1f2e",
          padding: "30px",
          borderRadius: "12px",
          color: "#9ca3af",
        }}
      >
        <p>Failed to parse market analysis data</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
        gap: "20px",
      }}
    >
      {jsonData.sideways_market && (
        <div
          className="card"
          style={{
            background: "#1e293b",
            border: "1px solid #334155",
            gridColumn: jsonData.multi_timeframe ? "1 / -1" : "auto",
          }}
        >
          <div
            className="card-header"
            style={{
              background: "#334155",
              padding: "15px",
              borderRadius: "8px 8px 0 0",
              margin: "-1px -1px 0 -1px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.3em" }}>📊</span>
              <div
                className="card-title"
                style={{
                  color: "#e2e8f0",
                  fontSize: "1em",
                  fontWeight: 600,
                }}
              >
                Sideways Market Detection
              </div>
            </div>
          </div>
          <div className="card-content" style={{ padding: "20px" }}>
            <div style={{ marginBottom: "15px" }}>
              <div
                style={{
                  color: "#9ca3af",
                  fontSize: "0.85em",
                  marginBottom: "5px",
                }}
              >
                Market Condition
              </div>
              <div
                style={{
                  color:
                    jsonData.sideways_market.is_sideways === true ||
                    jsonData.sideways_market.is_sideways === "true"
                      ? "#f59e0b"
                      : "#16a34a",
                  fontSize: "1.1em",
                  fontWeight: 600,
                }}
              >
                {jsonData.sideways_market.is_sideways === true ||
                jsonData.sideways_market.is_sideways === "true"
                  ? "⚠️ Sideways Market Detected"
                  : "✅ Trending Market"}
              </div>
            </div>

            {jsonData.sideways_market.volatility && (
              <div style={{ marginBottom: "15px" }}>
                <div
                  style={{
                    color: "#9ca3af",
                    fontSize: "0.85em",
                    marginBottom: "5px",
                  }}
                >
                  Volatility Level
                </div>
                <div
                  style={{
                    color: "#e2e8f0",
                    fontSize: "1em",
                    fontWeight: 600,
                  }}
                >
                  {jsonData.sideways_market.volatility}
                </div>
              </div>
            )}

            {jsonData.sideways_market.consolidation_range && (
              <div style={{ marginBottom: "15px" }}>
                <div
                  style={{
                    color: "#9ca3af",
                    fontSize: "0.85em",
                    marginBottom: "5px",
                  }}
                >
                  Consolidation Range
                </div>
                <div
                  style={{
                    color: "#e2e8f0",
                    fontSize: "1em",
                    fontWeight: 600,
                  }}
                >
                  {jsonData.sideways_market.consolidation_range}
                </div>
              </div>
            )}

            {jsonData.sideways_market.reasoning && (
              <div
                style={{
                  color: "#6b7280",
                  fontSize: "0.85em",
                  marginTop: "10px",
                  paddingTop: "10px",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  fontStyle: "italic",
                }}
              >
                {jsonData.sideways_market.reasoning}
              </div>
            )}

            {jsonData.sideways_market.trading_recommendation && (
              <div
                style={{
                  background: "#0f172a",
                  padding: "12px",
                  borderRadius: "6px",
                  marginTop: "15px",
                  borderLeft: "3px solid #f59e0b",
                }}
              >
                <div
                  style={{
                    color: "#f59e0b",
                    fontSize: "0.85em",
                    fontWeight: 600,
                    marginBottom: "5px",
                  }}
                >
                  Trading Recommendation
                </div>
                <div style={{ color: "#d1d5db", fontSize: "0.9em" }}>
                  {jsonData.sideways_market.trading_recommendation}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {jsonData.multi_timeframe && (
        <div
          className="card"
          style={{
            background: "#1e293b",
            border: "1px solid #334155",
            gridColumn: "1 / -1",
          }}
        >
          <div
            className="card-header"
            style={{
              background: "#334155",
              padding: "15px",
              borderRadius: "8px 8px 0 0",
              margin: "-1px -1px 0 -1px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.3em" }}>🔄</span>
              <div
                className="card-title"
                style={{
                  color: "#e2e8f0",
                  fontSize: "1em",
                  fontWeight: 600,
                }}
              >
                Multi-Timeframe Analysis (MTFA)
              </div>
            </div>
          </div>
          <div className="card-content" style={{ padding: "20px" }}>
            {jsonData.multi_timeframe.higher_timeframe && (
              <div
                style={{
                  marginBottom: "20px",
                  padding: "15px",
                  background: "#0f172a",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    color: "#3b82f6",
                    fontSize: "1em",
                    fontWeight: 600,
                    marginBottom: "10px",
                  }}
                >
                  Higher Timeframe (
                  {jsonData.multi_timeframe.higher_timeframe.timeframe || "N/A"}
                  )
                </div>
                <div style={{ marginBottom: "8px" }}>
                  <span style={{ color: "#9ca3af", fontSize: "0.85em" }}>
                    Trend:{" "}
                  </span>
                  <span
                    style={{
                      color: jsonData.multi_timeframe.higher_timeframe.trend
                        ?.toLowerCase()
                        .includes("up")
                        ? "#16a34a"
                        : jsonData.multi_timeframe.higher_timeframe.trend
                            ?.toLowerCase()
                            .includes("down")
                        ? "#dc2626"
                        : "#60a5fa",
                      fontWeight: 600,
                    }}
                  >
                    {jsonData.multi_timeframe.higher_timeframe.trend || "N/A"}
                  </span>
                </div>
                {jsonData.multi_timeframe.higher_timeframe.structure && (
                  <div style={{ marginBottom: "8px" }}>
                    <span style={{ color: "#9ca3af", fontSize: "0.85em" }}>
                      Structure:{" "}
                    </span>
                    <span style={{ color: "#e2e8f0", fontSize: "0.9em" }}>
                      {jsonData.multi_timeframe.higher_timeframe.structure}
                    </span>
                  </div>
                )}
                {jsonData.multi_timeframe.higher_timeframe.key_levels && (
                  <div>
                    <span style={{ color: "#9ca3af", fontSize: "0.85em" }}>
                      Key Levels:{" "}
                    </span>
                    <span style={{ color: "#e2e8f0", fontSize: "0.9em" }}>
                      {jsonData.multi_timeframe.higher_timeframe.key_levels}
                    </span>
                  </div>
                )}
              </div>
            )}

            {jsonData.multi_timeframe.lower_timeframe && (
              <div
                style={{
                  marginBottom: "20px",
                  padding: "15px",
                  background: "#0f172a",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    color: "#3b82f6",
                    fontSize: "1em",
                    fontWeight: 600,
                    marginBottom: "10px",
                  }}
                >
                  Lower Timeframe (
                  {jsonData.multi_timeframe.lower_timeframe.timeframe || "N/A"})
                </div>
                <div style={{ marginBottom: "8px" }}>
                  <span style={{ color: "#9ca3af", fontSize: "0.85em" }}>
                    Trend:{" "}
                  </span>
                  <span
                    style={{
                      color: jsonData.multi_timeframe.lower_timeframe.trend
                        ?.toLowerCase()
                        .includes("up")
                        ? "#16a34a"
                        : jsonData.multi_timeframe.lower_timeframe.trend
                            ?.toLowerCase()
                            .includes("down")
                        ? "#dc2626"
                        : "#60a5fa",
                      fontWeight: 600,
                    }}
                  >
                    {jsonData.multi_timeframe.lower_timeframe.trend || "N/A"}
                  </span>
                </div>
                {jsonData.multi_timeframe.lower_timeframe.setups && (
                  <div style={{ marginBottom: "8px" }}>
                    <span style={{ color: "#9ca3af", fontSize: "0.85em" }}>
                      Setups:{" "}
                    </span>
                    <span style={{ color: "#e2e8f0", fontSize: "0.9em" }}>
                      {jsonData.multi_timeframe.lower_timeframe.setups}
                    </span>
                  </div>
                )}
              </div>
            )}

            {jsonData.multi_timeframe.alignment && (
              <div
                style={{
                  padding: "15px",
                  background: "#0f172a",
                  borderRadius: "8px",
                  borderLeft: "3px solid #16a34a",
                }}
              >
                <div
                  style={{
                    color: "#16a34a",
                    fontSize: "0.9em",
                    fontWeight: 600,
                    marginBottom: "8px",
                  }}
                >
                  Trend Alignment
                </div>
                <div style={{ color: "#d1d5db", fontSize: "0.9em" }}>
                  {jsonData.multi_timeframe.alignment.is_aligned === true ||
                  jsonData.multi_timeframe.alignment.is_aligned === "true" ? (
                    <span style={{ color: "#16a34a" }}>
                      ✅ Aligned - Both timeframes show the same trend direction
                    </span>
                  ) : (
                    <span style={{ color: "#f59e0b" }}>
                      ⚠️ Not Aligned - Timeframes show conflicting trends
                    </span>
                  )}
                </div>
                {jsonData.multi_timeframe.alignment.reasoning && (
                  <div
                    style={{
                      color: "#6b7280",
                      fontSize: "0.85em",
                      marginTop: "8px",
                      fontStyle: "italic",
                    }}
                  >
                    {jsonData.multi_timeframe.alignment.reasoning}
                  </div>
                )}
              </div>
            )}

            {jsonData.multi_timeframe.trading_recommendation && (
              <div
                style={{
                  marginTop: "15px",
                  padding: "15px",
                  background: "#0f172a",
                  borderRadius: "8px",
                  borderLeft: "3px solid #3b82f6",
                }}
              >
                <div
                  style={{
                    color: "#3b82f6",
                    fontSize: "0.9em",
                    fontWeight: 600,
                    marginBottom: "8px",
                  }}
                >
                  Trading Recommendation
                </div>
                <div style={{ color: "#d1d5db", fontSize: "0.9em" }}>
                  {jsonData.multi_timeframe.trading_recommendation}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
