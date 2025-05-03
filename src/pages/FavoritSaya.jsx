import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";

const Favorit = () => {
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const API_KEY = "ff77df9518d849239f74a4fca1ec7bdb"; // Ganti dengan API kamu

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
            // Pastikan backend sudah mengirim data bahan dan nutrisi
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
            return fav; // fallback untuk data tak dikenal
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
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          ⭐ Daftar Resep Favoritmu
        </h2>

        {favorites.length === 0 ? (
          <p className="text-center text-gray-500">Belum ada resep favorit.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentFavorites.map((fav) => (
                <div
                  key={fav.id}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 p-4 relative"
                >
                  <img
                    src={fav.image}
                    alt={fav.title}
                    className="rounded-lg mb-2 w-full h-44 object-cover"
                  />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {fav.title}
                  </h3>

                  <p className="font-semibold text-sm text-gray-700">
                    Bahan-bahan:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 mb-2">
                    {fav.detail?.extendedIngredients
                      ?.slice(0, 4)
                      .map((ing, i) => (
                        <li key={i}>{ing.original}</li>
                      ))}
                  </ul>

                  <p className="font-semibold text-sm text-gray-700">
                    Nutrisi:
                  </p>
                  <ul className="text-sm text-gray-600">
                    {fav.detail?.nutrition?.nutrients
                      ?.slice(0, 4)
                      .map((n, i) => (
                        <li key={i}>
                          {n.name}: {n.amount} {n.unit}
                        </li>
                      ))}
                  </ul>

                  <button
                    onClick={() => hapusFavorit(fav.id)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition duration-300 ${
                      page === currentPage
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-blue-100"
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
