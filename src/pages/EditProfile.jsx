import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setEmail(decoded.email || ""); // Set email lama
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        "http://localhost:5000/api/users/update",
        { email, password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Swal.fire("Berhasil!", "Profil berhasil diperbarui.", "success").then(() =>
        navigate("/homepage")
      );
    } catch (error) {
      console.error("Gagal memperbarui profil:", error.message);
      Swal.fire("Gagal!", "Terjadi kesalahan saat memperbarui.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
      <div className="bg-white shadow-lg p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Profil</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full border rounded-md p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password Baru</label>
            <input
              type="password"
              className="w-full border rounded-md p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Isi jika ingin mengganti"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#79D7BE] text-white py-2 rounded-md hover:bg-[#62c4aa] transition"
          >
            Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
}
