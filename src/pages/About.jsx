import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const features = [
  {
    title: "Resep Indonesia",
    desc: "Kumpulan resep autentik khas Indonesia yang dikurasi langsung oleh tim kami, memberikan rasa rumah di setiap hidangan.",
  },
  {
    title: "Cari Resep",
    desc: "Temukan ide masakan hanya dengan memasukkan bahan yang tersedia di dapurmu, tanpa perlu bingung lagi.",
  },
  {
    title: "Resep Diet",
    desc: "Dapatkan pilihan resep untuk berbagai kebutuhan diet, seperti rendah kalori, keto, vegan, dan lainnya.",
  },
  {
    title: "Resep Manca Negara",
    desc: "Eksplor berbagai resep dari seluruh dunia yang telah disesuaikan untuk selera lokal.",
  },
];

const benefits = [
  "Resep diperbarui secara berkala dan dikurasi oleh ahli kuliner.",
  "Antarmuka bersih, minimalis, dan mudah digunakan.",
  "Kompatibel di semua perangkat, termasuk ponsel dan tablet.",
  "Dukungan fitur cerdas untuk rekomendasi berdasarkan preferensi.",
];

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow bg-white text-gray-900 px-6 py-16 md:px-16">
        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Mengenal Lebih Dekat SmartRecipe
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            SmartRecipe adalah platform resep digital modern yang membantu Anda
            menemukan ide masakan dengan mudah dan cepat. Mulai dari resep
            lokal, diet, hingga internasional, semuanya tersedia dalam satu
            aplikasi.
          </p>
        </motion.div>

        {/* Ilustrasi Menarik */}
        <motion.div
          className="max-w-4xl mx-auto mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <a href="https://www.instagram.com/">
            <img
              src="images/image-about.jpeg"
              alt="Ilustrasi Memasak"
              className="w-full h-64 md:h-100 object-fill rounded-2xl shadow-md"
            />
          </a>
        </motion.div>

        {/* Features */}
        <motion.div
          className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-gray-50 p-8 rounded-xl shadow hover:shadow-md transition"
            >
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Why SmartRecipe */}
        <motion.div
          className="bg-green-50 py-14 px-8 md:px-20 rounded-3xl mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center text-green-800 mb-10">
            Mengapa Memilih SmartRecipe?
          </h2>
          <ul className="max-w-3xl mx-auto space-y-4 text-lg text-gray-700 list-disc list-inside">
            {benefits.map((benefit, idx) => (
              <li key={idx}>{benefit}</li>
            ))}
          </ul>
        </motion.div>
      </main>

      {/* Footer selalu di bawah */}
      <Footer />
    </div>
  );
}
