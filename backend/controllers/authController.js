require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const secretKey = process.env.JWT_SECRET;
const register = async (req, res) => {
  console.log("🔥 Register endpoint hit");

  const { username, email, password, role } = req.body;
  try {
    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: "Semua field wajib diisi!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        username: user.username,
      },
      secretKey,
      { expiresIn: "5h" }
    );

    res.status(201).json({
      message: "Register berhasil!",
      token,
    });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  console.log("🔥 Login endpoint hit");

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        username: user.username,
      },
      secretKey,
      { expiresIn: "5h" }
    );

    res.status(200).json({ token, role: user.role });
  } catch (error) {
    console.error("❌ Error logging in:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login };
