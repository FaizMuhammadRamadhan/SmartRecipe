import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";

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
    const confirm = await Swal.fire({
      title: "Yakin hapus user ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
    });
    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Terhapus!", "User berhasil dihapus.", "success");
        fetchUsers();
      } catch (err) {
        Swal.fire("Gagal!", "Tidak bisa menghapus user.", "error");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Manajemen User</h1>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
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
            Tambah User
          </button>
        </div>

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
            <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative animate-fade-in">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
                onClick={() => setShowForm(false)}
              >
                &times;
              </button>
              <h2 className="text-xl font-semibold mb-4">
                {isEdit ? "Edit User" : "Tambah User"}
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="username"
                  value={formUser.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="email"
                  name="email"
                  value={formUser.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="password"
                  name="password"
                  value={formUser.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full border px-3 py-2 rounded"
                />
                <select
                  name="role"
                  value={formUser.role}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="user">User</option>
                  <option value="superadmin">Superadmin</option>
                </select>
                <button
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
                  onClick={handleSubmit}
                >
                  {isEdit ? "Simpan Perubahan" : "Tambah User"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Table */}
        <div className="overflow-x-auto shadow rounded bg-white">
          <table className="min-w-full table-auto text-left border-collapse">
            <thead className="bg-gray-100">
              <tr className="text-center">
                <th className="px-4 py-2 border">Username</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Role</th>
                <th className="px-4 py-2 border text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-all">
                  <td className="px-4 py-2 border">{user.username}</td>
                  <td className="px-4 py-2 border">{user.email}</td>
                  <td className="px-4 py-2 border capitalize">{user.role}</td>
                  <td className="px-4 py-2 border text-center space-x-2">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
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
      </div>
    </>
  );
};

export default ManageUser;
