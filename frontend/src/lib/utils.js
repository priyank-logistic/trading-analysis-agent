export function parseAnalysis(text) {
  let jsonData = null;
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonData = JSON.parse(jsonMatch[0]);
    } else {
      jsonData = JSON.parse(text);
    }
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    return {
      marketStructure: {},
      choch: {},
      resistance: [],
      support: [],
      bullishOB: [],
      bearishOB: [],
      fvg: [],
      setups: [],
    };
  }

  const data = {
    marketStructure: {
      trend: jsonData.market_structure?.current_trend || "Not identified",
      trendReasoning: jsonData.market_structure?.trend_reasoning || "",
      price: jsonData.market_structure?.current_price || "N/A",
      phase: jsonData.market_structure?.market_phase || "Not identified",
      phaseReasoning: jsonData.market_structure?.phase_reasoning || "",
    },
    choch: {
      type: jsonData.change_of_character?.type || "Not identified",
      level: jsonData.change_of_character?.level || "N/A",
      date: jsonData.change_of_character?.date || "N/A",
      explanation: jsonData.change_of_character?.explanation || "",
    },
    resistance: (jsonData.resistance_levels || []).map((r) => ({
      label: r.label || "",
      value: r.price || "N/A",
      description: r.description || "",
    })),
    support: (jsonData.support_levels || []).map((s) => ({
      label: s.label || "",
      value: s.price || "N/A",
      description: s.description || "",
    })),
    bullishOB: (jsonData.bullish_order_blocks || []).map((ob) => ({
      range: ob.range || "N/A",
      date: ob.date || "N/A",
      strength: ob.strength || "Moderate",
      reasoning: ob.reasoning || "",
    })),
    bearishOB: (jsonData.bearish_order_blocks || []).map((ob) => ({
      range: ob.range || "N/A",
      date: ob.date || "N/A",
      strength: ob.strength || "Moderate",
      reasoning: ob.reasoning || "",
    })),
    fvg: (jsonData.fair_value_gaps || []).map((fvg) => ({
      type: fvg.type || "Bullish",
      range: fvg.range || "N/A",
      date: fvg.date || "N/A",
      explanation: fvg.explanation || "",
    })),
    setups: (jsonData.trading_setups || []).map((setup) => ({
      name: setup.name || "N/A",
      probability: setup.probability || "Medium",
      condition: setup.condition || "N/A",
      riskReward: setup.risk_reward || "N/A",
      entry: setup.entry || "N/A",
      entryExplanation: setup.entry_explanation || "",
      stopLoss: setup.stop_loss || "N/A",
      stopLossExplanation: setup.stop_loss_explanation || "",
      targets: setup.targets || [],
      targetsExplanation: setup.targets_explanation
        ? {
            tp1: setup.targets_explanation.tp1 || "",
            tp2: setup.targets_explanation.tp2 || "",
            tp3: setup.targets_explanation.tp3 || "",
          }
        : null,
      calculation: setup.calculation || "",
      timeframe_analysis: setup.timeframe_analysis
        ? {
            htf_bias: setup.timeframe_analysis.htf_bias || "Neutral",
            htf_timeframe: setup.timeframe_analysis.htf_timeframe || "N/A",
            htf_poi: setup.timeframe_analysis.htf_poi || "N/A",
            ltf_timeframe: setup.timeframe_analysis.ltf_timeframe || "N/A",
            ltf_confirmation:
              setup.timeframe_analysis.ltf_confirmation || "N/A",
            entry_reasoning: setup.timeframe_analysis.entry_reasoning || "",
            setup_type: setup.timeframe_analysis.setup_type || "N/A",
          }
        : null,
    })),
  };

  return data;
}
