const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

// ================= DATABASE =================
mongoose.connect("mongodb://127.0.0.1:27017/zetiify")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const Startup = require("./models/Startup");

// ================= LOGIN =================
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "investor@zetiify.com" && password === "123456") {
    return res.json({ success: true });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

// ================= SCORING =================
function calculateScore(s) {
  return (
    s.traction * 0.25 +
    s.team * 0.30 +
    s.market * 0.25 +
    s.product * 0.20
  ).toFixed(1);
}

// ================= CREATE STARTUP =================
app.post("/api/startup", async (req, res) => {
  const data = req.body;

  const score = calculateScore(data);

  const startup = new Startup({
    name: data.name,
    score,
    traction: data.traction,
    team: data.team,
    market: data.market,
    product: data.product
  });

  await startup.save();

  res.json(startup);
});

// ================= GET ALL =================
app.get("/api/startups", async (req, res) => {
  const startups = await Startup.find().sort({ score: -1 });
  res.json(startups);
});

// ================= UPDATE DECISION =================
app.put("/api/startup/:id", async (req, res) => {
  const updated = await Startup.findByIdAndUpdate(
    req.params.id,
    { decision: req.body.decision },
    { new: true }
  );

  res.json(updated);
});

// ================= FRONTEND =================
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on " + PORT));