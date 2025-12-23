require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./db/db");
const notificationRoutes = require("./routes/notification.route");

const app = express();

/* -------------------- DATABASE -------------------- */
connectDB();

/* -------------------- MIDDLEWARE -------------------- */
app.use(cors());
app.use(express.json());

/* -------------------- ROUTES -------------------- */
app.use("/api", notificationRoutes);

/* -------------------- HEALTH CHECK -------------------- */
app.get("/", (req, res) => {
  res.json({ message: "Backend is running" });
});

/* -------------------- SERVER -------------------- */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
