 /* =========================================================
   NEXUS COMMAND AI — V11.1
   ENTERPRISE CEO INTELLIGENCE ENGINE
   FINAL SCRIPT.JS
========================================================= */

"use strict";

/* =========================================================
   GLOBAL STATE
========================================================= */

const NexusState = {
  simulationRunning: false,
  strategyExecuted: false,
  lastHealth: 82,
  lastConfidence: 92
};


/* =========================================================
   DOM HELPERS
========================================================= */

function $(id) {
  return document.getElementById(id);
}

function setText(id, value) {
  const el = $(id);
  if (el) el.textContent = value;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function money(value) {
  if (value >= 1000000) {
    return "$" + (value / 1000000).toFixed(2) + "M";
  }

  if (value >= 1000) {
    return "$" + Math.round(value / 1000) + "K";
  }

  return "$" + Math.round(value);
}


/* =========================================================
   READ LIVE SIGNALS
========================================================= */

function getSignals() {
  return {
    conversion: parseFloat($("conversion")?.value || 2.84),
    cancellation: parseFloat($("cancellation")?.value || 8.7),
    fulfillment: parseFloat($("fulfillment")?.value || 12.4),
    response: parseFloat($("response")?.value || 31)
  };
}


/* =========================================================
   HEALTH ENGINE
========================================================= */

function calculateHealth(signals) {

  const conversionScore =
    ((signals.conversion - 1) / 5) * 35;

  const cancellationScore =
    ((20 - signals.cancellation) / 20) * 25;

  const fulfillmentScore =
    ((30 - signals.fulfillment) / 30) * 20;

  const responseScore =
    ((100 - signals.response) / 100) * 20;

  const health =
    conversionScore +
    cancellationScore +
    fulfillmentScore +
    responseScore;

  return Math.round(clamp(health, 35, 98));
}


/* =========================================================
   CONFIDENCE ENGINE
========================================================= */

function calculateConfidence(health) {
  return Math.round(
    clamp(
      82 + Math.abs(health - 70) * 0.35,
      78,
      97
    )
  );
}


/* =========================================================
   SIGNAL STATUS
========================================================= */

function getStatus(value, type) {

  if (type === "conversion") {
    if (value < 2.5) return "CRITICAL";
    if (value < 3.2) return "HIGH RISK";
    if (value < 4) return "WATCH";
    return "HEALTHY";
  }

  if (type === "cancellation") {
    if (value >= 12) return "CRITICAL";
    if (value >= 7) return "HIGH";
    if (value >= 4) return "WATCH";
    return "STABLE";
  }

  if (type === "fulfillment") {
    if (value >= 20) return "CRITICAL";
    if (value >= 10) return "HIGH";
    if (value >= 5) return "WATCH";
    return "STABLE";
  }

  if (type === "response") {
    if (value >= 60) return "CRITICAL";
    if (value >= 30) return "WATCH";
    if (value >= 15) return "MODERATE";
    return "FAST";
  }

  return "WATCH";
}


/* =========================================================
   DECISION ENGINE
========================================================= */

function calculateDecision(signals) {

  const conversionRisk =
    Math.max(0, 4 - signals.conversion) * 30;

  const cancellationRisk =
    signals.cancellation * 2;

  const fulfillmentRisk =
    signals.fulfillment * 1.4;

  const responseRisk =
    signals.response * 0.8;

  const risks = [
    {
      score: conversionRisk,
      title: "Recover high-intent conversions",
      text:
        "Prioritize checkout recovery before increasing acquisition spend.",
      recovery: 150000,
      action: "Recover high-intent customers"
    },
    {
      score: cancellationRisk,
      title: "Reduce cancellation pressure",
      text:
        "Trigger retention workflows for customers showing cancellation intent.",
      recovery: 96000,
      action: "Reduce cancellation pressure"
    },
    {
      score: fulfillmentRisk,
      title: "Stabilize fulfillment performance",
      text:
        "Reduce service friction before scaling additional demand.",
      recovery: 72000,
      action: "Stabilize fulfillment performance"
    },
    {
      score: responseRisk,
      title: "Improve response speed",
      text:
        "Reduce response delays across high-value customer interactions.",
      recovery: 68000,
      action: "Improve response speed"
    }
  ];

  risks.sort((a, b) => b.score - a.score);

  return risks[0];
}


/* =========================================================
   UPDATE DASHBOARD
========================================================= */

function updateDashboard() {

  const signals = getSignals();

  const health = calculateHealth(signals);
  const confidence = calculateConfidence(health);
  const decision = calculateDecision(signals);

  NexusState.lastHealth = health;
  NexusState.lastConfidence = confidence;

  /* SIGNAL VALUES */

  setText(
    "conversionValue",
    signals.conversion.toFixed(2) + "%"
  );

  setText(
    "cancelValue",
    signals.cancellation.toFixed(1) + "%"
  );

  setText(
    "fulfillValue",
    signals.fulfillment.toFixed(1) + "%"
  );

  setText(
    "responseValue",
    Math.round(signals.response) + "%"
  );

  /* SIGNAL STATUS */

  setText(
    "conversionStatus",
    getStatus(signals.conversion, "conversion")
  );

  setText(
    "cancelStatus",
    getStatus(signals.cancellation, "cancellation")
  );

  setText(
    "fulfillStatus",
    getStatus(signals.fulfillment, "fulfillment")
  );

  setText(
    "responseStatus",
    getStatus(signals.response, "response")
  );

  /* HEALTH */

  setText("healthScore", health);
  setText("confidence", confidence + "%");

  const healthBar = $("healthBar");

  if (healthBar) {
    healthBar.style.width = health + "%";
  }

  let healthStatus = "SYSTEM STABLE";

  if (health < 50) {
    healthStatus = "CRITICAL PRESSURE";
  } else if (health < 65) {
    healthStatus = "HIGH PRESSURE";
  } else if (health < 80) {
    healthStatus = "WATCH CONDITION";
  }

  setText("healthStatus", healthStatus);

  /* SIGNAL COUNT */

  const signalCount =
    24 +
    Math.round(
      signals.cancellation +
      signals.fulfillment / 2
    );

  setText(
    "signalsAnalyzed",
    clamp(signalCount, 24, 96)
  );

  /* DECISION */

  setText("decision", decision.title);
  setText("decisionText", decision.text);
  setText(
    "priorityRecovery",
    money(decision.recovery)
  );

  const decisionConfidence =
    clamp(
      confidence - 3 + Math.round(decision.score / 20),
      78,
      96
    );

  setText(
    "decisionConfidence",
    decisionConfidence + "%"
  );

  /* PRIORITY */

  let priority = "HIGH";
  let priorityText = "Conversion recovery";

  if (health >= 82) {
    priority = "MEDIUM";
    priorityText = "Growth optimization";
  }

  if (health < 55) {
    priority = "CRITICAL";
    priorityText = "Immediate revenue protection";
  }

  setText("priority", priority);
  setText("priorityText", priorityText);

  /* REVENUE MODEL */

  const pressure =
    clamp(
      (
        (4 - signals.conversion) * 0.35 +
        signals.cancellation * 0.025 +
        signals.fulfillment * 0.018 +
        signals.response * 0.008
      ),
      0.05,
      0.95
    );

  const leakage =
    1200000 + pressure * 1400000;

  const recovery =
    leakage * clamp(
      0.28 + (100 - health) / 300,
      0.25,
      0.65
    );

  const uplift =
    recovery * 0.25;

  const forecast =
    4200000 + recovery * 1.65;

  setText(
    "revenueRisk",
    money(leakage * 1.32)
  );

  setText(
    "recoverable",
    money(recovery)
  );

  const customers =
    Math.round(
      11000 +
      pressure * 14000
    );

  setText(
    "customers",
    customers.toLocaleString()
  );

  setText(
    "revenueLeakage",
    money(leakage)
  );

  setText(
    "recoveryPotential",
    money(recovery)
  );

  setText(
    "projectedUplift",
    "+" + money(uplift)
  );

  setText(
    "forecastRevenue",
    money(forecast)
  );

  /* OUTLOOK */

  let outlook =
    "RECOVERY OPPORTUNITY DETECTED";

  if (health < 55) {
    outlook =
      "IMMEDIATE REVENUE PROTECTION REQUIRED";
  } else if (health >= 85) {
    outlook =
      "BUSINESS MOMENTUM HEALTHY";
  }

  setText(
    "revenueOutlook",
    outlook
  );

  setText(
    "modelConfidence",
    Math.min(97, confidence + 1) + "%"
  );

  /* CEO INSIGHT */

  generateCEOInsight(
    signals,
    health,
    decision
  );

  /* ACTION CENTER */

  setText(
    "actionTitle",
    decision.action
  );

  setText(
    "actionDescription",
    decision.text
  );

  setText(
    "actionImpact",
    "+" + money(uplift)
  );
}


/* =========================================================
   CEO AI INSIGHT
========================================================= */

function generateCEOInsight(
  signals,
  health,
  decision
) {

  let insight =
    "NEXUS detects a manageable revenue opportunity.";

  let detail =
    "The highest-value move is to address the dominant pressure signal before scaling growth.";

  if (health < 55) {

    insight =
      "Executive attention required: revenue pressure is elevated.";

    detail =
      "Protect existing revenue first. NEXUS recommends resolving the highest-risk operating signal before additional acquisition spend.";
  }

  else if (
    signals.conversion < 3.0
  ) {

    insight =
      "Conversion leakage is currently the dominant revenue pressure.";

    detail =
      "High-intent customer recovery should be prioritized because improving conversion can create faster revenue impact than increasing acquisition.";
  }

  else if (
    signals.cancellation >= 10
  ) {

    insight =
      "Customer retention pressure is becoming a material risk.";

    detail =
      "Deploy targeted retention interventions before cancellation behavior compounds into larger revenue leakage.";
  }

  else if (
    signals.fulfillment >= 15
  ) {

    insight =
      "Operational friction is limiting revenue performance.";

    detail =
      "Stabilize fulfillment capacity and customer experience before accelerating demand generation.";
  }

  else if (
    signals.response >= 45
  ) {

    insight =
      "Response latency is creating avoidable conversion pressure.";

    detail =
      "Prioritize faster responses for high-value opportunities to reduce preventable revenue loss.";
  }

  else if (health >= 85) {

    insight =
      "Business signals indicate strong operating momentum.";

    detail =
      "NEXUS recommends shifting from protection toward controlled growth and conversion optimization.";
  }

  setText(
    "ceoInsight",
    insight
  );

  setText(
    "ceoInsightText",
    detail
  );
}


/* =========================================================
   LIVE SIMULATION
========================================================= */

function runSimulation() {

  if (NexusState.simulationRunning) {
    return;
  }

  NexusState.simulationRunning = true;

  const button =
   
