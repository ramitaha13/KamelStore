import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase"; // Import your existing Firestore instance

function CheckoutPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Customer information form state
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    location: "",
    town: "",
    email: "",
    notes: "",
  });

  // Form validation state
  const [errors, setErrors] = useState({});

  // Load cart data from localStorage on component mount
  useEffect(() => {
    const loadCartFromStorage = () => {
      try {
        const storedCart = JSON.parse(localStorage.getItem("yourcart")) || [];
        setCartItems(storedCart);
        calculateTotal(storedCart);
        setLoading(false);
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        setCartItems([]);
        setLoading(false);
      }
    };

    loadCartFromStorage();
  }, []);

  // Calculate cart total
  const calculateTotal = (items) => {
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalAmount(total);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10,12}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.town.trim()) {
      newErrors.town = "Town is required";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      // Combine order information (cart items + customer details)
      const orderData = {
        customerInfo: formData,
        items: cartItems,
        totalAmount: totalAmount,
        orderDate: serverTimestamp(),
        status: "pending", // You can add initial status
      };

      // Save to Firestore under "OrdersStore" collection
      const docRef = await addDoc(collection(db, "OrdersStore"), orderData);
      console.log("Order saved with ID: ", docRef.id);

      // Save the complete order with ID to localStorage
      localStorage.setItem(
        "currentOrder",
        JSON.stringify({
          ...orderData,
          id: docRef.id,
        })
      );

      // Clear cart
      localStorage.removeItem("yourcart");

      // Show success message (optional)
      alert("Order placed successfully!");

      // Redirect to confirmation page
      navigate("/order-confirmation");
    } catch (error) {
      console.error("Error adding order to Firestore: ", error);
      alert("There was an error placing your order. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top announcement banner */}
      <div
        className="bg-gray-700 text-white py-2 text-center text-sm font-medium"
        dir="rtl"
      >
        توصيل سريع خلال يومين حتى ثلاثة أيام لجميع المناطق البلاد
      </div>

      {/* Header with right-aligned back arrow and no text */}
      <header className="bg-black text-white py-4 border-b border-gray-800">
        <div className="container mx-auto px-4 flex justify-end">
          <Link to="/cart" className="text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ transform: "scaleX(-1)" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            <p className="mt-2">Loading...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl mb-4">Your cart is empty</p>
            <Link
              to="/"
              className="bg-white text-black py-2 px-6 rounded hover:bg-gray-200 transition-colors duration-300"
            >
              Return to Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customer information form */}
            <div dir="rtl">
              <h2 className="text-xl font-semibold mb-4 text-right">
                معلومات الزبون
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 text-right">
                    الاسم الكامل*
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-800 rounded-md border ${
                      errors.name ? "border-red-500" : "border-gray-700"
                    } px-4 py-2 focus:outline-none focus:ring-1 focus:ring-white text-right`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1 text-right">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 text-right">
                    رقم الهاتف*
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-800 rounded-md border ${
                      errors.phoneNumber ? "border-red-500" : "border-gray-700"
                    } px-4 py-2 focus:outline-none focus:ring-1 focus:ring-white text-right`}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1 text-right">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 text-right">
                    المدينة*
                  </label>
                  <input
                    type="text"
                    name="town"
                    value={formData.town}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-800 rounded-md border ${
                      errors.town ? "border-red-500" : "border-gray-700"
                    } px-4 py-2 focus:outline-none focus:ring-1 focus:ring-white text-right`}
                  />
                  {errors.town && (
                    <p className="text-red-500 text-sm mt-1 text-right">
                      {errors.town}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 text-right">
                    العنوان*
                  </label>
                  <textarea
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    rows="2"
                    className={`w-full bg-gray-800 rounded-md border ${
                      errors.location ? "border-red-500" : "border-gray-700"
                    } px-4 py-2 focus:outline-none focus:ring-1 focus:ring-white text-right`}
                  ></textarea>
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1 text-right">
                      {errors.location}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 text-right">
                    البريد الإلكتروني (اختياري)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-800 rounded-md border ${
                      errors.email ? "border-red-500" : "border-gray-700"
                    } px-4 py-2 focus:outline-none focus:ring-1 focus:ring-white text-right`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 text-right">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 text-right">
                    ملاحظات على الطلب (اختياري)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="2"
                    placeholder="تعليمات خاصة للتوصيل"
                    className="w-full bg-gray-800 rounded-md border border-gray-700 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-white text-right"
                  ></textarea>
                </div>
              </form>
            </div>

            {/* Order summary */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="bg-gray-900 rounded-lg p-4">
                {/* Order items */}
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between pb-3 border-b border-gray-800"
                    >
                      <div className="flex">
                        <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-800 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/placeholder-product.jpg";
                            }}
                          />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-400">
                            {item.quantity} × {item.price.toFixed(2)} ₪
                          </p>
                          {item.selectedSizes && (
                            <p className="text-xs text-gray-500">
                              Sizes: {item.selectedSizes.join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="font-medium">
                        {(item.price * item.quantity).toFixed(2)} ₪
                      </p>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="pt-3 border-t border-gray-700">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-lg font-bold">
                      {totalAmount.toFixed(2)} ₪
                    </span>
                  </div>
                </div>

                {/* Place order button - now shows loading state */}
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className={`w-full ${
                    submitting ? "bg-gray-400" : "bg-white hover:bg-gray-200"
                  } text-black py-3 px-6 rounded font-medium transition-colors duration-300 mt-4 flex justify-center items-center`}
                >
                  {submitting ? (
                    <>
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></span>
                      Processing...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default CheckoutPage;
