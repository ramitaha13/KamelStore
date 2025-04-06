import React, { useState, useEffect } from "react";
import logoImage from "../assets/1.jpeg";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Make sure you have your Firebase config set up

function ProductsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Initialize cart count from localStorage when component mounts
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("yourcart")) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(totalItems);
  }, []);

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const shirtsCollectionRef = collection(db, "חולצות");
        const snapshot = await getDocs(shirtsCollectionRef);

        const shirtsData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "",
            image: data.imageUrl || "/placeholder-shirt.jpg",
            price: data.price || 0,
            soldOut: data.isOutOfStock || false,
            sizes: data.regularSizes || [],
            sku: data.sku || null,
            description: data.description || "",
          };
        });

        setProducts(shirtsData);
      } catch (error) {
        console.error("Error fetching shirts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Add to Cart Handler Function
  const handleAddToCart = (product) => {
    // Get existing cart from localStorage or initialize empty array
    const existingCart = JSON.parse(localStorage.getItem("yourcart")) || [];

    // Create product object with essential details
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1, // Default quantity
      sizes: product.sizes,
    };

    // Check if product already exists in cart
    const existingItemIndex = existingCart.findIndex(
      (item) => item.id === product.id
    );

    if (existingItemIndex !== -1) {
      // If item exists, increase quantity
      existingCart[existingItemIndex].quantity += 1;
    } else {
      // Otherwise add new item
      existingCart.push(cartItem);
    }

    // Save updated cart to localStorage
    localStorage.setItem("yourcart", JSON.stringify(existingCart));

    // Update cart count state with total items including quantities
    const totalItems = existingCart.reduce(
      (total, item) => total + item.quantity,
      0
    );
    setCartCount(totalItems);

    // Show confirmation to user
    alert(`Added ${product.name} to cart!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Top announcement banner */}
      <div
        className="bg-gray-700 text-white py-2 text-center text-sm font-medium"
        dir="rtl"
      >
        توصيل سريع خلال يومين حتى ثلاثة أيام لجميع المناطق البلاد
      </div>

      {/* Navigation */}
      <header className="bg-black text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-2"
            onClick={toggleSidebar}
            aria-label="Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Logo */}
          <a href="/" className="flex items-center mx-auto md:mx-0">
            <img src={logoImage} alt="The Trendy Store" className="h-20" />
          </a>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-6 mx-auto">
            <a href="/" className="text-sm font-medium hover:text-gray-300">
              דף בית
            </a>
            <a
              href="/products"
              className="text-sm font-medium hover:text-gray-300 border-b border-white"
            >
              חולצות
            </a>
            <a
              href="/pants"
              className="text-sm font-medium hover:text-gray-300"
            >
              מכנסיים
            </a>
            <a
              href="/jackets"
              className="text-sm font-medium hover:text-gray-300"
            >
              ז'קטים
            </a>
            <a
              href="/shoes"
              className="text-sm font-medium hover:text-gray-300"
            >
              נעליים
            </a>
            <a href="/hats" className="text-sm font-medium hover:text-gray-300">
              כובעים
            </a>
            <a
              href="/tracksuits"
              className="text-sm font-medium hover:text-gray-300"
            >
              טרנינג
            </a>
            <a
              href="/contact"
              className="text-sm font-medium hover:text-gray-300"
            >
              צור קשר
            </a>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <a href="/login" className="p-1 hidden md:block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </a>
            <a href="/cart" className="p-1 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="absolute -top-1 -right-1 bg-white text-black rounded-full text-xs w-4 h-4 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 bg-black z-50 transition-transform duration-300 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden flex flex-col`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <button
            onClick={toggleSidebar}
            className="text-white p-2"
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto pt-8">
          <div className="flex flex-col space-y-6 px-6">
            <a href="/" className="text-white text-xl hover:text-gray-300 py-2">
              דף בית
            </a>
            <a
              href="/products"
              className="text-white text-xl hover:text-gray-300 py-2"
            >
              חולצות
            </a>
            <a
              href="/pants"
              className="text-white text-xl hover:text-gray-300 py-2"
            >
              מכנסיים
            </a>
            <a
              href="/jackets"
              className="text-white text-xl hover:text-gray-300 py-2"
            >
              ז'קטים
            </a>
            <a
              href="/shoes"
              className="text-white text-xl hover:text-gray-300 py-2"
            >
              נעליים
            </a>
            <a
              href="/hats"
              className="text-white text-xl hover:text-gray-300 py-2"
            >
              כובעים
            </a>
            <a
              href="/tracksuits"
              className="text-white text-xl hover:text-gray-300 py-2"
            >
              טרנינג
            </a>
            <a
              href="/contact"
              className="text-white text-xl hover:text-gray-300 py-2"
            >
              צור קשר
            </a>
          </div>
        </nav>

        <div className="p-6 border-t border-gray-800">
          <a
            href="/login"
            className="flex items-center text-white hover:text-gray-300 mb-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Log in
          </a>

          <div className="flex space-x-4">
            <a
              href="https://www.instagram.com/genova_g_brands/"
              className="text-white hover:text-gray-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@kamelsaleh16"
              className="text-white hover:text-gray-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Secondary announcement banner */}
      <div
        className="bg-gray-300 text-black py-3 text-center font-medium cursor-pointer hover:bg-gray-400 transition-colors duration-300"
        dir="rtl"
        onClick={() => window.open("https://waze.com/ul/hsvc50bsty", "_blank")}
      >
        <a
          href="https://waze.com/ul/hsvc50bsty"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center"
        >
          <span> اضغط هنا للحصول على عنوان محلنا في كابول 👌 </span>
        </a>
      </div>

      {/* Products Main Content */}
      <main className="flex-grow py-8 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Page title */}
          <h1 className="text-4xl font-normal mb-8 md:mb-12 px-6 py-4">
            Products
          </h1>

          {/* Removed Desktop filter options */}
          {/* Removed Mobile filter options */}

          {/* Loading state */}
          {loading && (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              <p className="mt-2">Loading products...</p>
            </div>
          )}

          {/* Products Grid - Responsive */}
          {!loading && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
              {products.map((product) => (
                <div key={product.id} className="group relative">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-auto object-cover aspect-[3/4]"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder-shirt.jpg";
                      }}
                    />
                    {/* Only keeping the Sold Out badge */}
                    {product.soldOut && (
                      <div className="absolute bottom-4 left-4 bg-gray-800 text-white text-sm font-bold px-4 py-2 rounded-full">
                        Sold out
                      </div>
                    )}
                  </div>

                  {/* Enhanced Product Information Section */}
                  <div className="mt-4 space-y-2">
                    {/* Product SKU only (ID removed) */}
                    <div className="flex justify-between items-center">
                      {product.sku && (
                        <p className="text-xs text-gray-400">
                          SKU: {product.sku}
                        </p>
                      )}
                    </div>

                    {/* Product Name with slightly larger font */}
                    <h3 className="text-base font-medium">{product.name}</h3>

                    {/* Price Information - Simplified with no sale comparison */}
                    <div className="flex items-baseline">
                      <p className="text-sm font-bold">
                        {product.price.toFixed(2)} ₪
                      </p>
                    </div>

                    {/* Product Description - Truncated */}
                    {product.description && (
                      <p className="text-xs text-gray-300 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    {/* Available Sizes */}
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="pt-1">
                        <p className="text-xs text-gray-400 mb-1">
                          Available sizes:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {product.sizes.map((size, index) => (
                            <span
                              key={index}
                              className="text-xs border border-gray-600 rounded px-2 py-1"
                            >
                              {size}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full mt-2 bg-white text-black py-2 px-4 rounded hover:bg-gray-200 transition-colors duration-300 text-sm font-medium"
                    disabled={product.soldOut}
                  >
                    {product.soldOut ? "Sold Out" : "Add to Cart"}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* No products message */}
          {!loading && products.length === 0 && (
            <div className="text-center py-10">
              <p>No products available at the moment.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4">
          {/* Payment Methods Section */}
          <div className="text-center mb-6">
            <p className="text-lg mb-3" dir="rtl">
              מזומן - העברה בנקאית
            </p>
          </div>

          {/* Arabic Payment Info */}
          <div className="text-center mb-8" dir="rtl">
            <p className="max-w-2xl mx-auto text-sm text-gray-400">
              للراغبين بالدفع عن طريق التحويل البنك ، يرجى التواصل معنا على رقم
              الهاتف لتنسيق عملية الدفع.
            </p>
          </div>

          {/* Social Media Links */}
          <div className="flex justify-center space-x-6">
            <a
              href="https://www.instagram.com/genova_g_brands/"
              className="text-white hover:text-gray-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@kamelsaleh16"
              className="text-white hover:text-gray-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ProductsPage;
