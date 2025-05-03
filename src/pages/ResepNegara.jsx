import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import countryMapping from "../constants/countryMapping";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";

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
            apiKey: "ff77df9518d849239f74a4fca1ec7bdb",
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
            apiKey: "ff77df9518d849239f74a4fca1ec7bdb",
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
        "http://localhost:5000/api/favorites", // ✅ cocok dengan backend      
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

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center text-[#2E5077] mb-6">
            🌍 Resep dari Berbagai Negara
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Pilih negara dan temukan resep lezat dari seluruh dunia!
          </p>

          <div className="flex gap-3 mb-8 px-8">
            <select
              value={negara}
              onChange={(e) => setNegara(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-[#3b82f6] transition"
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
              className="bg-[#3b82f6] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#2563eb] transition"
            >
              Cari
            </button>
          </div>

          {loading && <Loading />}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {resepSaatIni.map((item) => (
              <motion.div
                key={item.id}
                className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-transform transform hover:scale-105"
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
                  <button
                    onClick={() => getDetailResep(item.id)}
                    className="bg-[#3b82f6] text-white w-full py-2 mt-3 font-semibold rounded-lg hover:bg-[#2563eb] transition"
                  >
                    Lihat Detail
                  </button>
                  <button
                      onClick={() => tambahFavorit(item)}
                      className="flex-1 bg-pink-500 text-white py-2 font-semibold rounded-lg hover:bg-pink-600 transition"
                    >
                      ❤️ Favorit
                    </button>
                </div>
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {showDetail && detailResep && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={detailResep.image}
                    alt={detailResep.title}
                    className="w-full h-64 object-cover mb-4 rounded-lg"
                  />
                  <h2 className="text-2xl font-bold mb-2">
                    {detailResep.title}
                  </h2>
                  <p className="text-gray-600 mb-2">
                    🍽️ Tipe Hidangan: {detailResep.dishTypes.join(", ")}
                  </p>
                  <p className="text-gray-600 mb-4">
                    🌍 Asal Masakan: {detailResep.cuisines.join(", ")}
                  </p>

                  {/* Daftar Bahan Makanan */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold mb-2">🛒 Daftar Bahan:</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {detailResep.extendedIngredients.map(
                        (ingredient, index) => (
                          <li key={index}>{ingredient.original}</li>
                        )
                      )}
                    </ul>
                  </div>

                  {/* Skor Kualitas Resep */}
                  {detailResep.spoonacularScore !== null && (
                    <p className="text-gray-700 mb-4">
                      ⭐ Skor Kualitas:{" "}
                      <span className="font-semibold text-green-600">
                        {detailResep.spoonacularScore.toFixed(1)} / 100
                      </span>
                    </p>
                  )}

                  {/* Link ke Sumber Resep */}
                  <a
                    href={detailResep.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline block mb-4"
                  >
                    🔗 Lihat Resep Lengkap
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
      </div>
    </div>
  );
};

export default ResepNegara;
