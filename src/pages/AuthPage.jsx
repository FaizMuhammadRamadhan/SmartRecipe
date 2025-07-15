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
        const { token, role } = response.data; 
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        Swal.fire({
          icon: "success",
          title: "Login berhasil!",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/homepage");
      } else {
        Swal.fire({
          icon: "success",
          title: "Registrasi berhasil!",
          text: "Silakan login untuk melanjutkan.",
        });
        setIsLogin(true); 
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
    <div className="flex items-center justify-center min-h-screen bg-[#C89595] px-6 animate-fade-in">
      <div className="bg-[#FDEFEF] shadow-xl rounded-3xl w-full max-w-md p-8 transition-all duration-500 ease-in-out transform hover:scale-[1.02]">
        <img src="images/logo.png" alt="" className="w-32 mx-auto"/>
        <h2 className="text-3xl font-extrabold text-center mb-6 text-[#735557]">
          {isLogin ? "LOGIN" : "REGISTER"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4E1F00]"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4E1F00]"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4E1F00]"
          />
          <button
            type="submit"
            className="w-full bg-[#C89595] text-white py-3 font-semibold rounded-xl hover:bg-[#4E1F00] transition duration-300"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <p className="text-sm text-center mt-6">
          {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#4E1F00] hover:underline font-medium"
          >
            {isLogin ? "Daftar sekarang" : "Login di sini"}
          </button>
        </p>
      </div>
    </div>
  );
}
