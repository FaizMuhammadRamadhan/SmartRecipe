import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import Swal from "sweetalert2";

const ResepIndonesia = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 6; // Tampilkan 6 resep per halaman

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/indonesian-recipes"
      );
      console.log("Response data:", response.data);
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

      // ingredients bisa array atau string JSON
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

  // Logic untuk paginate
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );

  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };
  // Tambahkan di atas return
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
      Swal.fire(
        "Silakan login dulu untuk menambahkan ke favorit",
        "",
        "warning"
      );
      return;
    }

    try {
      const response = await axios.post(
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Resep Masakan</h2>

        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Cari nama masakan, bahan, atau asal daerah..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full max-w-md p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>

        {/* Recipes List */}
        {currentRecipes.length === 0 ? (
          <p className="text-center text-gray-500">
            Tidak ada resep ditemukan.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="border rounded-lg shadow-md p-4 hover:shadow-lg transition"
              >
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="w-full h-48 object-cover rounded mb-3"
                />
                <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Asal Daerah:</span>{" "}
                  {recipe.region}
                </p>
                <div className="mb-2">
                  <h4 className="font-semibold">Bahan-bahan:</h4>
                  <p className="text-gray-700 whitespace-pre-line">
                    {parseIngredients(recipe.ingredients)}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Instruksi Memasak:</h4>
                  <p className="text-gray-700 whitespace-pre-line">
                    {recipe.instructions}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Kategori Masakan:</h4>
                  <p className="text-gray-700 whitespace-pre-line">
                    {recipe.category}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Link cara memasak:</h4>
                  <a
                    href={recipe.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Lihat Video Masak
                  </a>
                </div>
                <button
                  onClick={() => handleAddToFavorite(recipe)}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Tambah ke Favorit
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination dengan angka */}
        {filteredRecipes.length > recipesPerPage && (
          <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === index + 1
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-green-300"
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
