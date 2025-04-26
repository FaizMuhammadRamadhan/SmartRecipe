import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import Homepage from "./pages/Homepage";
import Cariresep from "./pages/Cariresep";
import About from "./pages/About";
import Resepdiet from "./pages/Resepdiet";
import ResepNegara from "./pages/ResepNEgara";
import Lihatfitur from "./pages/Lihatfitur";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
import AuthPage from "./pages/AuthPage";
import FavoritSaya from "./pages/FavoritSaya";
import EditProfile from "./pages/EditProfile";
import ResepIndonesia from "./pages/ResepIndonesia";
const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthPage />,
  },
  {
    path: "/homepage", element: <Homepage/>
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/cariresep",
    element: <Cariresep />,
  },
  {
    path: "/resepdiet",
    element: <Resepdiet />,
  },
  {
    path: "/resepberbagainegara",
    element: <ResepNegara />,
  },
  { path: "/resepindonesia", element: <ResepIndonesia/>},
  {
    path: "/lihatfitur",
    element: <Lihatfitur />,
  },
  // { path: "/login", element: <Login /> }, // 
  // { path: "/register", element: <Register /> }, // 
  // {
  //   path: "/auth",
  //   element: <AuthPage />,
  // },
  {path:"/favorit-saya", element:<FavoritSaya />},
  {path:"/edit-profil", element:<EditProfile />},
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
