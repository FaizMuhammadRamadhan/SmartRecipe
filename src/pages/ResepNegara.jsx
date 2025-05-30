import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import countryMapping from "../constants/countryMapping";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";
import Footer from "../components/Footer";

const ResepNegara = () => {
  const [negara, setNegara] = useState("");
  const [resep, setResep] = useState([]);
  const [loading, setLoading] = useState(false);
  const [halamanSaatIni, setHalamanSaatIni] = useState(1);
  const [detailResep, setDetailResep] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const resepPerHalaman = 12;

  const getRecipesByCountry = async () => {
    if (!negara) return;
    setLoading(true);

    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch`,
        {
          params: {
            cuisine: countryMapping[negara.toLowerCase()],
            number: 100,
            apiKey: "f83e042219484f66af543881113c9b3a",
          },
        }
      );
      setResep(response.data.results);
    } catch (error) {
      console.error("Gagal mengambil data resep:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const getDetailResep = async (id) => {
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/${id}/information`,
        {
          params: {
            apiKey: "f83e042219484f66af543881113c9b3a",
          },
        }
      );
      setDetailResep({
        title: response.data.title,
        image: response.data.image,
        cuisines: response.data.cuisines || [],
        dishTypes: response.data.dishTypes || [],
        extendedIngredients: response.data.extendedIngredients || [],
        sourceUrl: response.data.sourceUrl,
        spoonacularScore: response.data.spoonacularScore || null,
      });
      setShowDetail(true);
    } catch (error) {
      console.error("Gagal mengambil detail resep:", error.message);
    }
  };

  const tambahFavorit = async (resep) => {
    const token = localStorage.getItem("token");

    if (!token) {
      return Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Kamu harus login untuk menambahkan ke favorit!",
      });
    }

    try {
      await axios.post(
        "http://localhost:5000/api/favorites",
        {
          recipeId: resep.id,
          title: resep.title,
          image: resep.image,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Resep berhasil ditambahkan ke favorit!",
      });
    } catch (error) {
      console.error("Gagal menambahkan ke favorit:", error.message);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Gagal menambahkan ke favorit.",
      });
    }
  };

  const indeksResepTerakhir = halamanSaatIni * resepPerHalaman;
  const indeksResepPertama = indeksResepTerakhir - resepPerHalaman;
  const resepSaatIni = resep.slice(indeksResepPertama, indeksResepTerakhir);

  const gantiHalaman = (nomorHalaman) => setHalamanSaatIni(nomorHalaman);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      getRecipesByCountry();
    }
  };

  const totalHalaman = Math.ceil(resep.length / resepPerHalaman);

  return (
    <div>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#2E5077] mb-4">
              Jelajahi Resep Dunia
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Pilih negara dan temukan inspirasi resep lezat dari berbagai
              belahan dunia.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <select
              value={negara}
              onChange={(e) => setNegara(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full sm:w-80 p-3 rounded-xl border border-gray-300 shadow-sm focus:ring-[#3b82f6] transition"
            >
              <option value="">Pilih Negara</option>
              {Object.keys(countryMapping).map((key) => (
                <option key={key} value={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </option>
              ))}
            </select>
            <button
              onClick={getRecipesByCountry}
              className="bg-[#3b82f6] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#2563eb] transition"
            >
              Cari Resep
            </button>
          </div>

          {loading && <Loading />}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {resepSaatIni.map((item) => (
              <motion.div
                key={item.id}
                className="bg-white rounded-2xl shadow hover:shadow-lg transform transition-transform hover:scale-105 overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-bold text-[#2E5077] truncate">
                    {item.title}
                  </h2>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => getDetailResep(item.id)}
                      className="bg-[#3b82f6] text-white w-full py-2 text-sm font-semibold rounded-lg hover:bg-[#2563eb]"
                    >
                      Detail
                    </button>
                    <button
                      onClick={() => tambahFavorit(item)}
                      className="bg-pink-500 text-white w-full py-2 text-sm font-semibold rounded-lg hover:bg-pink-600"
                    >
                      ❤️ Favorit
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalHalaman > 1 && (
            <div className="flex justify-center mt-10 space-x-2">
              {Array.from({ length: totalHalaman }, (_, i) => i + 1).map(
                (num) => (
                  <button
                    key={num}
                    onClick={() => gantiHalaman(num)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                      halamanSaatIni === num
                        ? "bg-[#735557] text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-[#C89595]"
                    }`}
                  >
                    {num}
                  </button>
                )
              )}
            </div>
          )}

          <AnimatePresence>
            {showDetail && detailResep && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={detailResep.image}
                    alt={detailResep.title}
                    className="w-full h-64 object-cover mb-4 rounded-xl"
                  />
                  <h2 className="text-2xl font-bold mb-2">
                    {detailResep.title}
                  </h2>
                  <p className="text-gray-600 mb-2">
                    Tipe: {detailResep.dishTypes.join(", ")}
                  </p>
                  <p className="text-gray-600 mb-4">
                    Asal: {detailResep.cuisines.join(", ")}
                  </p>
                  <h3 className="text-lg font-bold mb-2">Bahan-bahan:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
                    {detailResep.extendedIngredients.map((ing, idx) => (
                      <li key={idx}>{ing.original}</li>
                    ))}
                  </ul>

                  {detailResep.spoonacularScore !== null && (
                    <p className="text-gray-700 mb-4">
                      Skor:{" "}
                      <span className="font-semibold text-green-600">
                        {detailResep.spoonacularScore.toFixed(1)} / 100
                      </span>
                    </p>
                  )}

                  <a
                    href={detailResep.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline block mb-4"
                  >
                    Lihat Resep Lengkap
                  </a>

                  <button
                    onClick={() => setShowDetail(false)}
                    className="bg-red-500 text-white w-full py-2 font-semibold rounded-lg hover:bg-red-600 transition"
                  >
                    Tutup
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default ResepNegara;
