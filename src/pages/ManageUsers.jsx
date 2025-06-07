import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [formUser, setFormUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormUser({ ...formUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (isEdit) {
        await axios.put(`/api/users/${editId}`, formUser, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Berhasil!", "Data user diperbarui.", "success");
      } else {
        await axios.post("/api/users", formUser, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Berhasil!", "User baru ditambahkan.", "success");
      }
      setFormUser({ username: "", email: "", password: "", role: "user" });
      setIsEdit(false);
      setEditId(null);
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      Swal.fire(
        "Gagal!",
        err.response?.data?.error || "Terjadi kesalahan.",
        "error"
      );
    }
  };

  const handleEdit = (user) => {
    setIsEdit(true);
    setEditId(user.id);
    setFormUser({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const currentUserId = JSON.parse(
      atob(localStorage.getItem("token").split(".")[1])
    ).id;

    if (id === currentUserId) {
      return Swal.fire(
        "Gagal!",
        "Anda tidak dapat menghapus akun Anda sendiri.",
        "warning"
      );
    }

    const confirm = await Swal.fire({
      title: "Yakin hapus user ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Terhapus!", "User berhasil dihapus.", "success");
        fetchUsers();
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Tidak bisa menghapus user.";
        Swal.fire("Gagal!", errorMessage, "error");
      }
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow p-6 max-w-6xl mx-auto w-full">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Manajemen User</h1>
            <button
              className="bg-[#C89595] hover:px-7 text-white font-semibold py-2 px-5 rounded-lg transition"
              onClick={() => {
                setIsEdit(false);
                setFormUser({
                  username: "",
                  email: "",
                  password: "",
                  role: "user",
                });
                setShowForm(true);
              }}
            >
              + Tambah User
            </button>
          </div>

          {/* Modal Form */}
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">
              <div className="relative w-full max-w-lg p-8 bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/40 animate-fade-in-up">
                <button
                  onClick={() => setShowForm(false)}
                  className="absolute top-3 right-3 bg-white/60 hover:bg-red-500 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center shadow transition"
                >
                  &times;
                </button>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                  {isEdit ? "Edit User" : "Tambah User"}
                </h2>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formUser.username}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#C89595] transition"
                      placeholder="Masukkan username"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formUser.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#C89595] transition"
                      placeholder="Masukkan email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formUser.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#C89595] transition"
                      placeholder="Masukkan password"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      name="role"
                      value={formUser.role}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#C89595] transition"
                      required
                    >
                      <option value="user">User</option>
                      <option value="superadmin">Superadmin</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#C89595] text-white font-semibold py-2 rounded-lg transition"
                  >
                    {isEdit ? "Simpan Perubahan" : "Tambah User"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Tabel User */}
          <div className="overflow-x-auto shadow rounded bg-white mt-4">
            <table className="min-w-full text-sm text-left border border-gray-200">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 border">Username</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Role</th>
                  <th className="px-4 py-2 border text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2 border">{user.username}</td>
                    <td className="px-4 py-2 border">{user.email}</td>
                    <td className="px-4 py-2 border capitalize">{user.role}</td>
                    <td className="px-4 py-2 border text-center space-x-2">
                      <button
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        onClick={() => handleDelete(user.id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-4 text-gray-500 italic"
                    >
                      Tidak ada user ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ManageUser;
