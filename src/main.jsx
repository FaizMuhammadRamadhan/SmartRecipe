import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

// Import Pages
import Homepage from "./pages/Homepage";
import Cariresep from "./pages/Cariresep";
import About from "./pages/About";
import Resepdiet from "./pages/Resepdiet";
import ResepNegara from "./pages/ResepNEgara";
import Lihatfitur from "./pages/Lihatfitur";
import AuthPage from "./pages/AuthPage";
import FavoritSaya from "./pages/FavoritSaya";
import EditProfile from "./pages/EditProfile";
import ResepIndonesia from "./pages/ResepIndonesia";
import ListRecipes from "./pages/IndonesianRecipes/ListRecipes";
import AddRecipe from "./pages/IndonesianRecipes/AddRecipe";
import EditRecipe from "./pages/IndonesianRecipes/EditRecipe";
import ManageUsers from "./pages/ManageUsers";

// Import Components
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound"; // Tambahkan import NotFound
import FavoritIndonesia from "./pages/FavoritIndonesia";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthPage />, // halaman login & register
    errorElement: <NotFound />, // Kalau URL salah dari sini dilempar ke NotFound
  },
  {
    path: "/homepage",
    element: (
      <ProtectedRoute>
        <Homepage />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/about",
    element: (
      <ProtectedRoute>
        <About />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/cariresep",
    element: (
      <ProtectedRoute>
        <Cariresep />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/resepdiet",
    element: (
      <ProtectedRoute>
        <Resepdiet />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/resepberbagainegara",
    element: (
      <ProtectedRoute>
        <ResepNegara />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/resepindonesia",
    element: (
      <ProtectedRoute>
        <ResepIndonesia />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/lihatfitur",
    element: (
      <ProtectedRoute>
        <Lihatfitur />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/favorit-saya",
    element: (
      <ProtectedRoute>
        <FavoritSaya />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/edit-profil",
    element: (
      <ProtectedRoute>
        <EditProfile />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/favorit-indonesia",
    element: (
      <ProtectedRoute>
        <FavoritIndonesia />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },

  // ====== HANYA SUPERADMIN YANG BOLEH ======
  {
    path: "/indonesian-recipes",
    element: (
      <ProtectedRoute allowedRole="superadmin">
        <ListRecipes />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/indonesian-recipes/add",
    element: (
      <ProtectedRoute allowedRole="superadmin">
        <AddRecipe />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/indonesian-recipes/edit/:id",
    element: (
      <ProtectedRoute allowedRole="superadmin">
        <EditRecipe />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/manage-users",
    element: (
      <ProtectedRoute allowedRole="superadmin">
        <ManageUsers />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  // ===== WILDCARD / semua path tidak dikenal =====
  {
    path: "*",
    element: <NotFound />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
