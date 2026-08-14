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

  let health =
    conversionScore +
    cancellationScore +
    fulfillmentScore +
    responseScore;

  return Math.round(
    clamp(health, 35, 98)
  );
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
   STATUS ENGINE
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
    (4 - signals.conversion) * 30;

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
      text: "Prioritize checkout recovery before increasing acquisition spend.",
      recovery: 150000,
      action: "Recover high-intent customers"
    },
    {
      score: cancellationRisk,
      title: "Reduce cancellation pressure",
      text: "Trigger retention workflows for customers showing cancellation intent.",
      recovery: 96000,
      action: "Reduce cancellation pressure"
    },
    {
      score: fulfillmentRisk,
      title: "Stabilize fulfillment performance",
      text: "Reduce service friction before scaling additional demand.",
      recovery: 72000,
      action: "Stabilize fulfillment performance"
    },
    {
      score: responseRisk,
      title: "Improve response speed",
      text: "Reduce response delays across high-value customer interactions.",
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

  /* -----------------------------------------
     SIGNAL VALUES
  ----------------------------------------- */

  setText(
    "conversionValue",
    signals.conversion.toFixed(2) + "%"
  );

  set
