import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import logoImage from "../assets/1.jpeg";
// Import Firebase dependencies - only import what we need
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase"; // Import db directly from firebase.js

function AddNewProduct() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [showShoeSizes, setShowShoeSizes] = useState(false);
  const [showPantsSizes, setShowPantsSizes] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    productName: "",
    category: "חולצות", // Default category
    isShoe: false, // Indicates if item is a shoe when in "New Collection"
    isPants: false, // New field to indicate if item is pants when in "New Collection"
    price: "",
    description: "",
    sizes: {
      XS: false,
      S: false,
      M: false,
      L: false,
      XL: false,
      XXL: false,
      XXXL: false,
    },
    shoeSizes: {
      39: false,
      40: false,
      41: false,
      42: false,
      43: false,
      44: false,
      45: false,
    },
    pantsSizes: {
      29: false,
      30: false,
      31: false,
      32: false,
      33: false,
      34: false,
      35: false,
      36: false,
      37: false,
      38: false,
    },
    image: null, // Will store the Base64 string instead of the file
  });

  // Available categories
  const categories = [
    "חולצות",
    "מכנסיים",
    "ז'קטים",
    "נעליים",
    "כובעים",
    "טרנינג",
    "New Collection",
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

  useEffect(() => {
    // Show shoe sizes when category is "נעליים" OR when it's "New Collection" and isShoe is true
    if (
      formData.category === "נעליים" ||
      (formData.category === "New Collection" && formData.isShoe)
    ) {
      setShowShoeSizes(true);
    } else {
      setShowShoeSizes(false);

      // If switching away from a shoe category, reset isShoe if needed
      if (formData.category !== "New Collection" && formData.isShoe) {
        setFormData({
          ...formData,
          isShoe: false,
        });
      }
    }

    // Show pants sizes when category is "מכנסיים" OR when it's "New Collection" and isPants is true
    if (
      formData.category === "מכנסיים" ||
      (formData.category === "New Collection" && formData.isPants)
    ) {
      setShowPantsSizes(true);
    } else {
      setShowPantsSizes(false);

      // If switching away from pants category, reset isPants if needed
      if (formData.category !== "New Collection" && formData.isPants) {
        setFormData({
          ...formData,
          isPants: false,
        });
      }
    }
  }, [formData.category, formData.isShoe, formData.isPants]);

  const handleLogout = () => {
    // Clear authentication data
    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("username");
    setIsAuthenticated(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      sizes: {
        ...formData.sizes,
        [name]: checked,
      },
    });
  };

  const handleShoeCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      shoeSizes: {
        ...formData.shoeSizes,
        [name]: checked,
      },
    });
  };

  const handlePantsCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      pantsSizes: {
        ...formData.pantsSizes,
        [name]: checked,
      },
    });
  };

  const handleIsShoeChange = (e) => {
    const { checked } = e.target;
    setFormData({
      ...formData,
      isShoe: checked,
      // If enabling shoe, disable pants (they can't be both)
      isPants: checked ? false : formData.isPants,
    });
  };

  const handleIsPantsChange = (e) => {
    const { checked } = e.target;
    setFormData({
      ...formData,
      isPants: checked,
      // If enabling pants, disable shoe (they can't be both)
      isShoe: checked ? false : formData.isShoe,
    });
  };

  // Updated image change handler to use Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a FileReader to convert the image to Base64
      const reader = new FileReader();
      reader.readAsDataURL(file); // Convert to Base64

      reader.onload = () => {
        // Set the Base64 string as the image value
        setFormData({
          ...formData,
          image: reader.result, // This is the Base64 string
        });

        // Set the same string for preview
        setImagePreview(reader.result);
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        alert("حدث خطأ أثناء قراءة الملف");
      };
    }
  };

  const clearImage = () => {
    setFormData({
      ...formData,
      image: null,
    });
    setImagePreview(null);

    // Reset the file input
    const fileInput = document.getElementById("image");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // Reset form function
  const resetForm = () => {
    // Reset the file input
    const fileInput = document.getElementById("image");
    if (fileInput) {
      fileInput.value = "";
    }

    // Reset form state to initial values
    setFormData({
      productName: "",
      category: "חולצות", // Default category
      isShoe: false,
      isPants: false,
      price: "",
      description: "",
      sizes: {
        XS: false,
        S: false,
        M: false,
        L: false,
        XL: false,
        XXL: false,
        XXXL: false,
      },
      shoeSizes: {
        39: false,
        40: false,
        41: false,
        42: false,
        43: false,
        44: false,
        45: false,
      },
      pantsSizes: {
        29: false,
        30: false,
        31: false,
        32: false,
        33: false,
        34: false,
        35: false,
        36: false,
        37: false,
        38: false,
      },
      image: null,
    });

    // Reset image preview
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Prepare data for Firestore
      const availableSizes = Object.keys(formData.sizes).filter(
        (size) => formData.sizes[size]
      );

      const availableShoeSizes = Object.keys(formData.shoeSizes).filter(
        (size) => formData.shoeSizes[size]
      );

      const availablePantsSizes = Object.keys(formData.pantsSizes).filter(
        (size) => formData.pantsSizes[size]
      );

      // Prepare product data
      const productData = {
        name: formData.productName,
        price: parseFloat(formData.price),
        description: formData.description || "",
        regularSizes: availableSizes,
        createdAt: serverTimestamp(),
        imageUrl: formData.image, // Store the Base64 string directly
      };

      // Add shoe specific data
      if (showShoeSizes) {
        productData.isShoe = true;
        productData.shoeSizes = availableShoeSizes;
      }

      // Add pants specific data
      if (showPantsSizes) {
        productData.isPants = true;
        productData.pantsSizes = availablePantsSizes;
      }

      // Add to Firestore under the selected category
      const categoryCollectionRef = collection(db, formData.category);
      await addDoc(categoryCollectionRef, productData);

      // Show success message
      alert(" נוסף בהצלחה!");

      // Reset form state instead of navigating
      resetForm();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("שגיאה בהוספת המוצר: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Navigate back to admin page without saving
    navigate("/adminPage");
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
          <h1 className="text-xl font-bold">إضافة منتج جديد</h1>

          {/* Logout Button */}
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
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white shadow-md rounded-lg p-6">
            <form onSubmit={handleSubmit}>
              {/* Product Name */}
              <div className="mb-6">
                <label
                  htmlFor="productName"
                  className="block text-gray-700 font-medium mb-2"
                >
                  اسم المنتج *
                </label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 border focus:ring-black focus:border-black"
                  required
                />
              </div>

              {/* Category Selection */}
              <div className="mb-6">
                <label
                  htmlFor="category"
                  className="block text-gray-700 font-medium mb-2"
                >
                  الفئة *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 border focus:ring-black focus:border-black"
                  required
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Type Checkboxes - Only visible for New Collection */}
              {formData.category === "New Collection" && (
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    نوع المنتج
                  </label>
                  <div className="flex flex-col space-y-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isShoe}
                        onChange={handleIsShoeChange}
                        className="rounded border-gray-300 text-black focus:ring-black"
                      />
                      <span className="mr-2">هذا المنتج هو حذاء</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isPants}
                        onChange={handleIsPantsChange}
                        className="rounded border-gray-300 text-black focus:ring-black"
                      />
                      <span className="mr-2">هذا المنتج هو بنطلون</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="mb-6">
                <label
                  htmlFor="price"
                  className="block text-gray-700 font-medium mb-2"
                >
                  السعر (₪) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 border focus:ring-black focus:border-black"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <label
                  htmlFor="description"
                  className="block text-gray-700 font-medium mb-2"
                >
                  وصف المنتج
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 border focus:ring-black focus:border-black"
                />
              </div>

              {/* Regular Sizes - always show these */}
              <div className="mb-6">
                <h3 className="block text-gray-700 font-medium mb-2">
                  الأحجام المتوفرة
                </h3>
                <div className="flex flex-wrap gap-4">
                  {Object.keys(formData.sizes).map((size) => (
                    <label key={size} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name={size}
                        checked={formData.sizes[size]}
                        onChange={handleCheckboxChange}
                        className="rounded border-gray-300 text-black focus:ring-black"
                      />
                      <span className="mr-2">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pants Sizes - Only visible for pants category or New Collection with isPants=true */}
              {showPantsSizes && (
                <div className="mb-6">
                  <h3 className="block text-gray-700 font-medium mb-2">
                    مقاسات البنطلونات
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {Object.keys(formData.pantsSizes).map((size) => (
                      <label key={size} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          name={size}
                          checked={formData.pantsSizes[size]}
                          onChange={handlePantsCheckboxChange}
                          className="rounded border-gray-300 text-black focus:ring-black"
                        />
                        <span className="mr-2">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Shoe Sizes - Only visible for shoes category or New Collection with isShoe=true */}
              {showShoeSizes && (
                <div className="mb-6">
                  <h3 className="block text-gray-700 font-medium mb-2">
                    مقاسات الأحذية
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {Object.keys(formData.shoeSizes).map((size) => (
                      <label key={size} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          name={size}
                          checked={formData.shoeSizes[size]}
                          onChange={handleShoeCheckboxChange}
                          className="rounded border-gray-300 text-black focus:ring-black"
                        />
                        <span className="mr-2">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Image Upload with Preview and Clear Option */}
              <div className="mb-6">
                <label
                  htmlFor="image"
                  className="block text-gray-700 font-medium mb-2"
                >
                  صورة المنتج *
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 border focus:ring-black focus:border-black"
                  required={!imagePreview}
                />

                {/* Image Preview with X button */}
                {imagePreview && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-gray-700 font-medium">
                        معاينة الصورة
                      </h4>
                      <button
                        type="button"
                        onClick={clearImage}
                        className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 focus:outline-none"
                        title="حذف الصورة"
                      >
                        ×
                      </button>
                    </div>
                    <div className="border border-gray-200 rounded-md p-2 w-full flex justify-center">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="max-h-64 object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-300 text-gray-800 px-6 py-2 rounded text-sm hover:bg-gray-400 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-black text-white px-6 py-2 rounded text-sm hover:bg-gray-800 transition-colors"
                  disabled={submitting}
                >
                  {submitting ? "جاري الإضافة..." : "إضافة المنتج"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AddNewProduct;
