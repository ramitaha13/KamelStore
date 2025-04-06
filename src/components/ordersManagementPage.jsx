import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase"; // Import your Firestore instance
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/1.jpeg";

function OrdersManagementPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const navigate = useNavigate();

  // Fetch orders from Firestore
  useEffect(() => {
    setLoading(true);

    // Create a query against the OrdersStore collection
    const ordersQuery = query(
      collection(db, "OrdersStore"),
      orderBy("orderDate", "desc") // Show newest orders first
    );

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      ordersQuery,
      (querySnapshot) => {
        const ordersData = [];
        querySnapshot.forEach((doc) => {
          ordersData.push({
            id: doc.id,
            ...doc.data(),
            // Convert Firestore timestamp to JS Date if it exists
            orderDate: doc.data().orderDate
              ? doc.data().orderDate.toDate()
              : new Date(),
          });
        });

        setOrders(ordersData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching orders: ", error);
        setLoading(false);
      }
    );

    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, []);

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  // Get payment method display text
  const getPaymentMethodText = (paymentMethod) => {
    if (!paymentMethod) return "غير محدد";
    return paymentMethod === "cash" ? "نقدي" : "تحويل بنكي";
  };

  // View order details
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  // Close order details modal
  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  // Handle navigation back to admin page
  const handleGoBack = () => {
    navigate("/adminpage");
  };

  // Open delete confirmation modal
  const confirmDelete = (order) => {
    setDeleteConfirmation(order);
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  // Delete order from Firestore
  const deleteOrder = async (orderId) => {
    if (!orderId) return;

    try {
      setDeleting(true);
      await deleteDoc(doc(db, "OrdersStore", orderId));
      setDeleting(false);
      setDeleteConfirmation(null);

      // Close order details modal if the deleted order was being viewed
      if (selectedOrder && selectedOrder.id === orderId) {
        closeOrderDetails();
      }
    } catch (error) {
      console.error("Error deleting order: ", error);
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      {/* Header - Matching the AdminPage style */}
      <header className="bg-black text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img src={logoImage} alt="The Trendy Store" className="h-16" />
          </a>

          {/* Admin Panel Title */}
          <h1 className="text-xl font-bold">إدارة الطلبات</h1>

          {/* Back Button Only */}
          <div className="flex">
            <button
              onClick={handleGoBack}
              className="bg-gray-700 text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition-colors"
            >
              العودة
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Order Count Section */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">
              إجمالي الطلبات:{" "}
              <span className="font-bold text-black">{orders.length}</span>
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
            <p className="mr-2">جاري تحميل الطلبات...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-md">
            <p className="text-xl mb-2">لا توجد طلبات</p>
            <p className="text-gray-600">
              ستظهر الطلبات هنا عندما يضعها العملاء
            </p>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="px-6 py-3 text-right text-sm font-medium">
                      رقم الطلب
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-medium">
                      اسم العميل
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-medium">
                      التاريخ
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-medium">
                      المجموع
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-medium">
                      طريقة الدفع
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-medium">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-medium">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-mono">
                        {order.id.slice(0, 8)}...
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {order.customerInfo?.name || "غير متوفر"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {formatDate(order.orderDate)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {order.totalAmount?.toFixed(2) || 0} ₪
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {getPaymentMethodText(
                          order.customerInfo?.paymentMethod
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status === "completed"
                            ? "مكتملة"
                            : order.status === "processing"
                            ? "قيد المعالجة"
                            : "قيد الانتظار"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex space-x-4">
                          <button
                            onClick={() => confirmDelete(order)}
                            className="text-red-600 hover:text-red-800 transition-colors mr-4"
                          >
                            حذف
                          </button>
                          <button
                            onClick={() => viewOrderDetails(order)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            عرض التفاصيل
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">تفاصيل الطلب</h2>
                <button
                  onClick={closeOrderDetails}
                  className="text-gray-400 hover:text-black"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium mb-3 border-b border-gray-200 pb-2">
                    معلومات العميل
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-600">الاسم:</span>{" "}
                      {selectedOrder.customerInfo?.name}
                    </p>
                    <p>
                      <span className="text-gray-600">الهاتف:</span>{" "}
                      {selectedOrder.customerInfo?.phoneNumber}
                    </p>
                    <p>
                      <span className="text-gray-600">المدينة:</span>{" "}
                      {selectedOrder.customerInfo?.town}
                    </p>
                    <p>
                      <span className="text-gray-600">العنوان:</span>{" "}
                      {selectedOrder.customerInfo?.location}
                    </p>
                    {selectedOrder.customerInfo?.email && (
                      <p>
                        <span className="text-gray-600">
                          البريد الإلكتروني:
                        </span>{" "}
                        {selectedOrder.customerInfo.email}
                      </p>
                    )}
                    <p>
                      <span className="text-gray-600">طريقة الدفع:</span>{" "}
                      {getPaymentMethodText(
                        selectedOrder.customerInfo?.paymentMethod
                      )}
                    </p>
                    {selectedOrder.customerInfo?.notes && (
                      <p>
                        <span className="text-gray-600">ملاحظات:</span>{" "}
                        {selectedOrder.customerInfo.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium mb-3 border-b border-gray-200 pb-2">
                    ملخص الطلب
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-600">رقم الطلب:</span>{" "}
                      {selectedOrder.id}
                    </p>
                    <p>
                      <span className="text-gray-600">التاريخ:</span>{" "}
                      {formatDate(selectedOrder.orderDate)}
                    </p>
                    <p>
                      <span className="text-gray-600">الحالة:</span>{" "}
                      {selectedOrder.status === "completed"
                        ? "مكتملة"
                        : selectedOrder.status === "processing"
                        ? "قيد المعالجة"
                        : "قيد الانتظار"}
                    </p>
                    <p>
                      <span className="text-gray-600">المبلغ الإجمالي:</span>{" "}
                      {selectedOrder.totalAmount?.toFixed(2) || 0} ₪
                    </p>
                    <p>
                      <span className="text-gray-600">طريقة الدفع:</span>{" "}
                      <span
                        className={`font-medium ${
                          selectedOrder.customerInfo?.paymentMethod === "bank"
                            ? "text-blue-600"
                            : "text-green-600"
                        }`}
                      >
                        {getPaymentMethodText(
                          selectedOrder.customerInfo?.paymentMethod
                        )}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium mb-3 border-b border-gray-200 pb-2">
                  منتجات الطلب
                </h3>
                <div className="space-y-4">
                  {selectedOrder.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex space-x-4 border-b border-gray-200 pb-3"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/placeholder-product.jpg";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            لا توجد صورة
                          </div>
                        )}
                      </div>
                      <div className="flex-1 mr-4">
                        <h4 className="font-medium">{item.name}</h4>
                        <div className="text-sm text-gray-600">
                          <p>الكمية: {item.quantity}</p>
                          <p>السعر: {item.price?.toFixed(2) || 0} ₪</p>
                          {item.selectedSizes && (
                            <p>المقاسات: {item.selectedSizes.join(", ")}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right font-medium">
                        {(item.price * item.quantity).toFixed(2)} ₪
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-left font-bold text-lg">
                  المجموع: {selectedOrder.totalAmount?.toFixed(2) || 0} ₪
                </div>
              </div>

              <div className="mt-6 flex justify-start space-x-4">
                <button
                  onClick={closeOrderDetails}
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors ml-4"
                >
                  إغلاق
                </button>
                <button
                  onClick={() => confirmDelete(selectedOrder)}
                  className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
                >
                  حذف الطلب
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">تأكيد الحذف</h3>
            <p className="mb-6">
              هل أنت متأكد من أنك تريد حذف الطلب{" "}
              <span className="font-mono">
                {deleteConfirmation.id.slice(0, 8)}...
              </span>{" "}
              الخاص بـ {deleteConfirmation.customerInfo?.name}؟ لا يمكن التراجع
              عن هذا الإجراء.
            </p>
            <div className="flex justify-start space-x-4">
              <button
                onClick={() => deleteOrder(deleteConfirmation.id)}
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors flex items-center ml-4"
                disabled={deleting}
              >
                {deleting && (
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white ml-2"></span>
                )}
                {deleting ? "جاري الحذف..." : "حذف الطلب"}
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
                disabled={deleting}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersManagementPage;
