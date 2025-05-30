import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";

const Favorit = () => {
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const API_KEY = "ff77df9518d849239f74a4fca1ec7bdb";

  const getDetailRecipe = async (recipeId) => {
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}&includeNutrition=true`
      );
      return response.data;
    } catch (error) {
      console.error("Gagal ambil detail resep dari Spoonacular:", error.message);
      return null;
    }
  };

  const fetchFavorites = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5000/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const detailedFavorites = await Promise.all(
        res.data.map(async (fav) => {
          if (fav.sourceType === "api") {
            const detail = await getDetailRecipe(fav.recipeId);
            return {
              ...fav,
              title: fav.title || detail?.title,
              image: fav.image || detail?.image,
              detail,
            };
          } else if (fav.sourceType === "indonesia") {
            return {
              ...fav,
              detail: {
                extendedIngredients: fav.ingredients?.map((bahan) => ({
                  original: bahan,
                })),
                nutrition: {
                  nutrients: fav.nutrition?.map((n) => ({
                    name: n.name,
                    amount: n.amount,
                    unit: n.unit,
                  })),
                },
              },
            };
          } else {
            return fav;
          }
        })
      );

      setFavorites(detailedFavorites);
    } catch (error) {
      console.error("Gagal ambil data favorit:", error.message);
    }
  };

  const hapusFavorit = async (id) => {
    const token = localStorage.getItem("token");
    const konfirmasi = await Swal.fire({
      title: "Yakin mau hapus?",
      text: "Resep ini akan dihapus dari favoritmu!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (konfirmasi.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/favorites/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFavorites((prev) => prev.filter((fav) => fav.id !== id));
        Swal.fire("Terhapus!", "Resep favorit sudah dihapus.", "success");
      } catch (error) {
        console.error("Gagal hapus favorit:", error.message);
        Swal.fire("Gagal", "Tidak bisa menghapus resep.", "error");
      }
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFavorites = favorites.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(favorites.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Resep Favoritmu
        </h2>

        {favorites.length === 0 ? (
          <p className="text-center text-gray-500 text-xl">
            Belum ada resep favorit.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {currentFavorites.map((fav, index) => (
                  <motion.div
                    key={fav.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    className="relative bg-white/70 backdrop-blur-lg shadow-xl rounded-2xl p-5 border border-gray-200 hover:scale-[1.02] hover:shadow-2xl transition duration-300"
                  >
                    <img
                      src={fav.image}
                      alt={fav.title}
                      className="rounded-xl mb-4 w-full h-44 object-cover"
                    />
                    <h3 className="text-xl font-bold text-gray-700 mb-3">
                      {fav.title}
                    </h3>

                    <div className="mb-3">
                      <p className="font-semibold text-gray-700">Bahan:</p>
                      <ul className="list-disc list-inside text-gray-600 text-sm">
                        {fav.detail?.extendedIngredients
                          ?.slice(0, 4)
                          .map((ing, i) => (
                            <li key={i}>{ing.original}</li>
                          ))}
                      </ul>
                    </div>

                    <div>
                      <p className="font-semibold text-gray-700">Nutrisi:</p>
                      <ul className="text-gray-600 text-sm">
                        {fav.detail?.nutrition?.nutrients
                          ?.slice(0, 4)
                          .map((n, i) => (
                            <li key={i}>
                              {n.name}: {n.amount} {n.unit}
                            </li>
                          ))}
                      </ul>
                    </div>
                    <button
                      onClick={() => hapusFavorit(fav.id)}
                      className="absolute -top-3 -right-1 bg-red-500 hover:bg-red-600 text-white text-xs px-4 py-3 rounded-full shadow"
                    >
                      X
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-10 gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg py-2 px-4 text-sm font-medium transition-all duration-300 ${
                      page === currentPage
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Favorit;
