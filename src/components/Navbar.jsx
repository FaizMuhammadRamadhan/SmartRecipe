import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

export default function Navbar() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  const handleLogout = () => {
    Swal.fire({
      title: "Yakin mau logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, logout",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        Swal.fire("Logout Berhasil!", "Kamu telah logout.", "success");
        navigate("/");
      }
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username || decoded.email || "User");
        setRole(decoded.role);
      } catch (err) {
        console.error("Token invalid", err);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const navLinks = (
    <>
      <li><Link to="/homepage">Homepage</Link></li>
      <li><Link to="/about">About</Link></li>
      <li><Link to="/lihatfitur">Lihat Fitur</Link></li>
      <li><Link to="/favorit-saya">Favorit Saya</Link></li>
      {role === "superadmin" && (
        <>
        <li><Link to="/indonesian-recipes">Tambah</Link></li>
        <li><Link to="/manage-users">Manage Akun</Link></li>
        </>
      )}
    </>
  );
  return (
    <nav className="bg-[#C89595] w-full shadow-md relative z-50">
      <div className="container py-2">
        <div className="flex justify-between items-center mx-4">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/images/logo.png" alt="logo" className="w-20" />
            <h1 className="font-bold text-lg hidden sm:flex">SmartRecipe</h1>
          </div>

          {/* Desktop Nav */}
          <ul className="hidden xl:flex gap-8 font-medium text-black">
            {navLinks}
          </ul>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              className="user flex items-center gap-2 cursor-pointer font-medium transition"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <i className="ri-user-3-line text-xl text-black"></i>
              <span className="text-black">{username}</span>
              <i className={`ri-arrow-down-s-line text-black transition ${dropdownOpen ? "rotate-180" : ""}`}></i>
            </div>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-50 animate-dropdown">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-red-100 rounded text-red-600 font-medium"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
           {/* Hamburger */}
          <button
            className="xl:hidden text-2xl text-black text-center"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="ri-menu-line"></i>
          </button>
        </div>
      </div>

      {/* Sidebar Mobile */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform ${sidebarOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 z-40`}>
        <div className="p-4">
          <button className="text-2xl mb-4" onClick={() => setSidebarOpen(false)}>
            <i className="ri-close-line"></i>
          </button>
          <ul className="flex flex-col gap-4 font-medium text-black">
            {navLinks}
          </ul>
        </div>
      </div>

      {/* Animasi */}
      <style>
        {`
          .animate-dropdown {
            animation: fadeInDown 0.25s ease-out;
          }
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </nav>
  );
}