import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

export default function Navbar() {
  const [username, setUsername] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
      } catch (err) {
        console.error("Token invalid", err);
      }
    }
  }, []);

  // Handle click outside dropdown untuk close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-[#79D7BE] w-full shadow-md">
      <div className="container py-2">
        <div className="nav-box flex justify-between mx-4 items-center">
          {/* Logo */}
          <div className="logo flex items-center">
            <img src="images/logo.png" alt="logo" className="w-20" />
            <h1 className="font-bold text-lg">SmartRecipe</h1>
          </div>

          {/* Link Navigasi */}
          <ul className="nav-link flex gap-8 text-white font-medium">
            <li>
              <Link
                to="/homepage"
                className="hover:text-yellow-200 transition duration-200"
              >
                Homepage
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-yellow-200 transition duration-200"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/lihatfitur"
                className="hover:text-yellow-200 transition duration-200"
              >
                Lihat Fitur
              </Link>
            </li>
            <li>
              <Link
                to="/favorit-saya"
                className="hover:text-yellow-200 transition duration-200"
              >
                Favorit Saya
              </Link>
            </li>
          </ul>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              className="user flex items-center gap-2 cursor-pointer text-white font-medium hover:text-yellow-300 transition"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <i className="ri-user-3-line text-xl"></i>
              <span>{username}</span>
              <i
                className={`ri-arrow-down-s-line transition ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              ></i>
            </div>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white hover:rounded-lg shadow-lg z-50 animate-dropdown">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-red-100 hover:rounded-lg text-red-600 font-medium"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Animasi Dropdown */}
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
