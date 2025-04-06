import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);

  // Load cart data from localStorage on component mount
  useEffect(() => {
    const loadCartFromStorage = () => {
      try {
        const storedCart = JSON.parse(localStorage.getItem("yourcart")) || [];
        // Ensure each item has a selectedSizes array initialized with the first size from sizes array
        const cartWithSelectedSizes = storedCart.map((item) => {
          if (item.sizes && item.sizes.length > 0) {
            const defaultSize = item.sizes[0]; // Always use first size as default
            // If no selectedSizes array exists or it's not the right length, create it
            if (
              !item.selectedSizes ||
              item.selectedSizes.length !== item.quantity
            ) {
              return {
                ...item,
                selectedSizes: Array(item.quantity).fill(defaultSize),
              };
            }
          }
          return item;
        });
        setCartItems(cartWithSelectedSizes);
        calculateTotal(cartWithSelectedSizes);
        // Save the updated cart back to localStorage to ensure defaults are stored
        localStorage.setItem("yourcart", JSON.stringify(cartWithSelectedSizes));
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
    // Only calculate total for the first 2 items
    const firstTwoItems = items.slice(0, 2);
    const total = firstTwoItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalAmount(total);
  };

  // Update quantity of an item
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, quantity: newQuantity };

        // If item has sizes, adjust the selectedSizes array to match new quantity
        if (item.sizes && item.sizes.length > 0) {
          const currentSizes = item.selectedSizes || [];
          const defaultSize = item.sizes[0];

          if (newQuantity > currentSizes.length) {
            // If increasing quantity, add default sizes for new items
            updatedItem.selectedSizes = [
              ...currentSizes,
              ...Array(newQuantity - currentSizes.length).fill(defaultSize),
            ];
          } else {
            // If decreasing quantity, truncate the selectedSizes array
            updatedItem.selectedSizes = currentSizes.slice(0, newQuantity);
          }
        }

        return updatedItem;
      }
      return item;
    });

    setCartItems(updatedCart);
    localStorage.setItem("yourcart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  // Update selected size for a specific item index
  const updateItemSize = (id, index, newSize) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id && item.selectedSizes) {
        const updatedSizes = [...item.selectedSizes];
        updatedSizes[index] = newSize;
        return { ...item, selectedSizes: updatedSizes };
      }
      return item;
    });

    setCartItems(updatedCart);
    localStorage.setItem("yourcart", JSON.stringify(updatedCart));
  };

  // Remove item from cart
  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("yourcart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("yourcart");
    setTotalAmount(0);
  };

  // Handle checkout - Navigate to checkout page
  const handleCheckout = () => {
    // Only take the first 2 items from cart
    const checkoutItems = cartItems.slice(0, 2);

    // Save the limited cart data
    localStorage.setItem("Yourinvitation", JSON.stringify(checkoutItems));

    // Also update the main cart to only include the first 2 items
    localStorage.setItem("yourcart", JSON.stringify(checkoutItems));

    // Navigate to checkout page
    navigate("/checkoutPage");
  };

  // Check if cart has more than 2 items
  const hasExcessItems = cartItems.length > 2;

  // Display items - only first 2 will be enabled for checkout
  const displayItems = cartItems;
  const checkoutItems = cartItems.slice(0, 2);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top announcement banner */}
      <div
        className="bg-gray-700 text-white py-2 text-center text-sm font-medium"
        dir="rtl"
      >
        توصيل سريع خلال يومين حتى ثلاثة أيام لجميع المناطق البلاد
      </div>

      {/* Header with back button on right side */}
      <header className="bg-black text-white py-4 border-b border-gray-800">
        <div className="container mx-auto px-4 flex items-center justify-end">
          <Link to="/" className="text-white">
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
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            <p className="mt-2">Loading your cart...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-500 mb-4"
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
            <p className="text-xl mb-4">Your cart is empty</p>
            <Link
              to="/"
              className="bg-white text-black py-2 px-6 rounded hover:bg-gray-200 transition-colors duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div>
            {/* Warning message if more than 2 items - in Arabic */}
            {hasExcessItems && (
              <div
                className="bg-yellow-600 text-white p-4 rounded-lg mb-6"
                dir="rtl"
              >
                <p className="text-center font-medium">
                  يمكنك طلب عنصرين فقط في الطلب الواحد. سيتم معالجة العناصر
                  الأولى فقط في هذا الطلب.
                </p>
              </div>
            )}

            {/* Cart items */}
            <div className="mb-8">
              {displayItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex flex-col py-4 border-b border-gray-800 ${
                    index >= 2 ? "opacity-50" : ""
                  }`}
                >
                  {index === 2 && (
                    <div
                      className="bg-gray-800 text-white py-2 px-4 rounded-lg mb-3"
                      dir="rtl"
                    >
                      <p className="text-center">
                        العناصر أدناه لن يتم تضمينها في هذا الطلب
                      </p>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row">
                    {/* Product image */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0">
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

                    {/* Product details */}
                    <div className="flex-grow ml-4 mt-2 sm:mt-0">
                      <h3 className="text-lg font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-300 mt-1">
                        {item.price.toFixed(2)} ₪
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4 sm:mt-0">
                      {/* Quantity control */}
                      <div className="flex items-center mr-4">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className={`w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center ${
                            index < 2
                              ? "hover:bg-gray-700"
                              : "cursor-not-allowed opacity-50"
                          }`}
                          disabled={index >= 2}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 12H4"
                            />
                          </svg>
                        </button>
                        <span className="mx-3 w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className={`w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center ${
                            index < 2
                              ? "hover:bg-gray-700"
                              : "cursor-not-allowed opacity-50"
                          }`}
                          disabled={index >= 2}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Item total */}
                      <div className="text-right ml-4">
                        <p className="font-medium">
                          {(item.price * item.quantity).toFixed(2)} ₪
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 text-sm mt-1 hover:text-red-400"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Size selection for each quantity */}
                  {item.sizes && item.sizes.length > 0 && item.quantity > 0 && (
                    <div className="mt-4 pl-4">
                      <p className="text-sm text-gray-400 mb-2">
                        Select size for each item:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {Array.from({ length: item.quantity }).map((_, idx) => (
                          <div key={idx} className="flex items-center">
                            <span className="text-sm text-gray-400 mr-2">
                              Item {idx + 1}:
                            </span>
                            <select
                              value={item.selectedSizes?.[idx] || item.sizes[0]}
                              onChange={(e) =>
                                updateItemSize(item.id, idx, e.target.value)
                              }
                              className={`bg-gray-800 text-white border border-gray-700 rounded px-2 py-1 text-sm ${
                                index >= 2
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={index >= 2}
                            >
                              {item.sizes.map((size) => (
                                <option key={size} value={size}>
                                  {size}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Cart total - only for the first 2 items */}
            <div className="bg-gray-900 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center py-2">
                <span className="text-lg">
                  Total ({Math.min(cartItems.length, 2)} items):
                </span>
                <span className="text-lg font-bold">
                  {totalAmount.toFixed(2)} ₪
                </span>
              </div>
              {hasExcessItems && (
                <p className="text-sm text-yellow-400 mt-2" dir="rtl">
                  ملاحظة: المجموع يشمل فقط أول عنصرين في سلة التسوق الخاصة بك.
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleCheckout}
                className="bg-white text-black py-3 px-6 rounded font-medium hover:bg-gray-200 transition-colors duration-300 flex-grow"
              >
                لاكمال الطلبيه اضغط هنا
              </button>
              <button
                onClick={clearCart}
                className="border border-white text-white py-3 px-6 rounded font-medium hover:bg-gray-900 transition-colors duration-300"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default CartPage;
