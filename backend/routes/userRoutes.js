const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const authenticateToken = require("../middleware/authMiddleware");
const isSuperadmin = require("../middleware/isSuperadmin");

const { User } = require("../models");

// GET semua user (hanya superadmin)
router.get("/", authenticateToken, isSuperadmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "email", "role"],
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data user" });
  }
});

// POST tambah user (hanya superadmin)
router.post("/", authenticateToken, isSuperadmin, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: "User berhasil dibuat", user: newUser });
  } catch (err) {
    res.status(500).json({ error: "Gagal menambahkan user" });
  }
});

// PUT edit user (hanya superadmin)
router.put("/:id", authenticateToken, isSuperadmin, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

    // Jika password dikirim, update juga
    let updateData = { username, email, role };
    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await user.update(updateData);
    res.json({ message: "User berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ error: "Gagal memperbarui user" });
  }
});

// DELETE hapus user (hanya superadmin)
router.delete("/:id", authenticateToken, isSuperadmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

    await user.destroy();
    res.json({ message: "User berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: "Gagal menghapus user" });
  }
});

module.exports = router;
