const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Demo login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "investor@zetiify.com" && password === "123456") {
    return res.json({ role: "investor", token: "demo-token" });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

// Demo deals
app.get("/api/deals", (req, res) => {
  res.json([
    { name: "Fintech AI", score: 92, stage: "Seed", ask: "₹2 Cr" },
    { name: "HealthTech Pro", score: 78, stage: "Series A", ask: "₹10 Cr" }
  ]);
});

const path = require('path');

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));