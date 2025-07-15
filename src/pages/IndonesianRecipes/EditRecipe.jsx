import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

const EditRecipe = () => {
  const { id } = useParams();
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

  const fetchRecipe = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/indonesian-recipes/${id}`
      );
      setForm({
        ...res.data,
        ingredients: JSON.parse(res.data.ingredients).join(", "), // agar bisa diedit sebagai teks
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/indonesian-recipes/${id}`,
        {
          ...form,
          ingredients: JSON.stringify(form.ingredients.split(",")),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire("Sukses", "Resep berhasil diupdate!", "success");
      navigate("/indonesian-recipes");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal update resep", "error");
    }
  };

  return (
    <div className="">
      <Navbar/>
      <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md md:mt-10 md:mb-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Edit Resep</h1>
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
          <div className="grid grid-cols-2 gap-3">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Update Resep
            </button>
            <button
              type="button"
              onClick={() => navigate("/indonesian-recipes")}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default EditRecipe;
