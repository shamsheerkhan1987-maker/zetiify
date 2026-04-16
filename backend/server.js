const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// ================= LOGIN =================
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "investor@zetiify.com" && password === "123456") {
    return res.json({ success: true });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

// ================= SCORING ENGINE =================
function calculateScore(data) {
  // 1. Compelling Story (30)
  const story =
    (data.problem * 10 +
      data.solution * 6 +
      data.insight * 6 +
      data.marketSize * 5 +
      data.narrative * 3) /
    100 * 30;

  // 2. Team (35)
  const team =
    (data.founderFit * 12 +
      data.execution * 10 +
      data.decision * 6 +
      data.learning * 4 +
      data.hiring * 3) /
    100 * 35;

  // 3. Traction (15)
  const traction =
    (data.productReady * 6 +
      data.users * 4 +
      data.validation * 3 +
      data.momentum * 2) /
    100 * 15;

  // 4. Business (10)
  const business =
    (data.monetization * 4 +
      data.pricing * 3 +
      data.scalability * 2 +
      data.cost * 1) /
    100 * 10;

  // 5. Ask (10)
  const ask =
    (data.funding * 4 +
      data.useOfFunds * 3 +
      data.runway * 2 +
      data.valuation * 1) /
    100 * 10;

  return (story + team + traction + business + ask).toFixed(1);
}

// ================= SCORE API =================
app.post("/api/score", (req, res) => {
  const score = calculateScore(req.body);
  res.json({ score });
});

// ================= FRONTEND =================
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on " + PORT));