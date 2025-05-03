// const express = require('express');
// const cors = require('cors');
// const authRoutes = require('./routes/auth');
// const indonesianRecipeRoutes = require('./routes/indonesianRecipes'); // Tambahkan route untuk IndonesianRecipe
// const sequelize = require('./config/db');

// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(cors({
//   origin: "http://localhost:5173",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
// }));
// app.use(express.json());

// // Routes
// app.use('/auth', authRoutes);
// app.use('/api/indonesian-recipes', indonesianRecipeRoutes); // Tambahkan route ini

// // Sync DB & Start Server
// sequelize.sync({ alter: true })
//   .then(() => {
//     console.log('✅ Database synced!');
//     app.listen(PORT, () => console.log(`🚀 Server berjalan di port ${PORT}`));
//   })
//   .catch((error) => {
//     console.error('❌ Gagal sync database:', error);
//   });
