"use strict";

/* =========================================================
   NEXUS COMMAND AI — V11.1
   COMPLETE WORKING SCRIPT
========================================================= */

const NexusState = {
  simulationRunning: false,
  strategyExecuted: false,
  lastHealth: 82,
  lastConfidence: 92
};

/* ================= DOM HELPERS ================= */

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

/* ================= SIGNALS ================= */

function getSignals() {
  return {
    conversion: parseFloat($("conversion")?.value || 2.84),
    cancellation: parseFloat($("cancellation")?.value || 8.7),
    fulfillment: parseFloat($("fulfillment")?.value || 12.4),
    response: parseFloat($("response")?.value || 31)
  };
}

/* ================= HEALTH ENGINE ================= */

function calculateHealth(s) {

  const conversionScore =
    ((s.conversion - 1) / 5) * 35;

  const cancellationScore =
    ((20 - s.cancellation) / 20) * 25;

  const fulfillmentScore =
    ((30 - s.fulfillment) / 30) * 20;

  const responseScore =
    ((100 - s.response) / 100) * 20;

  return Math.round(
    clamp(
      conversionScore +
      cancellationScore +
      fulfillmentScore +
      responseScore,
      35,
      98
    )
  );
}

/* ================= CONFIDENCE ================= */

function calculateConfidence(health) {
  return Math.round(
    clamp(
      82 + Math.abs(health - 70) * 0.35,
      78,
      97
    )
  );
}

/* ================= STATUS ================= */

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

/* ================= DECISION ENGINE ================= */

function calculateDecision(s) {

  const risks = [

    {
      score: (4 - s.conversion) * 30,
      title: "Recover high-intent conversions",
      text: "Prioritize checkout recovery before increasing acquisition spend.",
      recovery: 150000,
      action: "Recover high-intent customers"
    },

    {
      score: s.cancellation * 2,
      title: "Reduce cancellation pressure",
      text: "Trigger retention workflows for customers showing cancellation intent.",
      recovery: 96000,
      action: "Reduce cancellation pressure"
    },

    {
      score: s.fulfillment * 1.4,
      title: "Stabilize fulfillment performance",
      text: "Reduce service friction before scaling additional demand.",
      recovery: 72000,
      action: "Stabilize fulfillment performance"
    },

    {
      score: s.response * 0.8,
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
   MAIN DASHBOARD UPDATE
========================================================= */

function updateDashboard() {

  const s = getSignals();

  const health = calculateHealth(s);
  const confidence = calculateConfidence(health);
  const decision = calculateDecision(s);

  NexusState.lastHealth = health;
  NexusState.lastConfidence = confidence;

  /* SIGNAL NUMBERS */

  setText(
    "conversionValue",
    s.conversion.toFixed(2) + "%"
  );

  setText(
    "cancelValue",
    s.cancellation.toFixed(1) + "%"
  );

  setText(
    "fulfillValue",
    s.fulfillment.toFixed(1) + "%"
  );

  setText(
    "responseValue",
    Math.round(s.response) + "%"
  );

  /* SIGNAL STATUS */

  setText(
    "conversionStatus",
    getStatus(s.conversion, "conversion")
  );

  setText(
    "cancelStatus",
    getStatus(s.cancellation, "cancellation")
  );

  setText(
    "fulfillStatus",
    getStatus(s.fulfillment, "fulfillment")
  );

  setText(
    "responseStatus",
    getStatus(s.response, "response")
  );

  /* HEALTH */

  setText("healthScore", health);

  const healthBar = $("healthBar");

  if (healthBar) {
    healthBar.style.width = health + "%";
  }

  let healthStatus = "SYSTEM STABLE";

  if (health < 55) {
    healthStatus = "CRITICAL PRESSURE";
  } else if (health < 70) {
    healthStatus = "ELEVATED RISK";
  } else if (health < 82) {
    healthStatus = "WATCH CONDITION";
  }

  setText("healthStatus", healthStatus);

  setText(
    "confidence",
    confidence + "%"
  );

  /* SIGNAL COUNT */

  const signalCount =
    24 +
    Math.round(
      Math.abs(s.conversion - 2.84) * 4 +
      Math.abs(s.cancellation - 8.7) +
      Math.abs(s.fulfillment - 12.4) / 2
    );

  setText(
    "signalsAnalyzed",
    signalCount
  );

  /* ================= KPI ================= */

  const pressure =
    (100 - health) / 100;

  const revenueRisk =
    2400000 * (0.72 + pressure * 0.55);

  const recoverable =
    revenueRisk * (0.25 + health / 500);

  const customers =
    Math.round(
      12000 +
      pressure * 18000 +
      s.cancellation * 500
    );

  setText(
    "revenueRisk",
    money(revenueRisk)
  );

  setText(
    "recoverable",
    money(recoverable)
  );

  setText(
    "customers",
    customers.toLocaleString()
  );

  /* PRIORITY */

  let priority = "HIGH";
  let priorityText = "Conversion recovery";

  if (health < 55) {
    priority = "CRITICAL";
    priorityText = "Immediate revenue protection";
  } else if (health < 70) {
    priority = "HIGH";
    priorityText = decision.action;
  } else if (health < 82) {
    priority = "WATCH";
    priorityText = "Operational optimization";
  } else {
    priority = "STABLE";
    priorityText = "Growth optimization";
  }

  setText("priority", priority);
  setText("priorityText", priorityText);

  /* ================= AI DECISION ================= */

  setText(
    "decision",
    decision.title
  );

  setText(
    "decisionText",
    decision.text
  );

  setText(
    "priorityRecovery",
    money(decision.recovery)
  );

  setText(
    "decisionConfidence",
    confidence + "%"
  );

  /* ================= CEO INSIGHT ================= */

  let insight = "";
  let insightText = "";

  if (health < 55) {

    insight =
      "NEXUS detects critical revenue pressure.";

    insightText =
      "Immediate intervention is recommended before additional growth spending.";

  } else if (s.conversion < 3) {

    insight =
      "Conversion leakage is the primary executive risk.";

    insightText =
      "Recover high-intent demand before increasing acquisition investment.";

  } else if (s.cancellation >= 12) {

    insight =
      "Customer retention pressure is increasing.";

    insightText =
      "Prioritize retention workflows for customers showing cancellation intent.";

  } else if (s.fulfillment >= 20) {

    insight =
      "Operational fulfillment pressure is elevated.";

    insightText =
      "Stabilize service delivery before scaling additional demand.";

  } else if (s.response >= 60) {

    insight =
      "Response speed is creating revenue friction.";

    insightText =
      "Accelerate high-value customer response workflows.";

  } else {

    insight =
      "Business conditions show a recoverable growth opportunity.";

    insightText =
      "NEXUS recommends targeted optimization before aggressive expansion.";

  }

  setText("ceoInsight", insight);
  setText("ceoInsightText", insightText);

  /* ================= REVENUE IMPACT ================= */

  const leakage =
    revenueRisk * 0.76;

  const recoveryPotential =
    recoverable;

  const uplift =
    recoveryPotential * 0.25;

  const forecast =
    5000000 +
    recoveryPotential * 0.52;

  setText(
    "revenueLeakage",
    money(leakage)
  );

  setText(
    "recoveryPotential",
    money(recoveryPotential)
  );

  setText(
    "projectedUplift",
    "+" + money(uplift)
  );

  setText(
    "forecastRevenue",
    money(forecast)
  );

  setText(
    "modelConfidence",
    confidence + "%"
  );

  if (health < 60) {

    setText(
      "revenueOutlook",
      "CRITICAL RECOVERY REQUIRED"
    );

  } else if (health < 75) {

    setText(
      "revenueOutlook",
      "REVENUE PRESSURE DETECTED"
    );

  } else {

    setText(
      "revenueOutlook",
      "RECOVERY OPPORTUNITY DETECTED"
    );
  }

  /* ================= ACTION CENTER ================= */

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
    "+" + money(decision.recovery)
  );
}

/* =========================================================
   LIVE SIMULATION
========================================================= */

function runSimulation() {

  if (NexusState.simulationRunning) return;

  NexusState.simulationRunning = true;

  const button =
    document.querySelector(".hero .primary");

  if (button) {
    button.textContent = "● ANALYZING BUSINESS SIGNALS...";
    button.disabled = true;
  }

  let progress = 0;

  const timer = setInterval(() => {

    progress += 10;

    const conversion =
      2.84 +
      (Math.random() - 0.5) * 0.25;

    const cancellation =
      8.7 +
      (Math.random() - 0.5) * 1.5;

    const fulfillment =
      12.4 +
      (Math.random() - 0.5) * 2;

    const response =
      31 +
      (Math.random() - 0.5) * 8;

    const c = $("conversion");
    const ca = $("cancellation");
    const f = $("fulfillment");
    const r = $("response");

    if (c) c.value = clamp(conversion, 1, 6);
    if (ca) ca.value = clamp(cancellation, 0, 20);
    if (f) f.value = clamp(fulfillment, 0, 30);
    if (r) r.value = clamp(response, 0, 100);

    updateDashboard();

    if (progress >= 100) {

      clearInterval(timer);

      NexusState.simulationRunning = false;

      if (button) {
        button.textContent = "✓ SIMULATION COMPLETE";
        button.disabled = false;

        setTimeout(() => {
          button.textContent = "▶ RUN LIVE SIMULATION";
        }, 2200);
      }
    }

  }, 180);
}

/* =========================================================
   WHAT-IF SIMULATOR
========================================================= */

function runWhatIf() {

  const slider = $("targetSlider");

  if (!slider) return;

  const target =
    parseFloat(slider.value);

  setText(
    "targetConversion",
    target.toFixed(2) + "%"
  );

  const projectedHealth =
    Math.round(
      clamp(
        NexusState.lastHealth +
        (target - getSignals().conversion) * 16,
        35,
        99
      )
    );

  setText(
    "projectedHealth",
    projectedHealth
  );

  let status =
    "IMPROVEMENT DETECTED";

  if (projectedHealth < NexusState.lastHealth) {
    status = "NEGATIVE SCENARIO";
  } else if (
    projectedHealth === NexusState.lastHealth
  ) {
    status = "NO MATERIAL CHANGE";
  }

  setText(
    "projectionStatus",
    status
  );
}

/* =========================================================
   EXECUTE STRATEGY
========================================================= */

function executeStrategy() {

  NexusState.strategyExecuted = true;

  const button =
    document.querySelector(".execute");

  if (button) {

    button.textContent =
      "✓ STRATEGY EXECUTED";

    button.style.transform =
      "scale(.98)";

    setTimeout(() => {

      button.textContent =
        "EXECUTE RECOMMENDED STRATEGY →";

      button.style.transform =
        "";

    }, 2500);
  }

  setText(
    "ceoInsight",
    "Recommended strategy activated."
  );

  setText(
    "ceoInsightText",
    "NEXUS has prioritized the highest-value recovery action for executive review."
  );
}

/* =========================================================
   DEMO MODAL
========================================================= */

function openLeadForm() {

  const modal = $("leadModal");

  if (!modal) return;

  modal.classList.add("show");

  modal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow = "hidden";

  setTimeout(() => {

    const name =
      $("leadName");

    if (name) name.focus();

  }, 100);
}

function closeLeadForm() {

  const modal = $("leadModal");

  if (!modal) return;

  modal.classList.remove("show");

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow = "";
}

/* =========================================================
   LEAD SUBMIT
========================================================= */

function submitLead(event) {

  event.preventDefault();

  const name =
    $("leadName")?.value.trim();

  const email =
    $("leadEmail")?.value.trim();

  if (!name || !email) {
    alert("Please enter your name and business email.");
    return;
  }

  alert(
    "Thank you, " +
    name +
    ". Your NEXUS executive demo request has been received."
  );

  const form =
    $("leadForm");

  if (form) form.reset();

  closeLeadForm();
}

/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
  "keydown",
  function(event) {

    if (event.key === "Escape") {
      closeLeadForm();
    }

  }
);

/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    updateDashboard();
    runWhatIf();

    console.log(
      "NEXUS COMMAND AI V11.1 — ONLINE"
    );

  }
);
