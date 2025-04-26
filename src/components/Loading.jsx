import React from "react";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 backdrop-blur-md z-50">
      <div className="flex flex-col items-center justify-center gap-4">
        {/* Animasi Loading */}
        <motion.div
          className="w-16 h-16 border-t-4 border-blue-500 shadow-lg rounded-full animate-spin"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        {/* Teks Loading */}
        <p className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 tracking-wider">
          Memuat Resep...
        </p>
      </div>
    </div>
  );
}
