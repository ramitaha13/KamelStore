import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase"; // Make sure you have your Firebase config set up

function JacketsAdmin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    price: 0,
    description: "",
    imageUrl: "",
    regularSizes: [],
  });
  const navigate = useNavigate();

  // Define available jacket sizes
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  // Handle authentication
  useEffect(() => {
    // Check authentication status from session storage
    const authStatus = sessionStorage.getItem("isAuthenticated");
    if (authStatus !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const jacketsCollectionRef = collection(db, "ז'קטים");
        const snapshot = await getDocs(jacketsCollectionRef);

        const productsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching jackets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle delete product
  const handleDeleteProduct = async (productId) => {
    if (window.confirm("هل أنت متأكد أنك تريد حذف هذا المنتج؟")) {
      try {
        // Delete the document from Firestore
        await deleteDoc(doc(db, "ז'קטים", productId));

        // Update the local state
        setProducts(products.filter((product) => product.id !== productId));

        alert("تم حذف المنتج بنجاح");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("خطأ في حذف المنتج. حاول مرة أخرى.");
      }
    }
  };

  // Handle edit button click
  const handleEditClick = async (productId) => {
    try {
      const productDoc = await getDoc(doc(db, "ז'קטים", productId));
      if (productDoc.exists()) {
        const productData = productDoc.data();
        setEditingProduct(productId);
        setEditFormData({
          name: productData.name || "",
          price: productData.price || 0,
          description: productData.description || "",
          imageUrl: productData.imageUrl || "",
          regularSizes: productData.regularSizes || [],
        });
      }
    } catch (error) {
      console.error("Error getting product for editing:", error);
    }
  };

  // Handle input change in edit form
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: name === "price" ? Number(value) : value,
    });
  };

  // Handle size checkboxes in edit form
  const handleSizeChange = (size) => {
    const { regularSizes } = editFormData;
    if (regularSizes.includes(size)) {
      setEditFormData({
        ...editFormData,
        regularSizes: regularSizes.filter((s) => s !== size),
      });
    } else {
      setEditFormData({
        ...editFormData,
        regularSizes: [...regularSizes, size],
      });
    }
  };

  // Handle image upload (base64 conversion)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditFormData({
          ...editFormData,
          imageUrl: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle remove image
  const handleRemoveImage = () => {
    setEditFormData({
      ...editFormData,
      imageUrl: "",
    });
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    try {
      const productRef = doc(db, "ז'קטים", editingProduct);

      // Update the document in Firestore
      await updateDoc(productRef, {
        name: editFormData.name,
        price: editFormData.price,
        description: editFormData.description,
        imageUrl: editFormData.imageUrl,
        regularSizes: editFormData.regularSizes,
      });

      // Update the local state
      setProducts(
        products.map((product) =>
          product.id === editingProduct
            ? { ...product, ...editFormData }
            : product
        )
      );

      // Reset editing state
      setEditingProduct(null);
      alert("تم تحديث المنتج بنجاح");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("خطأ في تحديث المنتج. حاول مرة أخرى.");
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  // Back to admin page
  const handleBackToAdmin = () => {
    navigate("/adminPage");
  };

  // Formatting for sizes display
  const formatSizes = (sizes) => {
    if (!sizes || !Array.isArray(sizes)) return "غير متوفر";
    return sizes.join(", ");
  };

  // Truncate description for display
  const truncateDescription = (text, maxLength = 50) => {
    if (!text) return "—";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-50 py-6 px-3 sm:py-8 sm:px-4"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header with product count */}
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
            <button
              onClick={handleBackToAdmin}
              className="bg-gray-800 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded hover:bg-gray-700 text-sm sm:text-base order-1 self-start"
            >
              العودة إلى لوحة التحكم
            </button>
            <h1 className="text-xl sm:text-2xl font-bold order-2 sm:order-1">
              إدارة الجاكيتات
            </h1>
          </div>

          {/* Products count badge */}
          <div className="bg-white shadow-sm rounded-md py-2 px-4 inline-block">
            <span className="text-gray-700 font-medium">
              عدد المنتجات:{" "}
              <span className="text-blue-600 font-bold">{products.length}</span>
            </span>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p>لم يتم العثور على جاكيتات. يرجى إضافة منتجات جديدة.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الصورة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الاسم
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      السعر
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الوصف
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المقاسات
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      {editingProduct === product.id ? (
                        // Edit form row
                        <td colSpan="6" className="px-6 py-4">
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Image management section */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  الصورة
                                </label>
                                <div className="mb-2">
                                  {editFormData.imageUrl ? (
                                    <div className="relative w-32 h-32 overflow-hidden rounded-md mb-2">
                                      <img
                                        src={editFormData.imageUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                      />
                                      <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl"
                                        title="حذف الصورة"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-4 w-4"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="w-32 h-32 flex items-center justify-center bg-gray-100 border border-gray-300 rounded-md mb-2">
                                      <span className="text-gray-400">
                                        لا توجد صورة
                                      </span>
                                    </div>
                                  )}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                  />
                                </div>
                              </div>

                              {/* Name and price */}
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">
                                    الاسم
                                  </label>
                                  <input
                                    type="text"
                                    name="name"
                                    value={editFormData.name}
                                    onChange={handleEditFormChange}
                                    className="mt-1 p-2 border rounded-md w-full"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700">
                                    السعر
                                  </label>
                                  <input
                                    type="number"
                                    name="price"
                                    value={editFormData.price}
                                    onChange={handleEditFormChange}
                                    className="mt-1 p-2 border rounded-md w-full"
                                  />
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                الوصف
                              </label>
                              <textarea
                                name="description"
                                value={editFormData.description}
                                onChange={handleEditFormChange}
                                className="mt-1 p-2 border rounded-md w-full"
                                rows="3"
                              ></textarea>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                المقاسات
                              </label>
                              <div className="flex flex-wrap gap-3">
                                {availableSizes.map((size) => (
                                  <label
                                    key={size}
                                    className="inline-flex items-center"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={editFormData.regularSizes.includes(
                                        size
                                      )}
                                      onChange={() => handleSizeChange(size)}
                                      className="form-checkbox h-5 w-5"
                                    />
                                    <span className="mr-2">{size}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            <div className="flex justify-end space-x-2 space-x-reverse">
                              <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                              >
                                إلغاء
                              </button>
                              <button
                                type="button"
                                onClick={handleSaveEdit}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                              >
                                حفظ
                              </button>
                            </div>
                          </div>
                        </td>
                      ) : (
                        // Normal display row
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-14 w-14 overflow-hidden rounded-md">
                              {product.imageUrl ? (
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/placeholder-jacket.jpg";
                                  }}
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-gray-100">
                                  <span className="text-gray-400 text-xs">
                                    لا توجد صورة
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {product.price} NIS
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className="text-sm text-gray-900"
                              title={product.description}
                            >
                              {truncateDescription(product.description)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatSizes(product.regularSizes)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2 space-x-reverse">
                            <button
                              onClick={() => handleEditClick(product.id)}
                              className="text-indigo-600 hover:text-indigo-900 ml-2"
                            >
                              تعديل
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              حذف
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View - Only visible on mobile devices */}
            <div className="md:hidden">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white shadow rounded-lg mb-4 overflow-hidden"
                >
                  {editingProduct === product.id ? (
                    // Mobile Edit Form
                    <div className="p-4">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            الصورة
                          </label>
                          <div className="mb-2">
                            {editFormData.imageUrl ? (
                              <div className="relative w-full h-48 overflow-hidden rounded-md mb-2">
                                <img
                                  src={editFormData.imageUrl}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={handleRemoveImage}
                                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl"
                                  title="حذف الصورة"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </button>
                              </div>
                            ) : (
                              <div className="w-full h-48 flex items-center justify-center bg-gray-100 border border-gray-300 rounded-md mb-2">
                                <span className="text-gray-400">
                                  لا توجد صورة
                                </span>
                              </div>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            الاسم
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={editFormData.name}
                            onChange={handleEditFormChange}
                            className="mt-1 p-2 border rounded-md w-full"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            السعر
                          </label>
                          <input
                            type="number"
                            name="price"
                            value={editFormData.price}
                            onChange={handleEditFormChange}
                            className="mt-1 p-2 border rounded-md w-full"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            الوصف
                          </label>
                          <textarea
                            name="description"
                            value={editFormData.description}
                            onChange={handleEditFormChange}
                            className="mt-1 p-2 border rounded-md w-full"
                            rows="3"
                          ></textarea>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            المقاسات
                          </label>
                          <div className="flex flex-wrap gap-3">
                            {availableSizes.map((size) => (
                              <label
                                key={size}
                                className="inline-flex items-center"
                              >
                                <input
                                  type="checkbox"
                                  checked={editFormData.regularSizes.includes(
                                    size
                                  )}
                                  onChange={() => handleSizeChange(size)}
                                  className="form-checkbox h-5 w-5"
                                />
                                <span className="mr-2">{size}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2 space-x-reverse">
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                          >
                            إلغاء
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveEdit}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            حفظ
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Mobile Product Card
                    <>
                      <div className="relative">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/placeholder-jacket.jpg";
                            }}
                          />
                        ) : (
                          <div className="w-full h-48 flex items-center justify-center bg-gray-100">
                            <span className="text-gray-400">لا توجد صورة</span>
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 text-lg mb-1">
                          {product.name}
                        </h3>
                        <p className="text-gray-700 mb-2">
                          {product.price} NIS
                        </p>

                        {product.description && (
                          <div className="mb-2">
                            <h4 className="text-xs text-gray-500 uppercase">
                              الوصف
                            </h4>
                            <p className="text-sm text-gray-600">
                              {truncateDescription(product.description, 100)}
                            </p>
                          </div>
                        )}

                        {product.regularSizes &&
                          product.regularSizes.length > 0 && (
                            <div className="mb-3">
                              <h4 className="text-xs text-gray-500 uppercase">
                                المقاسات
                              </h4>
                              <p className="text-sm text-gray-600">
                                {formatSizes(product.regularSizes)}
                              </p>
                            </div>
                          )}

                        <div className="flex justify-end space-x-2 space-x-reverse border-t pt-3 mt-3">
                          <button
                            onClick={() => handleEditClick(product.id)}
                            className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-sm"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default JacketsAdmin;
