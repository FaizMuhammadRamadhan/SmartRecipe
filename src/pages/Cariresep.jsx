import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import bahanMapping from "../constants/bahanMapping";
import Loading from "../components/Loading";
import Headerpage from "../components/Headerpage";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2"; 

const formatBahan = (input) => {
  return input
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .map((item) => bahanMapping[item] || item)
    .join(",");
};

const CariResep = () => {
  const [bahan, setBahan] = useState("");
  const [resep, setResep] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailResep, setDetailResep] = useState(null);
  const [porsi, setPorsi] = useState(1);
  const [bahanPerPorsi, setBahanPerPorsi] = useState([]);

  const getRecipes = async () => {
    if (!bahan) return;
    setLoading(true);
    const formattedBahan = formatBahan(bahan);
    try {
      const response = await axios.get(
        "https://api.spoonacular.com/recipes/findByIngredients",
        {
          params: {
            ingredients: formattedBahan,
            number: 100,
            apiKey: "f83e042219484f66af543881113c9b3a",
          },
        }
      );

      setResep(response.data);
      localStorage.setItem("hasilPencarian", JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching recipes:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const lihatDetailResep = async (id) => {
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/${id}/information`,
        {
          params: {
            apiKey: "f83e042219484f66af543881113c9b3a",
            includeNutrition: true,
          },
        }
      );
      setDetailResep(response.data);
      setPorsi(response.data.servings || 1);
      const bahanAsli = response.data.extendedIngredients.map((item) => ({
        id: item.id,
        name: item.name,
        amount: item.amount / (response.data.servings || 1),
        unit: item.unit,
      }));
      setBahanPerPorsi(bahanAsli);
    } catch (error) {
      console.error("Gagal memuat detail resep:", error.message);
    }
  };

  const handleUbahPorsi = (nilaiPorsiBaru) => {
    if (!detailResep) return;

    const porsiValid = Math.max(1, nilaiPorsiBaru);
    const faktor = porsiValid / detailResep.servings;

    const bahanBaru = detailResep.extendedIngredients.map((item) => ({
      ...item,
      amount: item.amount
        ? Math.round(item.amount * faktor)
        : item.amount === 0
        ? Math.round(1 * faktor)
        : item.amount,
    }));

    setDetailResep({
      ...detailResep,
      servings: porsiValid,
      extendedIngredients: bahanBaru,
    });

    setPorsi(porsiValid);
  };

  const closeDetail = () => {
    setDetailResep(null);
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

  const [halamanSaatIni, setHalamanSaatIni] = useState(1);
  const resepPerHalaman = 12;
  const indeksResepTerakhir = halamanSaatIni * resepPerHalaman;
  const indeksResepPertama = indeksResepTerakhir - resepPerHalaman;
  const resepSaatIni = resep.slice(indeksResepPertama, indeksResepTerakhir);

  const gantiHalaman = (nomorHalaman) => setHalamanSaatIni(nomorHalaman);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <Headerpage
            children2={
              "Masukkan bahan yang kamu miliki di rumah, dan temukan resep lezat yang bisa dibuat dengan mudah!"
            }
          >
            Cari Resep Lezat
          </Headerpage>

          <div className="flex gap-3 mb-8">
            <input
              type="text"
              className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition"
              placeholder="Masukkan bahan (pisahkan dengan koma)"
              value={bahan}
              onChange={(e) => setBahan(e.target.value)}
            />
            <button
              onClick={getRecipes}
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
                  <div className="text-sm text-gray-500 mt-2">
                    🍽️ Porsi: {item.servings} | ⏱️ {item.readyInMinutes} menit
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => lihatDetailResep(item.id)}
                      className="flex-1 bg-[#3b82f6] text-white py-2 font-semibold rounded-lg hover:bg-[#2563eb] transition"
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

          <div className="flex justify-center mt-8 space-x-2">
            {Array.from(
              { length: Math.ceil(resep.length / resepPerHalaman) },
              (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => gantiHalaman(index + 1)}
                  className={`px-4 py-2 rounded-lg ${
                    halamanSaatIni === index + 1
                      ? "bg-[#3b82f6] text-white"
                      : "bg-gray-200 text-gray-700"
                  } hover:bg-[#2563eb] transition`}
                >
                  {index + 1}
                </button>
              )
            )}
          </div>

          {detailResep && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-2xl w-[90%] md:w-[70%] lg:w-[60%] max-h-[90vh] overflow-y-auto shadow-2xl relative">
                <button
                  onClick={closeDetail}
                  className="absolute top-4 right-4 bg-red-500 text-white font-bold p-2 w-10 rounded-full hover:bg-red-600 transition"
                >
                  ✕
                </button>

                <h2 className="text-3xl font-extrabold text-[#2E5077] mb-4 text-center">
                  {detailResep.title}
                </h2>
                <img
                  src={detailResep.image}
                  alt={detailResep.title}
                  className="w-full h-64 object-cover rounded-lg shadow-md mb-6"
                />

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="mb-6 flex items-center gap-4">
                    <h3 className="text-lg font-bold text-[#2E5077]">Porsi:</h3>
                    <input
                      type="number"
                      value={porsi}
                      onChange={(e) => handleUbahPorsi(Number(e.target.value))}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:outline-none"
                      min={1}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    ⏱️ <span className="font-semibold">Waktu Masak:</span>{" "}
                    {detailResep.readyInMinutes} menit
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-[#2E5077] mb-2">
                    🛒 Bahan:
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {bahanPerPorsi.map((item) => {
                      const jumlahBaru = item.amount * porsi;
                      return (
                        <li key={item.id} className="ml-4">
                          {`${jumlahBaru.toFixed(2).replace(/\.00$/, "")} ${
                            item.unit
                          } ${item.name}`}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-[#2E5077] mb-2">
                    👨‍🍳 Instruksi:
                  </h3>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: detailResep.instructions,
                    }}
                    className="text-gray-700 leading-relaxed"
                  />
                </div>

                {detailResep.nutrition && (
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-[#2E5077] mb-2">
                      🍎 Kandungan Nutrisi:
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {detailResep.nutrition.nutrients.map((nutrient) => (
                        <div
                          key={nutrient.name}
                          className="bg-gray-100 p-3 rounded-lg shadow-sm flex justify-between"
                        >
                          <span className="font-medium text-gray-700">
                            {nutrient.name}
                          </span>
                          <span className="font-bold text-[#2E5077]">
                            {nutrient.amount} {nutrient.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CariResep;
