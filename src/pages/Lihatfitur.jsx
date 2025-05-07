import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { div } from "framer-motion/client";

const Fitur = [
  {
    id: 1,
    foto: "images/resep-makanan-anak.png",
    judul: "Resep Masakan Indonesia",
    deskripsi:
      "Resep sehat dan lezat asal indonesia, dengan tampilan menarik dan rasa nikmat!",
    link: "/resepindonesia",
  },
  {
    id: 2,
    foto: "images/cari-resep.png",
    judul: "Cari Resep",
    deskripsi:
      "Masukkan bahan yang kamu miliki di rumah, dan temukan resep lezat yang bisa dibuat dengan mudah!",
    link: "/cariresep",
  },
  {
    id: 3,
    foto: "images/resep-makanan-negara.png",
    judul: "Resep Berbagai Negara",
    deskripsi:
      "Jelajahi cita rasa khas dari berbagai negara seperti Jepang, Italia, dan banyak lagi!",
    link: "/resepberbagainegara",
  },
  {
    id: 4,
    foto: "images/resep-diet.png",
    judul: "Resep Diet",
    deskripsi:
      "Temukan resep sehat yang cocok untuk kebutuhan dietmu, mulai dari keto, vegan, hingga low-carb!",
    link: "/resepdiet",
  },
];
const Lihatfitur = () => {
  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 px-16 mb-6 my-5">
        {Fitur.map((list, index) => (
          <motion.div
            key={list.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.1,
              type: "spring",
              stiffness: 100,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link to={list.link}>
              <div className="bg-black min-h-[220px] rounded-xl p-5 text-white shadow-lg hover:shadow-xl transform transition duration-300 hover:scale-105 flex flex-col border border-gray-700 hover:border-[#3b82f6]">
                <motion.img
                  src={list.foto}
                  alt={list.judul}
                  className="w-24 h-24 mx-auto mb-4 transition-all duration-300 hover:scale-110"
                  whileHover={{ rotate: 10 }}
                />
                <div className="flex-grow flex flex-col justify-between text-center">
                  <h3 className="text-xl font-bold">{list.judul}</h3>
                  <p className="text-sm text-gray-400 mt-2 line-clamp-3">
                    {list.deskripsi}
                  </p>
                  {/* <Button variant="bg-[#3b82f6] w-full py-2 font-bold rounded-md mt-4 text-white hover:bg-[#2563eb] transition duration-300">
              Mulai Mencari
            </Button> */}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Lihatfitur;
