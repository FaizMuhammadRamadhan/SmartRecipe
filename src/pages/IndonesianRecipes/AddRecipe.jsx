import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { div } from "framer-motion/client";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const AddRecipe = () => {
  const [form, setForm] = useState({
    title: "",
    imageUrl: "",
    ingredients: "",
    instructions: "",
    region: "",
    videoUrl: "",
    category: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/indonesian-recipes",
        {
          ...form,
          ingredients: JSON.stringify(form.ingredients.split(",")), // ubah string jadi array lalu stringify
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Swal.fire("Sukses", "Resep berhasil ditambahkan!", "success");
      navigate("/indonesian-recipes");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal menambah resep", "error");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md my-5">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Tambah Resep Baru
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="title"
            placeholder="Judul"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded p-3"
            required
          />
          <input
            type="text"
            name="imageUrl"
            placeholder="Link Gambar"
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full border rounded p-3"
            required
          />
          <textarea
            name="ingredients"
            placeholder="Bahan-bahan (pisahkan dengan koma)"
            value={form.ingredients}
            onChange={handleChange}
            className="w-full border rounded p-3"
            rows="4"
            required
          />
          <textarea
            name="instructions"
            placeholder="Instruksi Memasak"
            value={form.instructions}
            onChange={handleChange}
            className="w-full border rounded p-3"
            rows="5"
            required
          />
          <input
            type="text"
            name="region"
            placeholder="Asal Daerah"
            value={form.region}
            onChange={handleChange}
            className="w-full border rounded p-3"
            required
          />
          <input
            type="text"
            name="videoUrl"
            placeholder="Link Video YouTube (opsional)"
            value={form.videoUrl}
            onChange={handleChange}
            className="w-full border rounded p-3"
          />
          <input
            type="text"
            name="category"
            placeholder="Kategori Makanan (Appetizer, Main Course, Snack, Salad,  Side Dish)"
            value={form.category}
            onChange={handleChange}
            className="w-full border rounded p-3"
          />
          <div className="grid grid-cols-2 gap-2">
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition md:mb-4"
            >
              Simpan Resep
            </button>
            <button
              type="button"
              onClick={() => navigate("/indonesian-recipes")}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition md:mb-4"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
      <Footer/>
    </div>
  );
};

export default AddRecipe;
