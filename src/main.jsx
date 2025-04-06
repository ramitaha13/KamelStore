import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Home from "./components/home.jsx";
import Contact from "./components/contact.jsx";
import Products from "./components/products.jsx";
import Pants from "./components/pants.jsx";
import Jackets from "./components/jackets.jsx";
import Shoes from "./components/shoes.jsx";
import Hats from "./components/hats.jsx";
import Tracksuits from "./components/tracksuits.jsx";
import Login from "./components/login.jsx";
import AdminPage from "./components/adminPage.jsx";
import Addnewproduct from "./components/addnewproduct.jsx";
import ProductofAdmin from "./components/productofAdmin.jsx";
import PantsofAdmin from "./components/pantsofAdmin.jsx";
import JacketsofAdmin from "./components/jacketsofAdmin.jsx";
import ShoesofAdmin from "./components/shoesofAdmin.jsx";
import HatsofAdmin from "./components/hatsofAdmin.jsx";
import TracksuitsofAdmin from "./components/tracksuitsofAdmin.jsx";
import Newcollectionofadmin from "./components/new-collectionofadmin.jsx";
import CartPage from "./components/cartPage.jsx";
import ContactSubmissions from "./components/contactSubmissions.jsx";
import CheckoutPage from "./components/checkoutPage.jsx";
import OrdersManagementPage from "./components/ordersManagementPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "*",
    element: <Home />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/products",
    element: <Products />,
  },
  {
    path: "/pants",
    element: <Pants />,
  },
  {
    path: "/jackets",
    element: <Jackets />,
  },
  {
    path: "/shoes",
    element: <Shoes />,
  },
  {
    path: "/hats",
    element: <Hats />,
  },
  {
    path: "/tracksuits",
    element: <Tracksuits />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/adminPage",
    element: (
      <ProtectedRoute>
        <AdminPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/addnewproduct",
    element: (
      <ProtectedRoute>
        <Addnewproduct />
      </ProtectedRoute>
    ),
  },
  {
    path: "/productofAdmin",
    element: (
      <ProtectedRoute>
        <ProductofAdmin />
      </ProtectedRoute>
    ),
  },
  {
    path: "/pantsofAdmin",
    element: (
      <ProtectedRoute>
        <PantsofAdmin />
      </ProtectedRoute>
    ),
  },
  {
    path: "/jacketsofAdmin",
    element: (
      <ProtectedRoute>
        <JacketsofAdmin />
      </ProtectedRoute>
    ),
  },
  {
    path: "/shoesofAdmin",
    element: (
      <ProtectedRoute>
        <ShoesofAdmin />
      </ProtectedRoute>
    ),
  },
  {
    path: "/hatsofAdmin",
    element: (
      <ProtectedRoute>
        <HatsofAdmin />
      </ProtectedRoute>
    ),
  },
  {
    path: "/tracksuitsofAdmin",
    element: (
      <ProtectedRoute>
        <TracksuitsofAdmin />
      </ProtectedRoute>
    ),
  },
  {
    path: "/new-collectionofadmin",
    element: (
      <ProtectedRoute>
        <Newcollectionofadmin />
      </ProtectedRoute>
    ),
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
  {
    path: "/contactSubmissions",
    element: (
      <ProtectedRoute>
        <ContactSubmissions />
      </ProtectedRoute>
    ),
  },
  {
    path: "/checkoutPage",
    element: <CheckoutPage />,
  },
  {
    path: "/ordersManagementPage",
    element: (
      <ProtectedRoute>
        <OrdersManagementPage />
      </ProtectedRoute>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
