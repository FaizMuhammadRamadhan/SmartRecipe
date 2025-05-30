import React from "react";
import { Link } from "react-router-dom";

// components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-4 bottom-0">
      <div className="max-w-7xl mx-auto px-4 flex justify-between gap-8">
        <div>
          <h2 className="text-xl font-bold">SmartRecipe</h2>
          <p className="mt-2 text-sm text-gray-400">
            Temukan berbagai resep menarik, sehat, dan lezat hanya dengan beberapa klik!
          </p>
        </div>
        <div>
          <h3 className="text-md font-semibold">Navigasi</h3>
          <ul className="mt-2 text-sm space-y-1 text-gray-400">
            <li className="hover:text-white transition">
              <Link to="/homepage">Homepage</Link>
            </li>
            <li className="hover:text-white transition">
              <Link to="/about">About</Link>
            </li>
            <li className="hover:text-white transition">
              <Link to="/lihatfitur">Lihat Fitur</Link>
            </li>
            <li className="hover:text-white transition">
              <Link to="/favorit-saya">Favorit Saya</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-10 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} SmartRecipe. All rights reserved.
      </div>
    </footer>
  );
}
