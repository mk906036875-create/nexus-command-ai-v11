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
   DOM HELPER
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

  /*
    Higher conversion = better
    Lower cancellation = better
    Lower fulfillment pressure = better
    Lower response delay = better
  */

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

  health = Math.round(clamp(health, 35, 98));

  return health;
}


/* =========================================================
   CONFIDENCE ENGINE
========================================================= */

function calculateConfidence(health) {

  const confidence =
    Math.round(
      clamp(
        82 + Math.abs(health - 70) * 0.35,
        78,
        97
      )
    );

  return confidence;
}


/* =========================================================
   SIGNAL STATUS
========================================================= */

function getStatus(value, type) {

  if (type === "conversion") {

    if (value < 2.5) return "CRITICAL";
    if (value < 3.2) return "HIGH RISK";
    if (value < 4) return "
