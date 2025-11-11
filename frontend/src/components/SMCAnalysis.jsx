"use client";

export default function SMCAnalysis({ rawResponse }) {
  if (!rawResponse) return null;

  let jsonData = null;
  try {
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonData = JSON.parse(jsonMatch[0]);
    } else {
      jsonData = JSON.parse(rawResponse);
    }
  } catch (e) {
    console.error("Failed to parse JSON in renderSMCAnalysis:", e);
    return (
      <div
        className="smc-analysis-container"
        style={{
          background: "#1a1f2e",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
        }}
      >
        <pre
          className="smc-content"
          style={{
            color: "#d1d5db",
            lineHeight: "1.8",
            fontSize: "0.95em",
            whiteSpace: "pre-wrap",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            margin: 0,
          }}
        >
          {rawResponse}
        </pre>
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
      {jsonData.market_structure && (
        <div
          className="card"
          style={{
            background: "#1e293b",
            border: "1px solid #334155",
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
                Market Structure
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
                Current Trend
              </div>
              <div
                style={{
                  color: jsonData.market_structure.current_trend
                    ?.toLowerCase()
                    .includes("uptrend")
                    ? "#16a34a"
                    : jsonData.market_structure.current_trend
                        ?.toLowerCase()
                        .includes("downtrend")
                    ? "#dc2626"
                    : "#60a5fa",
                  fontSize: "1em",
                  fontWeight: 600,
                }}
              >
                {jsonData.market_structure.current_trend || "Not identified"}
              </div>
              {jsonData.market_structure.trend_reasoning && (
                <div
                  style={{
                    color: "#6b7280",
                    fontSize: "0.85em",
                    marginTop: "5px",
                    fontStyle: "italic",
                  }}
                >
                  {jsonData.market_structure.trend_reasoning}
                </div>
              )}
            </div>
            <div style={{ marginBottom: "15px" }}>
              <div
                style={{
                  color: "#9ca3af",
                  fontSize: "0.85em",
                  marginBottom: "5px",
                }}
              >
                Current Price
              </div>
              <div
                style={{
                  color: "#e2e8f0",
                  fontSize: "1.2em",
                  fontWeight: 700,
                }}
              >
                ${jsonData.market_structure.current_price || "N/A"}
              </div>
            </div>
            <div>
              <div
                style={{
                  color: "#9ca3af",
                  fontSize: "0.85em",
                  marginBottom: "5px",
                }}
              >
                Market Phase
              </div>
              <div
                style={{
                  color: "#e2e8f0",
                  fontSize: "1em",
                  fontWeight: 600,
                }}
              >
                {jsonData.market_structure.market_phase || "Not identified"}
              </div>
              {jsonData.market_structure.phase_reasoning && (
                <div
                  style={{
                    color: "#6b7280",
                    fontSize: "0.85em",
                    marginTop: "5px",
                    fontStyle: "italic",
                  }}
                >
                  {jsonData.market_structure.phase_reasoning}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {jsonData.change_of_character && (
        <div
          className="card"
          style={{
            background: "#1e293b",
            border: "1px solid #334155",
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
                Change of Character
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
                Type
              </div>
              <div
                style={{
                  color: jsonData.change_of_character.type
                    ?.toLowerCase()
                    .includes("bearish")
                    ? "#ea580c"
                    : "#16a34a",
                  fontSize: "1em",
                  fontWeight: 600,
                }}
              >
                {jsonData.change_of_character.type || "Not identified"}
              </div>
            </div>
            <div style={{ marginBottom: "15px" }}>
              <div
                style={{
                  color: "#9ca3af",
                  fontSize: "0.85em",
                  marginBottom: "5px",
                }}
              >
                Level
              </div>
              <div
                style={{
                  color: "#e2e8f0",
                  fontSize: "1em",
                  fontWeight: 600,
                }}
              >
                {jsonData.change_of_character.level || "N/A"}
              </div>
            </div>
            <div style={{ marginBottom: "15px" }}>
              <div
                style={{
                  color: "#9ca3af",
                  fontSize: "0.85em",
                  marginBottom: "5px",
                }}
              >
                Date
              </div>
              <div style={{ color: "#d1d5db", fontSize: "0.85em" }}>
                {jsonData.change_of_character.date || "N/A"}
              </div>
            </div>
            {jsonData.change_of_character.explanation && (
              <div
                style={{
                  color: "#6b7280",
                  fontSize: "0.85em",
                  fontStyle: "italic",
                  marginTop: "10px",
                  paddingTop: "10px",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {jsonData.change_of_character.explanation}
              </div>
            )}
          </div>
        </div>
      )}

      {jsonData.resistance_levels && jsonData.resistance_levels.length > 0 && (
        <div
          className="card"
          style={{
            background: "#1e293b",
            border: "1px solid #334155",
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
              <span style={{ fontSize: "1.3em" }}>📈</span>
              <div
                className="card-title"
                style={{
                  color: "#e2e8f0",
                  fontSize: "1em",
                  fontWeight: 600,
                }}
              >
                Resistance Levels
              </div>
            </div>
          </div>
          <div className="card-content" style={{ padding: "20px" }}>
            {jsonData.resistance_levels.map((r, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: "12px",
                  padding: "12px",
                  background: "#0f172a",
                  borderRadius: "6px",
                  borderLeft: "3px solid #dc2626",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: "#dc2626",
                      fontWeight: 600,
                      fontSize: "1em",
                    }}
                  >
                    {r.label}
                  </span>
                  <span
                    style={{
                      color: "#e2e8f0",
                      fontSize: "1em",
                      fontWeight: 700,
                    }}
                  >
                    ${r.price || "N/A"}
                  </span>
                </div>
                {r.description && (
                  <div
                    style={{
                      color: "#9ca3af",
                      fontSize: "0.85em",
                      marginTop: "5px",
                    }}
                  >
                    {r.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {jsonData.support_levels && jsonData.support_levels.length > 0 && (
        <div
          className="card"
          style={{
            background: "#1e293b",
            border: "1px solid #334155",
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
              <span style={{ fontSize: "1.3em" }}>📉</span>
              <div
                className="card-title"
                style={{
                  color: "#e2e8f0",
                  fontSize: "1em",
                  fontWeight: 600,
                }}
              >
                Support Levels
              </div>
            </div>
          </div>
          <div className="card-content" style={{ padding: "20px" }}>
            {jsonData.support_levels.map((s, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: "12px",
                  padding: "12px",
                  background: "#0f172a",
                  borderRadius: "6px",
                  borderLeft: "3px solid #16a34a",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: "#16a34a",
                      fontWeight: 600,
                      fontSize: "1em",
                    }}
                  >
                    {s.label}
                  </span>
                  <span
                    style={{
                      color: "#e2e8f0",
                      fontSize: "1em",
                      fontWeight: 700,
                    }}
                  >
                    ${s.price || "N/A"}
                  </span>
                </div>
                {s.description && (
                  <div
                    style={{
                      color: "#9ca3af",
                      fontSize: "0.85em",
                      marginTop: "5px",
                    }}
                  >
                    {s.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {jsonData.bullish_order_blocks &&
        jsonData.bullish_order_blocks.length > 0 && (
          <div
            className="card"
            style={{
              background: "#1e293b",
              border: "1px solid #334155",
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
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span style={{ fontSize: "1.3em" }}>🟢</span>
                <div
                  className="card-title"
                  style={{
                    color: "#e2e8f0",
                    fontSize: "1em",
                    fontWeight: 600,
                  }}
                >
                  Bullish Order Blocks
                </div>
              </div>
            </div>
            <div className="card-content" style={{ padding: "20px" }}>
              {jsonData.bullish_order_blocks.map((ob, idx) => (
                <div
                  key={idx}
                  style={{
                    marginBottom:
                      idx < jsonData.bullish_order_blocks.length - 1
                        ? "15px"
                        : "0",
                    padding: "15px",
                    background: "#0f172a",
                    borderRadius: "8px",
                    borderLeft: "4px solid #16a34a",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <span style={{ color: "#9ca3af", fontWeight: 600 }}>
                      Range
                    </span>
                    <span style={{ color: "#e2e8f0", fontWeight: 700 }}>
                      {ob.range || "N/A"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <span style={{ color: "#9ca3af", fontSize: "0.85em" }}>
                      Date
                    </span>
                    <span style={{ color: "#cbd5e1", fontSize: "0.85em" }}>
                      {ob.date || "N/A"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: ob.reasoning ? "8px" : "0",
                    }}
                  >
                    <span style={{ color: "#9ca3af", fontSize: "0.85em" }}>
                      Strength
                    </span>
                    <span
                      style={{
                        color: "#16a34a",
                        fontWeight: 600,
                        padding: "4px 10px",
                        background: "#0f172a",
                        borderRadius: "4px",
                        border: "1px solid #16a34a",
                      }}
                    >
                      {ob.strength || "Moderate"}
                    </span>
                  </div>
                  {ob.reasoning && (
                    <div
                      style={{
                        color: "#6b7280",
                        fontSize: "0.8em",
                        marginTop: "8px",
                        fontStyle: "italic",
                        paddingTop: "8px",
                        borderTop: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      {ob.reasoning}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      {jsonData.bearish_order_blocks &&
        jsonData.bearish_order_blocks.length > 0 && (
          <div
            className="card"
            style={{
              background: "#1e293b",
              border: "1px solid #334155",
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
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span style={{ fontSize: "1.3em" }}>🔴</span>
                <div
                  className="card-title"
                  style={{
                    color: "#e2e8f0",
                    fontSize: "1em",
                    fontWeight: 600,
                  }}
                >
                  Bearish Order Blocks
                </div>
              </div>
            </div>
            <div className="card-content" style={{ padding: "20px" }}>
              {jsonData.bearish_order_blocks.map((ob, idx) => (
                <div
                  key={idx}
                  style={{
                    marginBottom:
                      idx < jsonData.bearish_order_blocks.length - 1
                        ? "15px"
                        : "0",
                    padding: "15px",
                    background: "#0f172a",
                    borderRadius: "8px",
                    borderLeft: "4px solid #dc2626",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <span style={{ color: "#9ca3af", fontWeight: 600 }}>
                      Range
                    </span>
                    <span style={{ color: "#e2e8f0", fontWeight: 700 }}>
                      {ob.range || "N/A"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <span style={{ color: "#9ca3af", fontSize: "0.85em" }}>
                      Date
                    </span>
                    <span style={{ color: "#cbd5e1", fontSize: "0.85em" }}>
                      {ob.date || "N/A"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: ob.reasoning ? "8px" : "0",
                    }}
                  >
                    <span style={{ color: "#9ca3af", fontSize: "0.85em" }}>
                      Strength
                    </span>
                    <span
                      style={{
                        color: "#dc2626",
                        fontWeight: 600,
                        padding: "4px 10px",
                        background: "#0f172a",
                        borderRadius: "4px",
                        border: "1px solid #dc2626",
                      }}
                    >
                      {ob.strength || "Moderate"}
                    </span>
                  </div>
                  {ob.reasoning && (
                    <div
                      style={{
                        color: "#6b7280",
                        fontSize: "0.8em",
                        marginTop: "8px",
                        fontStyle: "italic",
                        paddingTop: "8px",
                        borderTop: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      {ob.reasoning}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      {jsonData.fair_value_gaps && jsonData.fair_value_gaps.length > 0 && (
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
              <span style={{ fontSize: "1.3em" }}>⚡</span>
              <div
                className="card-title"
                style={{
                  color: "#e2e8f0",
                  fontSize: "1em",
                  fontWeight: 600,
                }}
              >
                Fair Value Gaps (FVG)
              </div>
            </div>
          </div>
          <div className="card-content" style={{ padding: "20px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "15px",
              }}
            >
              {jsonData.fair_value_gaps.map((fvg, idx) => {
                const fvgColor =
                  fvg.type?.toLowerCase() === "bullish" ? "#16a34a" : "#dc2626";
                return (
                  <div
                    key={idx}
                    style={{
                      padding: "15px",
                      background: "#0f172a",
                      borderRadius: "8px",
                      borderLeft: `4px solid ${fvgColor}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "10px",
                      }}
                    >
                      <span
                        style={{
                          color: fvgColor,
                          fontWeight: 600,
                          fontSize: "1em",
                        }}
                      >
                        {fvg.type || "Bullish"} FVG
                      </span>
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <span style={{ color: "#9ca3af", fontSize: "0.85em" }}>
                        Range:{" "}
                      </span>
                      <span style={{ color: "#d1d5db", fontWeight: 600 }}>
                        {fvg.range || "N/A"}
                      </span>
                    </div>
                    <div
                      style={{ marginBottom: fvg.explanation ? "8px" : "0" }}
                    >
                      <span style={{ color: "#9ca3af", fontSize: "0.85em" }}>
                        Date:{" "}
                      </span>
                      <span style={{ color: "#d1d5db", fontSize: "0.85em" }}>
                        {fvg.date || "N/A"}
                      </span>
                    </div>
                    {fvg.explanation && (
                      <div
                        style={{
                          color: "#6b7280",
                          fontSize: "0.8em",
                          marginTop: "8px",
                          fontStyle: "italic",
                          paddingTop: "8px",
                          borderTop: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        {fvg.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
