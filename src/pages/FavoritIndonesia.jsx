import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";

const FavoritIndonesia = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await axios.get(
        "http://localhost:5000/api/favorites/indonesia",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFavorites(response.data);
    } catch (error) {
      console.error("Gagal memuat favorit:", error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const confirm = await Swal.fire({
      title: "Hapus Favorit?",
      text: "Resep ini akan dihapus dari daftar favorit Anda.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/favorites/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire("Dihapus!", "Resep favorit telah dihapus.", "success");
      fetchFavorites();
    } catch (error) {
      console.error("Gagal menghapus favorit:", error);
      Swal.fire("Gagal", "Terjadi kesalahan saat menghapus", "error");
    }
  };

  const parseIngredients = (raw) => {
    try {
      if (typeof raw === "string" && raw.startsWith("[")) {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.join(", ") : raw;
      }
      return raw;
    } catch {
      return raw;
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Favorit Resep Indonesia</h2>
        {favorites.length === 0 ? (
          <p className="text-center text-gray-600">Belum ada resep favorit.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => (
              <div
                key={fav.id}
                className="border rounded-lg shadow p-4 bg-white hover:shadow-lg transition"
              >
                <img
                  src={fav.image}
                  alt={fav.title}
                  className="w-full h-48 object-cover rounded mb-3"
                />
                <h3 className="text-lg font-semibold">{fav.title}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  <span className="font-medium">Asal:</span> {fav.region}
                </p>
                <p className="text-sm mb-2">
                  <span className="font-medium">Kategori:</span> {fav.category}
                </p>
                <p className="text-sm mb-2">
                  <span className="font-medium">Bahan:</span>{" "}
                  {parseIngredients(fav.ingredients)}
                </p>
                <p className="text-sm mb-2">
                  <span className="font-medium">Instruksi:</span> {fav.instructions}
                </p>
                <a
                  href={fav.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-sm"
                >
                  Lihat Video
                </a>
                <button
                  onClick={() => handleDelete(fav.id)}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Hapus dari Favorit
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FavoritIndonesia;
