/* =========================================================
   NEXUS COMMAND AI — V11
   AUTONOMOUS EXECUTIVE DECISION INTELLIGENCE
   LIVE SIGNAL ENGINE + CEO INSIGHT + WHAT-IF + LEAD DEMO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  updateDashboard();
  runSimulation(false);
});


/* =========================
   HELPER
========================= */

function $(id) {
  return document.getElementById(id);
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


/* =========================
   MAIN AI ENGINE
========================= */

function updateDashboard() {

  const conversion = parseFloat($("conversion")?.value || 2.84);
  const cancellation = parseFloat($("cancellation")?.value || 8.7);
  const fulfillment = parseFloat($("fulfillment")?.value || 12.4);
  const response = parseFloat($("response")?.value || 31);


  /* -------------------------
     BUSINESS HEALTH MODEL
  ------------------------- */

  let health = 100;

  health -= Math.max(0, (4 - conversion) * 8);
  health -= cancellation * 1.4;
  health -= fulfillment * 0.7;
  health -= response * 0.22;

  health = Math.round(
    Math.max(20, Math.min(98, health))
  );


  const risk = 100 - health;


  /* -------------------------
     FINANCIAL MODEL
  ------------------------- */

  const revenueRisk = Math.round(
    1800000 + risk * 18000
  );

  const recoverable = Math.round(
    revenueRisk * (0.20 + risk / 500)
  );

  const customers = Math.round(
    9000 + risk * 130
  );


  /* -------------------------
     KPI UPDATE
  ------------------------- */

  if ($("healthScore"))
    $("healthScore").textContent = health;

  if ($("healthBar"))
    $("healthBar").style.width = health + "%";

  if ($("revenueRisk"))
    $("revenueRisk").textContent = money(revenueRisk);

  if ($("recoverable"))
    $("recoverable").textContent = money(recoverable);

  if ($("customers"))
    $("customers").textContent =
      customers.toLocaleString();


  /* -------------------------
     HEALTH STATUS
  ------------------------- */

  let healthStatus = "SYSTEM STABLE";

  if (health < 50) {
    healthStatus = "HIGH RISK";
  }
  else if (health < 75) {
    healthStatus = "ATTENTION REQUIRED";
  }

  if ($("healthStatus"))
    $("healthStatus").textContent = healthStatus;


  /* -------------------------
     SIGNAL VALUES
  ------------------------- */

  if ($("conversionValue"))
    $("conversionValue").textContent =
      conversion.toFixed(2) + "%";

  if ($("cancelValue"))
    $("cancelValue").textContent =
      cancellation.toFixed(1) + "%";

  if ($("fulfillValue"))
    $("fulfillValue").textContent =
      fulfillment.toFixed(1) + "%";

  if ($("responseValue"))
    $("responseValue").textContent =
      response.toFixed(0) + "%";


  /* -------------------------
     SIGNAL STATUS
  ------------------------- */

  if ($("conversionStatus")) {

    $("conversionStatus").textContent =
      conversion < 2.5
        ? "CRITICAL"
        : conversion < 3.5
        ? "HIGH"
        : "STABLE";
  }


  if ($("cancelStatus")) {

    $("cancelStatus").textContent =
      cancellation > 10
        ? "CRITICAL"
        : cancellation > 7
        ? "HIGH"
        : cancellation > 4
        ? "WATCH"
        : "STABLE";
  }


  if ($("fulfillStatus")) {

    $("fulfillStatus").textContent =
      fulfillment > 18
        ? "CRITICAL"
        : fulfillment > 10
        ? "HIGH"
        : fulfillment > 5
        ? "WATCH"
        : "STABLE";
  }


  if ($("responseStatus")) {

    $("responseStatus").textContent =
      response > 50
        ? "CRITICAL"
        : response > 25
        ? "WATCH"
        : "STABLE";
  }


  /* =========================
     AI DECISION ENGINE
  ========================= */

  let decision =
    "Optimize healthy revenue growth";

  let decisionText =
    "Business signals are stable. Focus on conversion, retention and scalable growth.";

  let priority =
    "MEDIUM";

  let priorityText =
    "Growth optimization";


  if (conversion < 2.8) {

    decision =
      "Recover high-intent conversions";

    decisionText =
      "Recover checkout and high-intent opportunities before increasing acquisition spend.";

    priority =
      "HIGH";

    priorityText =
      "Conversion recovery";

  }

  else if (cancellation > 9) {

    decision =
      "Reduce cancellation leakage";

    decisionText =
      "Prioritize retention intervention and proactive cancellation prevention.";

    priority =
      "HIGH";

    priorityText =
      "Retention recovery";

  }

  else if (fulfillment > 12) {

    decision =
      "Stabilize fulfillment performance";

    decisionText =
      "Reduce operational SLA pressure before it creates customer churn.";

    priority =
      "HIGH";

    priorityText =
      "Fulfillment recovery";

  }

  else if (response > 50) {

    decision =
      "Accelerate customer response";

    decisionText =
      "Reduce response delays to protect high-intent revenue opportunities.";

    priority =
      "HIGH";

    priorityText =
      "Response optimization";
  }


  if ($("decision"))
    $("decision").textContent = decision;

  if ($("decisionText"))
    $("decisionText").textContent = decisionText;

  if ($("priority"))
    $("priority").textContent = priority;

  if ($("priorityText"))
    $("priorityText").textContent = priorityText;

  if ($("priorityRecovery"))
    $("priorityRecovery").textContent =
      money(recoverable * 0.25);


  /* =========================
     CEO INSIGHT
  ========================= */

  generateCEOInsight(
    health,
    conversion,
    cancellation,
    fulfillment,
    response,
    recoverable
  );
}


/* =========================
   CEO AI INSIGHT
========================= */

function generateCEOInsight(
  health,
  conversion,
  cancellation,
  fulfillment,
  response,
  recoverable
) {

  let headline =
    "NEXUS detects a stable operating environment.";

  let description =
    "Current signals indicate controlled business pressure. Focus on scalable revenue optimization.";

  if (health < 50) {

    headline =
      "Critical revenue pressure detected.";

    description =
      "Multiple business signals are creating material revenue exposure. Immediate intervention should be prioritized.";
  }

  else if (conversion < 2.5) {

    headline =
      "Conversion leakage is the highest-value intervention.";

    description =
      "NEXUS recommends recovering high-intent demand before increasing acquisition spend.";
  }

  else if (cancellation > 10) {

    headline =
      "Customer retention pressure is increasing.";

    description =
      "Cancellation behavior indicates a potential revenue leakage pattern requiring proactive intervention.";
  }

  else if (fulfillment > 18) {

    headline =
      "Operational fulfillment risk is elevated.";

    description =
      "SLA pressure may convert into customer dissatisfaction and future churn if not addressed.";
  }

  else if (response > 50) {

    headline =
      "Response latency is threatening revenue velocity.";

    description =
      "High response delay can reduce conversion probability across high-intent customer interactions.";
  }

  else if (health < 75) {

    headline =
      "Business pressure requires executive attention.";

    description =
      "NEXUS recommends targeted intervention before current exposure becomes more expensive.";
  }


  if ($("ceoInsight"))
    $("ceoInsight").textContent = headline;

  if ($("ceoInsightText"))
    $("ceoInsightText").textContent =
      description +
      " Estimated recoverable opportunity: " +
      money(recoverable) + ".";
}


/* =========================
   WHAT-IF SIMULATION
========================= */

function runSimulation(showToast = true) {

  const targetElement =
    $("targetConversion");

  if (!targetElement) return;

  const target =
    parseFloat(targetElement.value);


  if ($("targetValue"))
    $("targetValue").textContent =
      target.toFixed(2) + "%";


  let simulatedHealth =
    100 -
    Math.max(
      0,
      (4.5 - target) * 10
    );


  simulatedHealth =
    Math.round(
      Math.max(
        55,
        Math.min(98, simulatedHealth)
      )
    );


  if ($("simHealth"))
    $("simHealth").textContent =
      simulatedHealth;


  /* Estimated revenue opportunity */

  const improvement =
    Math.max(
      0,
      target - 2.84
    );

  const estimatedGain =
    improvement * 95000;


  if ($("simulation
