import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import Swal from "sweetalert2";

const ResepIndonesia = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 6;

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/indonesian-recipes");
      setRecipes(response.data);
      setFilteredRecipes(response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setCurrentPage(1);

    const filtered = recipes.filter((recipe) => {
      const title = recipe.title?.toLowerCase() || "";
      const region = recipe.region?.toLowerCase() || "";
      const category = recipe.category?.toLowerCase() || "";

      let ingredients = "";
      try {
        if (typeof recipe.ingredients === "string") {
          ingredients = JSON.parse(recipe.ingredients).join(", ").toLowerCase();
        } else if (Array.isArray(recipe.ingredients)) {
          ingredients = recipe.ingredients.join(", ").toLowerCase();
        } else {
          ingredients = String(recipe.ingredients).toLowerCase();
        }
      } catch {
        ingredients = String(recipe.ingredients).toLowerCase();
      }
      return (
        title.includes(value) ||
        region.includes(value) ||
        ingredients.includes(value) ||
        category.includes(value)
      );
    });

    setFilteredRecipes(filtered);
  };

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const parseIngredients = (raw) => {
    try {
      if (typeof raw === "string" && raw.startsWith("[") && raw.endsWith("]")) {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.join(", ") : raw;
      }
      return raw;
    } catch (e) {
      return raw;
    }
  };

  const handleAddToFavorite = async (recipe) => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire("Silakan login dulu untuk menambahkan ke favorit", "", "warning");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/favorites-indonesia",
        {
          recipeId: recipe.id,
          title: recipe.title,
          image: recipe.imageUrl,
          source: "resep-indonesia",
          region: recipe.region,
          ingredients: Array.isArray(recipe.ingredients)
            ? recipe.ingredients
            : typeof recipe.ingredients === "string" &&
              recipe.ingredients.trim().startsWith("[")
            ? JSON.parse(recipe.ingredients)
            : recipe.ingredients.split(",").map((item) => item.trim()),
          instructions: recipe.instructions,
          category: recipe.category,
          videoUrl: recipe.videoUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire("Berhasil!", "Resep ditambahkan ke favorit.", "success");
    } catch (error) {
      console.error("Gagal menambahkan favorit:", error);
      Swal.fire("Gagal", "Terjadi kesalahan saat menambahkan.", "error");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-[#4B2E2E]">
          Resep Masakan Indonesia
        </h2>

        <div className="flex justify-center mb-10">
          <input
            type="text"
            placeholder="Cari nama masakan, bahan, atau asal daerah..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full md:max-w-2xl p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#735557] shadow"
          />
        </div>

        {currentRecipes.length === 0 ? (
          <p className="text-center text-gray-500">Tidak ada resep ditemukan.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {currentRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform transition duration-300 hover:scale-[1.02] flex flex-col"
              >
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="w-full h-52 object-cover rounded-t-2xl"
                />
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-[#4B2E2E] mb-2">
                    {recipe.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Asal:</strong> {recipe.region}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Kategori:</strong> {recipe.category}
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Bahan:</strong> {parseIngredients(recipe.ingredients)}
                  </p>
                  <p className="text-sm text-gray-700 mb-4">
                    <strong>Instruksi:</strong>{" "}
                    {recipe.instructions?.substring(0, 120)}...
                  </p>
                  <a
                    href={recipe.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline mt-auto mb-3 cursor-pointer"
                  >
                    Lihat Video Masak
                  </a>
                  <button
                    onClick={() => handleAddToFavorite(recipe)}
                    className="bg-[#C89595] hover:bg-[#a87373] text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Tambah ke Favorit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredRecipes.length > recipesPerPage && (
          <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded-lg text-sm transition ${
                  currentPage === index + 1
                    ? "bg-[#735557] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-[#C89595]"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResepIndonesia;
