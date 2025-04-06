import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import logoImage from "../assets/1.jpeg";

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Define clothing categories - Updated path for shirts (חולצות)
  const categories = [
    { name: "חולצות", icon: "👕", path: "/productofAdmin" }, // Changed path for shirts
    { name: "מכנסיים", icon: "👖", path: "/pantsofAdmin" },
    { name: "ז'קטים", icon: "🧥", path: "/jacketsofAdmin" },
    { name: "נעליים", icon: "👟", path: "/shoesofAdmin" },
    { name: "כובעים", icon: "🧢", path: "/hatsofAdmin" },
    { name: "טרנינג", icon: "🩳", path: "/tracksuitsofAdmin" },
    { name: "New Collection", icon: "✨", path: "/new-collectionofadmin" },
  ];

  useEffect(() => {
    // Check authentication status from session storage
    const authStatus = sessionStorage.getItem("isAuthenticated");
    const storedUsername = sessionStorage.getItem("username");

    if (authStatus === "true" && storedUsername) {
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  const handleLogout = () => {
    // Clear authentication data from session storage
    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("username");

    // Also remove userOfStore from local storage
    localStorage.removeItem("userOfStore");

    setIsAuthenticated(false);
  };

  const handleAddProduct = () => {
    navigate("/addnewproduct");
  };

  const handleOrdersManagement = () => {
    navigate("/ordersManagementPage");
  };

  const handleContactSubmissions = () => {
    navigate("/contactSubmissions");
  };

  // If not authenticated, redirect to login page
  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" />;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        جاري التحميل...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100" dir="rtl">
      {/* Header */}
      <header className="bg-black text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img src={logoImage} alt="The Trendy Store" className="h-16" />
          </a>

          {/* Admin Panel Title */}
          <h1 className="text-xl font-bold">لوحة التحكم</h1>

          {/* Logout Button Only (No Welcome Message) */}
          <div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6">
        <div className="container mx-auto">
          {/* Add New Product Button, Orders Management Button and Contact Submissions Button */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h2 className="text-xl font-semibold">إدارة المتجر</h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleContactSubmissions}
                  className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors"
                >
                  للاتصالات
                </button>
                <button
                  onClick={handleOrdersManagement}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  طلبيات
                </button>
                <button
                  onClick={handleAddProduct}
                  className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition-colors"
                >
                  إضافة منتج جديد
                </button>
              </div>
            </div>
          </div>

          {/* Category Cards */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">تصنيفات المنتجات</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6 flex items-center">
                    <div className="text-4xl mr-4">{category.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                    </div>
                  </div>
                  <div className="bg-gray-200 py-3 px-6 flex justify-center items-center">
                    <a
                      href={category.path}
                      className="text-gray-700 hover:text-black text-sm"
                    >
                      عرض المنتجات
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminPage;
