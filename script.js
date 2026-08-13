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
   READ SIGNALS
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

  const health = Math.round(
    clamp(
      conversionScore +
      cancellationScore +
      fulfillmentScore +
      responseScore,
      35,
      98
    )
  );

  return health;
}


/* =========================================================
   CONFIDENCE
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
    if (value >= 8) return "HIGH";
    if (value >= 5) return "WATCH";
    return "HEALTHY";
  }

  if (type === "fulfillment") {
    if (value >= 18) return "CRITICAL";
    if (value >= 10) return "HIGH";
    if (value >= 6) return "WATCH";
    return "HEALTHY";
  }

  if (type === "response") {
    if (value >= 60) return "CRITICAL";
    if (value >= 35) return "HIGH";
    if (value >= 20) return "WATCH";
    return "HEALTHY";
  }

  return "WATCH";
}


/* =========================================================
   STATUS COLOR
========================================================= */

function statusColor(status) {

  if (status === "CRITICAL") return "#ff4d67";
  if (status === "HIGH" || status === "HIGH RISK") return "#ffb020";
  if (status === "WATCH") return "#f3c969";

  return "#00e6b8";
}


/* =========================================================
   AI DECISION ENGINE
========================================================= */

function generateDecision(signals, health) {

  const risks = [
    {
      score: signals.conversion < 3.2 ? 5 : 1,
      title: "Recover high-intent conversions",
      text: "Prioritize checkout recovery before increasing acquisition spend.",
      recovery: 150000
    },
    {
      score: signals.cancellation >= 8 ? 4 : 1,
      title: "Reduce cancellation pressure",
      text: "Trigger retention workflows for customers showing cancellation intent.",
      recovery: 96000
    },
    {
      score: signals.fulfillment >= 10 ? 4 : 1,
      title: "Stabilize fulfillment performance",
      text: "Reduce service friction before scaling additional demand.",
      recovery: 72000
    },
    {
      score: signals.response >= 30 ? 3 : 1,
      title: "Accelerate response operations",
      text: "Reduce response delay across high-value customer interactions.",
      recovery: 58000
    }
  ];

  risks.sort((a, b) => b.score - a.score);

  const top = risks[0];

  const confidence = clamp(
    82 + Math.round(Math.abs(health - 70) * 0.45),
    78,
    97
  );

  return {
    ...top,
    confidence
  };
}


/* =========================================================
   CEO INSIGHT
========================================================= */

function generateCEOInsight(signals, health) {

  let title;
  let text;

  if (health < 55) {

    title = "Immediate revenue intervention required.";

    text =
      "Multiple business pressure signals indicate elevated revenue exposure. " +
      "NEXUS recommends stabilizing conversion, retention and operations before adding growth spend.";

  } else if (health < 70) {

    title = "Revenue pressure is building.";

    text =
      "The current signal mix indicates meaningful business leakage. " +
      "Management should prioritize the highest-value recovery opportunity first.";

  } else if (health < 82) {

    title = "Business performance is under watch.";

    text =
      "The system detects moderate operational pressure. " +
      "Targeted recovery actions can improve performance before the exposure becomes material.";

  } else {

    title = "Business system is operating in a healthy range.";

    text =
      "NEXUS detects controlled business pressure with strong recovery potential. " +
      "Continue monitoring leading indicators while optimizing high-value opportunities.";
  }

  return { title, text };
}


/* =========================================================
   MAIN DASHBOARD UPDATE
========================================================= */

function updateDashboard() {

  const signals = getSignals();

  const health = calculateHealth(signals);

  const confidence = calculateConfidence(health);

  const decision = generateDecision(signals, health);

  const insight = generateCEOInsight(signals, health);


  /* SIGNAL VALUES
