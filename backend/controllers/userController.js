// const User = require("../models/User");
// const bcrypt = require("bcryptjs");

// exports.updateProfile = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const updatedData = {};
//     if (email) updatedData.email = email;
//     if (password) updatedData.password = await bcrypt.hash(password, 10);

//     await User.update(updatedData, { where: { id: req.user.id } });

//     res.json({ message: "Profil berhasil diperbarui" });
//   } catch (error) {
//     console.error("Error updating profile:", error);
//     res.status(500).json({ error: "Gagal memperbarui profil" });
//   }
// };

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ dari middleware autentikasi
    const { email, password } = req.body;

    const updatedFields = {};

    if (email) updatedFields.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedFields.password = hashedPassword;
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    await user.update(updatedFields);

    res.status(200).json({ message: "Profil berhasil diperbarui" });
  } catch (error) {
    console.error("❌ Gagal update profil:", error.message);
    res.status(500).json({ error: "Terjadi kesalahan saat update profil" });
  }
};

module.exports = {
  updateProfile,
};
