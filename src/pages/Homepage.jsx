import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
    judul: "Resep Manca Negara",
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

const Homepage = () => {
  return (
    <div className="relative overflow-hidden bg-white">
      <Navbar />

      {/* <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-r from-[#3b82f6] to-[#2563eb] -z-10 rounded-b-[50%] transform scale-150 opacity-20 blur-3xl"></div> */}

      <div className="relative bg-[#735557] text-white py-20">
        <div className="container mx-auto text-center px-4">
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold mb-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Selamat Datang di <span className="">SmartRecipe</span>
          </motion.h1>
          <motion.p
            className="text-lg text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Temukan berbagai resep menarik, sehat, dan lezat hanya dengan
            beberapa klik!
          </motion.p>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-center text-3xl font-bold text-black">
          Fitur yang bisa kamu gunakan
        </h2>
        <p className="text-center text-black mt-2 mb-10">
          Jelajahi fitur menarik yang siap membantu kamu menemukan inspirasi
          memasak!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 px-18 mb-6 py-2">
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
                <div className="bg-black md:min-h-[220px] rounded-xl p-5 text-white shadow-lg hover:shadow-xl transform transition duration-300 hover:scale-105 flex flex-col border border-gray-700 hover:border-[#3b82f6]">
                  <motion.img
                    src={list.foto}
                    alt={list.judul}
                    className="w-20 h-20 md:h-24 mx-auto mb-4 transition-all duration-300 hover:scale-110"
                    whileHover={{ rotate: 10 }}
                  />
                  <div className="flex-grow flex flex-col justify-between text-center">
                    <h3 className="text-xl font-bold">{list.judul}</h3>
                    <p className="text-sm text-gray-400 mt-2 line-clamp-3">
                      {list.deskripsi}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Homepage;
