import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Navbar from "../../components/Navbar";

const ListRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRecipes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/indonesian-recipes");
      setRecipes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteRecipe = async (id) => {
    const confirm = await Swal.fire({
      title: "Yakin mau hapus?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/indonesian-recipes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Berhasil!", "Resep dihapus.", "success");
        fetchRecipes();
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Gagal hapus resep", "error");
      }
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Resep Masakan Indonesia</h1>
          <Link
            to="/indonesian-recipes/add"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-semibold transition"
          >
            + Tambah Resep
          </Link>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Cari resep berdasarkan nama makanan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-48 object-cover"
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/300x200?text=No+Image")
                }
              />
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
                <p className="text-gray-500 text-sm mb-4">{recipe.region}</p>
                <div className="flex gap-3">
                  <Link
                    to={`/indonesian-recipes/edit/${recipe.id}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg font-semibold transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteRecipe(recipe.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListRecipes;
