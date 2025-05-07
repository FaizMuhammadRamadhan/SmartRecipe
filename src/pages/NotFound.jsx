import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const NotFound = () => {
  return (
    <>
      {/* <Navbar /> */}
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-4">
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Halaman Tidak Ditemukan</h2>
        <p className="mb-6">Sepertinya halaman yang kamu cari tidak tersedia.</p>
        <Link to="/homepage" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Kembali ke Homepage
        </Link>
      </div>
    </>
  );
};

export default NotFound;
