"use client";

export default function PriceActionDetail({
  priceActionDetail,
  technicalIndicators,
  technicalIndicatorsAnalysis,
}) {
  if (!priceActionDetail && !technicalIndicatorsAnalysis) {
    return (
      <div
        style={{
          background: "#1a1f2e",
          padding: "30px",
          borderRadius: "12px",
          color: "#9ca3af",
          textAlign: "center",
        }}
      >
        No price action detail or technical indicators data available
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {priceActionDetail && (
        <div
          className="card"
          style={{
            background: "#1e293b",
            border: "1px solid #334155",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <div
            className="card-header"
            style={{
              background: "#334155",
              padding: "20px",
              borderBottom: "1px solid #475569",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "1.5em" }}>📈</span>
              <h2
                style={{
                  color: "#e2e8f0",
                  fontSize: "1.3em",
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Price Action Detailed Analysis
              </h2>
            </div>
          </div>
          <div className="card-content" style={{ padding: "20px" }}>
            {priceActionDetail.detailed_explanation && (
              <div style={{ marginBottom: "20px" }}>
                <h3
                  style={{
                    color: "#3b82f6",
                    fontSize: "1em",
                    fontWeight: 600,
                    marginBottom: "10px",
                  }}
                >
                  Detailed Explanation
                </h3>
                <p
                  style={{
                    color: "#d1d5db",
                    fontSize: "0.95em",
                    lineHeight: "1.6",
                  }}
                >
                  {priceActionDetail.detailed_explanation}
                </p>
              </div>
            )}

            {priceActionDetail.key_patterns &&
              priceActionDetail.key_patterns.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                  <h3
                    style={{
                      color: "#3b82f6",
                      fontSize: "1em",
                      fontWeight: 600,
                      marginBottom: "10px",
                    }}
                  >
                    Key Patterns
                  </h3>
                  <ul
                    style={{
                      color: "#d1d5db",
                      fontSize: "0.95em",
                      paddingLeft: "20px",
                      lineHeight: "1.8",
                    }}
                  >
                    {priceActionDetail.key_patterns.map((pattern, idx) => (
                      <li key={idx}>{pattern}</li>
                    ))}
                  </ul>
                </div>
              )}

            {priceActionDetail.momentum_analysis && (
              <div style={{ marginBottom: "20px" }}>
                <h3
                  style={{
                    color: "#3b82f6",
                    fontSize: "1em",
                    fontWeight: 600,
                    marginBottom: "10px",
                  }}
                >
                  Momentum Analysis
                </h3>
                <p
                  style={{
                    color: "#d1d5db",
                    fontSize: "0.95em",
                    lineHeight: "1.6",
                  }}
                >
                  {priceActionDetail.momentum_analysis}
                </p>
              </div>
            )}

            {priceActionDetail.volume_analysis && (
              <div style={{ marginBottom: "20px" }}>
                <h3
                  style={{
                    color: "#3b82f6",
                    fontSize: "1em",
                    fontWeight: 600,
                    marginBottom: "10px",
                  }}
                >
                  Volume Analysis
                </h3>
                <p
                  style={{
                    color: "#d1d5db",
                    fontSize: "0.95em",
                    lineHeight: "1.6",
                  }}
                >
                  {priceActionDetail.volume_analysis}
                </p>
              </div>
            )}

            {priceActionDetail.candle_formations &&
              priceActionDetail.candle_formations.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                  <h3
                    style={{
                      color: "#3b82f6",
                      fontSize: "1em",
                      fontWeight: 600,
                      marginBottom: "10px",
                    }}
                  >
                    Candle Formations
                  </h3>
                  <ul
                    style={{
                      color: "#d1d5db",
                      fontSize: "0.95em",
                      paddingLeft: "20px",
                      lineHeight: "1.8",
                    }}
                  >
                    {priceActionDetail.candle_formations.map(
                      (formation, idx) => (
                        <li key={idx}>{formation}</li>
                      )
                    )}
                  </ul>
                </div>
              )}

            {priceActionDetail.market_sentiment && (
              <div
                style={{
                  background: "#0f172a",
                  padding: "15px",
                  borderRadius: "8px",
                  borderLeft: "3px solid #3b82f6",
                }}
              >
                <h3
                  style={{
                    color: "#3b82f6",
                    fontSize: "0.95em",
                    fontWeight: 600,
                    marginBottom: "8px",
                  }}
                >
                  Market Sentiment
                </h3>
                <p
                  style={{
                    color: "#d1d5db",
                    fontSize: "0.9em",
                    lineHeight: "1.6",
                  }}
                >
                  {priceActionDetail.market_sentiment}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {technicalIndicatorsAnalysis && (
        <div
          className="card"
          style={{
            background: "#1e293b",
            border: "1px solid #334155",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <div
            className="card-header"
            style={{
              background: "#334155",
              padding: "20px",
              borderBottom: "1px solid #475569",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "1.5em" }}>📊</span>
              <h2
                style={{
                  color: "#e2e8f0",
                  fontSize: "1.3em",
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Technical Indicators Analysis
              </h2>
            </div>
          </div>
          <div className="card-content" style={{ padding: "20px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
                marginBottom: "20px",
              }}
            >
              {technicalIndicatorsAnalysis.rsi && (
                <div
                  style={{
                    background: "#0f172a",
                    padding: "15px",
                    borderRadius: "8px",
                    border: "1px solid #1e293b",
                  }}
                >
                  <h3
                    style={{
                      color: "#60a5fa",
                      fontSize: "1em",
                      fontWeight: 600,
                      marginBottom: "10px",
                    }}
                  >
                    RSI (Relative Strength Index)
                  </h3>
                  {technicalIndicatorsAnalysis.rsi.value !== undefined && (
                    <div style={{ marginBottom: "8px" }}>
                      <span style={{ color: "#9ca3af", fontSize: "0.85em" }}>
                        Value:{" "}
                      </span>
                      <span
                        style={{
                          color:
                            technicalIndicatorsAnalysis.rsi.value > 70
                              ? "#ef4444"
                              : technicalIndicatorsAnalysis.rsi.value < 30
                              ? "#22c55e"
                              : "#60a5fa",
                          fontWeight: 600,
                          fontSize: "1.1em",
                        }}
                      >
                        {technicalIndicatorsAnalysis.rsi.value.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {technicalIndicatorsAnalysis.rsi.interpretation && (
                    <div style={{ marginBottom: "8px" }}>
                      <span style={{ color: "#9ca3af", fontSize: "0.85em" }}>
                        Status:{" "}
                      </span>
                      <span
                        style={{
                          color:
                            technicalIndicatorsAnalysis.rsi.signal === "Bullish"
                              ? "#22c55e"
                              : technicalIndicatorsAnalysis.rsi.signal ===
                                "Bearish"
                              ? "#ef4444"
                              : "#60a5fa",
                          fontWeight: 600,
                        }}
                      >
                        {technicalIndicatorsAnalysis.rsi.interpretation}
                      </span>
                    </div>
                  )}
                  {technicalIndicatorsAnalysis.rsi.explanation && (
                    <p
                      style={{
                        color: "#d1d5db",
                        fontSize: "0.85em",
                        marginTop: "10px",
                        lineHeight: "1.5",
                      }}
                    >
                      {technicalIndicatorsAnalysis.rsi.explanation}
                    </p>
                  )}
                </div>
              )}

              {technicalIndicatorsAnalysis.adx && (
                <div
                  style={{
                    background: "#0f172a",
                    padding: "15px",
                    borderRadius: "8px",
                    border: "1px solid #1e293b",
                  }}
                >
                  <h3
                    style={{
                      color: "#60a5fa",
                      fontSize: "1em",
                      fontWeight: 600,
                      marginBottom: "10px",
                    }}
                  >
                    ADX (Average Directional Index)
                  </h3>
                  {technicalIndicatorsAnalysis.adx.value !== undefined && (
                    <div style={{ marginBottom: "8px" }}>
                      <span style={{ color: "#9ca3af", fontSize: "0.85em" }}>
                        ADX:{" "}
                      </span>
                      <span
                        style={{
                          color:
                            technicalIndicatorsAnalysis.adx.trend_strength ===
                            "Strong"
                              ? "#22c55e"
                              : technicalIndicatorsAnalysis.adx
                                  .trend_strength === "Moderate"
                              ? "#f59e0b"
                              : "#9ca3af",
                          fontWeight: 600,
                        }}
                      >
                        {technicalIndicatorsAnalysis.adx.value.toFixed(2)} (
                        {technicalIndicatorsAnalysis.adx.trend_strength})
                      </span>
                    </div>
                  )}
                  {technicalIndicatorsAnalysis.adx.plus_di !== undefined && (
                    <div style={{ marginBottom: "8px" }}>
                      <span style={{ color: "#9ca3af", fontSize: "0.85em" }}>
                        +DI:{" "}
                      </span>
                      <span
                        style={{
                          color: "#22c55e",
                          fontWeight: 600,
                        }}
                      >
                        {technicalIndicatorsAnalysis.adx.plus_di.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {technicalIndicatorsAnalysis.adx.minus_di !== undefined && (
                    <div style={{ marginBottom: "8px" }}>
                      <span style={{ color: "#9ca3af", fontSize: "0.85em" }}>
                        -DI:{" "}
                      </span>
                      <span
                        style={{
                          color: "#ef4444",
                          fontWeight: 600,
                        }}
                      >
                        {technicalIndicatorsAnalysis.adx.minus_di.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {technicalIndicatorsAnalysis.adx.trend_direction && (
                    <div style={{ marginBottom: "8px" }}>
                      <span style={{ color: "#9ca3af", fontSize: "0.85em" }}>
                        Direction:{" "}
                      </span>
                      <span
                        style={{
                          color:
                            technicalIndicatorsAnalysis.adx.trend_direction ===
                            "Bullish"
                              ? "#22c55e"
                              : technicalIndicatorsAnalysis.adx
                                  .trend_direction === "Bearish"
                              ? "#ef4444"
                              : "#60a5fa",
                          fontWeight: 600,
                        }}
                      >
                        {technicalIndicatorsAnalysis.adx.trend_direction}
                      </span>
                    </div>
                  )}
                  {technicalIndicatorsAnalysis.adx.explanation && (
                    <p
                      style={{
                        color: "#d1d5db",
                        fontSize: "0.85em",
                        marginTop: "10px",
                        lineHeight: "1.5",
                      }}
                    >
                      {technicalIndicatorsAnalysis.adx.explanation}
                    </p>
                  )}
                </div>
              )}

              {technicalIndicatorsAnalysis.ema_9 && (
                <div
                  style={{
                    background: "#0f172a",
                    padding: "15px",
                    borderRadius: "8px",
                    border: "1px solid #1e293b",
                  }}
                >
                  <h3
                    style={{
                      color: "#60a5fa",
                      fontSize: "1em",
                      fontWeight: 600,
                      marginBottom: "10px",
                    }}
                  >
                    EMA 9 (Short-term)
                  </h3>
                  {technicalIndicatorsAnalysis.ema_9.value !== undefined && (
                    <div style={{ marginBottom: "8px" }}>
                      <span style={{ color: "#9ca3af", fontSize: "0.85em" }}>
                        Value:{" "}
                      </span>
                      <span
                        style={{
                          color: "#e2e8f0",
                          fontWeight: 600,
                        }}
                      >
                        {technicalIndicatorsAnalysis.ema_9.value.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {technicalIndicatorsAnalysis.ema_9.position_vs_price && (
                    <div style={{ marginBottom: "8px" }}>
                      <span style={{ color: "#9ca3af", fontSize: "0.85em" }}>
                        Position:{" "}
                      </span>
                      <span
                        style={{
                          color:
                            technicalIndicatorsAnalysis.ema_9
                              .position_vs_price === "Above"
                              ? "#22c55e"
                              : technicalIndicatorsAnalysis.ema_9
                                  .position_vs_price === "Below"
                              ? "#ef4444"
                              : "#60a5fa",
                          fontWeight: 600,
                        }}
                      >
                        {technicalIndicatorsAnalysis.ema_9.position_vs_price}
                      </span>
                    </div>
                  )}
                  {technicalIndicatorsAnalysis.ema_9.explanation && (
                    <p
                      style={{
                        color: "#d1d5db",
                        fontSize: "0.85em",
                        marginTop: "10px",
                        lineHeight: "1.5",
                      }}
                    >
                      {technicalIndicatorsAnalysis.ema_9.explanation}
                    </p>
                  )}
                </div>
              )}

              {technicalIndicatorsAnalysis.ema_20 && (
                <div
                  style={{
                    background: "#0f172a",
                    padding: "15px",
                    borderRadius: "8px",
                    border: "1px solid #1e293b",
                  }}
                >
                  <h3
                    style={{
                      color: "#60a5fa",
                      fontSize: "1em",
                      fontWeight: 600,
                      marginBottom: "10px",
                    }}
                  >
                    EMA 20 (Medium-term)
                  </h3>
                  {technicalIndicatorsAnalysis.ema_20.value !== undefined && (
                    <div style={{ marginBottom: "8px" }}>
                      <span style={{ color: "#9ca3af", fontSize: "0.85em" }}>
                        Value:{" "}
                      </span>
                      <span
                        style={{
                          color: "#e2e8f0",
                          fontWeight: 600,
                        }}
                      >
                        {technicalIndicatorsAnalysis.ema_20.value.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {technicalIndicatorsAnalysis.ema_20.position_vs_price && (
                    <div style={{ marginBottom: "8px" }}>
                      <span style={{ color: "#9ca3af", fontSize: "0.85em" }}>
                        Position:{" "}
                      </span>
                      <span
                        style={{
                          color:
                            technicalIndicatorsAnalysis.ema_20
                              .position_vs_price === "Above"
                              ? "#22c55e"
                              : technicalIndicatorsAnalysis.ema_20
                                  .position_vs_price === "Below"
                              ? "#ef4444"
                              : "#60a5fa",
                          fontWeight: 600,
                        }}
                      >
                        {technicalIndicatorsAnalysis.ema_20.position_vs_price}
                      </span>
                    </div>
                  )}
                  {technicalIndicatorsAnalysis.ema_20.explanation && (
                    <p
                      style={{
                        color: "#d1d5db",
                        fontSize: "0.85em",
                        marginTop: "10px",
                        lineHeight: "1.5",
                      }}
                    >
                      {technicalIndicatorsAnalysis.ema_20.explanation}
                    </p>
                  )}
                </div>
              )}

              {technicalIndicatorsAnalysis.ema_50 && (
                <div
                  style={{
                    background: "#0f172a",
                    padding: "15px",
                    borderRadius: "8px",
                    border: "1px solid #1e293b",
                  }}
                >
                  <h3
                    style={{
                      color: "#60a5fa",
                      fontSize: "1em",
                      fontWeight: 600,
                      marginBottom: "10px",
                    }}
                  >
                    EMA 50 (Long-term)
                  </h3>
                  {technicalIndicatorsAnalysis.ema_50.value !== undefined && (
                    <div style={{ marginBottom: "8px" }}>
                      <span style={{ color: "#9ca3af", fontSize: "0.85em" }}>
                        Value:{" "}
                      </span>
                      <span
                        style={{
                          color: "#e2e8f0",
                          fontWeight: 600,
                        }}
                      >
                        {technicalIndicatorsAnalysis.ema_50.value.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {technicalIndicatorsAnalysis.ema_50.position_vs_price && (
                    <div style={{ marginBottom: "8px" }}>
                      <span style={{ color: "#9ca3af", fontSize: "0.85em" }}>
                        Position:{" "}
                      </span>
                      <span
                        style={{
                          color:
                            technicalIndicatorsAnalysis.ema_50
                              .position_vs_price === "Above"
                              ? "#22c55e"
                              : technicalIndicatorsAnalysis.ema_50
                                  .position_vs_price === "Below"
                              ? "#ef4444"
                              : "#60a5fa",
                          fontWeight: 600,
                        }}
                      >
                        {technicalIndicatorsAnalysis.ema_50.position_vs_price}
                      </span>
                    </div>
                  )}
                  {technicalIndicatorsAnalysis.ema_50.explanation && (
                    <p
                      style={{
                        color: "#d1d5db",
                        fontSize: "0.85em",
                        marginTop: "10px",
                        lineHeight: "1.5",
                      }}
                    >
                      {technicalIndicatorsAnalysis.ema_50.explanation}
                    </p>
                  )}
                </div>
              )}

              {technicalIndicatorsAnalysis.ema_alignment && (
                <div
                  style={{
                    background: "#0f172a",
                    padding: "15px",
                    borderRadius: "8px",
                    border: "1px solid #1e293b",
                    gridColumn: "1 / -1",
                  }}
                >
                  <h3
                    style={{
                      color: "#60a5fa",
                      fontSize: "1em",
                      fontWeight: 600,
                      marginBottom: "10px",
                    }}
                  >
                    EMA Alignment
                  </h3>
                  {technicalIndicatorsAnalysis.ema_alignment.alignment && (
                    <div style={{ marginBottom: "8px" }}>
                      <span style={{ color: "#9ca3af", fontSize: "0.85em" }}>
                        Alignment:{" "}
                      </span>
                      <span
                        style={{
                          color:
                            technicalIndicatorsAnalysis.ema_alignment
                              .alignment === "Bullish"
                              ? "#22c55e"
                              : technicalIndicatorsAnalysis.ema_alignment
                                  .alignment === "Bearish"
                              ? "#ef4444"
                              : "#60a5fa",
                          fontWeight: 600,
                          fontSize: "1.1em",
                        }}
                      >
                        {technicalIndicatorsAnalysis.ema_alignment.alignment}
                      </span>
                    </div>
                  )}
                  {technicalIndicatorsAnalysis.ema_alignment.explanation && (
                    <p
                      style={{
                        color: "#d1d5db",
                        fontSize: "0.9em",
                        marginTop: "10px",
                        lineHeight: "1.5",
                      }}
                    >
                      {technicalIndicatorsAnalysis.ema_alignment.explanation}
                    </p>
                  )}
                </div>
              )}
            </div>

            {technicalIndicatorsAnalysis.overall_assessment && (
              <div
                style={{
                  background: "#0f172a",
                  padding: "20px",
                  borderRadius: "8px",
                  borderLeft: "3px solid #3b82f6",
                  marginTop: "10px",
                }}
              >
                <h3
                  style={{
                    color: "#3b82f6",
                    fontSize: "1em",
                    fontWeight: 600,
                    marginBottom: "10px",
                  }}
                >
                  Overall Assessment
                </h3>
                <p
                  style={{
                    color: "#d1d5db",
                    fontSize: "0.95em",
                    lineHeight: "1.6",
                  }}
                >
                  {technicalIndicatorsAnalysis.overall_assessment}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
