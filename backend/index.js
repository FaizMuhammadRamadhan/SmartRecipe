require("dotenv").config(); // ⬅️ wajib ditaruh sebelum akses process.env
const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();
const cors = require("cors");

// Aktifkan CORS agar frontend bisa akses API
app.use(
  cors({
    origin: "http://localhost:5173", // sesuaikan dengan alamat frontend kamu
    credentials: true,
  })
);

app.use(express.json());

// ... route dan middleware lainnya

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Tambahkan log ini buat ngecek route terbaca atau tidak
console.log("🔥 authRoutes loaded");

app.use("/api/auth", authRoutes);

sequelize
  .sync({ force: false })
  .then(() => console.log("✅ Database synced!"))
  .catch((err) => console.error("❌ Failed to sync database:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server berjalan di port ${PORT}`));

const favoriteRoutes = require("./routes/favoriteRoutes");
app.use("/api/favorites", favoriteRoutes); // ✅ SUDAH BENAR!

