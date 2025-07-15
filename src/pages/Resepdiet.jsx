import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { API_KEY }  from "../constants/apiConfig";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import Swal from "sweetalert2";
import Footer from "../components/Footer";

const Resepdiet = () => {
  const [diet, setDiet] = useState("balanced");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailResep, setDetailResep] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 9;

  const getDietRecipes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch`,
        {
          params: {
            diet,
            number: 50,
            apiKey: API_KEY, 
          },
        }
      );
      setRecipes(response.data.results);
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
          params: { apiKey: API_KEY },
        }
      );
      setDetailResep({
        title: response.data.title,
        image: response.data.image,
        ingredients: response.data.extendedIngredients || [],
        readyInMinutes: response.data.readyInMinutes,
        score: response.data.spoonacularScore,
        sourceUrl: response.data.sourceUrl,
        nutrition: response.data.nutrition?.nutrients || [],
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

  useEffect(() => {
    getDietRecipes();
  }, [diet]);

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(recipes.length / recipesPerPage);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center text-[#2E5077] mb-6">
            Resep Diet
          </h1>

          <div className="flex gap-3 mb-8">
            <select
              value={diet}
              onChange={(e) => {
                setDiet(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-[#3b82f6]"
            >
              <option value="balanced">Seimbang</option>
              <option value="ketogenic">Ketogenik</option>
              <option value="vegan">Vegan</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="gluten free">Bebas Gluten</option>
            </select>
          </div>

          {loading && <Loading />}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {currentRecipes.map((item) => (
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
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <button
                      onClick={() => getDetailResep(item.id)}
                      className="bg-[#3b82f6] text-white w-full py-2 font-semibold rounded-lg hover:bg-[#2563eb]"
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
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-10 gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <button
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    currentPage === number
                      ? "bg-[#735557] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-[#C89595]"
                  }`}
                >
                  {number}
                </button>
              )
            )}
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
                    Waktu Memasak: {detailResep.readyInMinutes} menit
                  </p>
                  <p className="text-gray-600 mb-2">
                    Skor: {detailResep.score.toFixed(1)}
                  </p>
                  <ul className="list-disc pl-5 mb-4">
                    {detailResep.ingredients.map((ing) => (
                      <li key={ing.id}>{ing.original}</li>
                    ))}
                  </ul>
                  <a
                    href={detailResep.sourceUrl}
                    target="_blank"
                    className="text-blue-500 hover:underline"
                  >
                    Lihat Resep Lengkap
                  </a>
                  <button
                    onClick={() => setShowDetail(false)}
                    className="bg-red-500 text-white w-full py-2 mt-4 font-semibold rounded-lg hover:bg-red-600"
                  >
                    Tutup
                  </button>
                </motion.div>
              </motion.div>
            )}
            ;
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Resepdiet;
