require("dotenv").config(); 
const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const indonesianRecipesRoutes = require("./routes/indonesianRecipes");
const userRoutes = require("./routes/userRoutes"); 

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/indonesian-recipes", indonesianRecipesRoutes);
app.use("/api/users", userRoutes);


sequelize
  .sync({ force: false })
  .then(() => console.log("✅ Database synced!"))
  .catch((err) => console.error("❌ Failed to sync database:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server berjalan di port ${PORT}`));
