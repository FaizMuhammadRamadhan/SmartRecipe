require("dotenv").config(); // ⬅️ wajib ditaruh sebelum akses process.env
const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./config/db");
const cors = require("cors");

const app = express();

// Aktifkan CORS agar frontend bisa akses API
app.use(
  cors({
    origin: "http://localhost:5173", // sesuaikan dengan alamat frontend kamu
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Log pengecekan routes
console.log("🔥 authRoutes loaded");
console.log("🔥 favoriteRoutes loaded");
console.log("🔥 indonesianRecipesRoutes loaded");

// ROUTES
const authRoutes = require("./routes/authRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const indonesianRecipesRoutes = require("./routes/indonesianRecipes");

app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/indonesian-recipes", indonesianRecipesRoutes); // ✅ Tambahkan baris ini!

// SYNC DB
sequelize
  .sync({ force: false })
  .then(() => console.log("✅ Database synced!"))
  .catch((err) => console.error("❌ Failed to sync database:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server berjalan di port ${PORT}`));
