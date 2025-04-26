import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : { ...formData, role: "user" };
  
      const response = await axios.post(endpoint, payload);
  
      if (isLogin) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        Swal.fire({
          icon: "success",
          title: "Login berhasil!",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/homepage"); // ⬅️ ke homepage
      } else {
        Swal.fire({
          icon: "success",
          title: "Registrasi berhasil!",
          text: "Silakan login untuk melanjutkan.",
        });
        setIsLogin(true); // ⬅️ ubah ke mode login
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.error || "Terjadi kesalahan",
      });
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4 animate-fade-in">
      <div className="bg-white shadow-xl rounded-3xl w-full max-w-md p-10 transition-all duration-500 ease-in-out transform hover:scale-[1.02]">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-teal-500">
          {isLogin ? "Login" : "Register"} ke SmartRecipe 🍽️
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-3 font-semibold rounded-xl hover:bg-teal-600 transition duration-300"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <p className="text-sm text-center mt-6">
          {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-teal-500 hover:underline font-medium"
          >
            {isLogin ? "Daftar sekarang" : "Login di sini"}
          </button>
        </p>
      </div>
    </div>
  );
}
