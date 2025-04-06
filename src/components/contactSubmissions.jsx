import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/1.jpeg";

function ContactSubmissions() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const contactsQuery = query(
        collection(db, "contactUs"),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(contactsQuery);

      const contactsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp:
          doc.data().timestamp?.toDate()?.toLocaleString() || "No date",
      }));

      setContacts(contactsData);
    } catch (error) {
      console.error("Error fetching contacts: ", error);
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (id, newStatus) => {
    try {
      const contactRef = doc(db, "contactUs", id);
      await updateDoc(contactRef, {
        status: newStatus,
      });

      // Update local state
      setContacts(
        contacts.map((contact) =>
          contact.id === id ? { ...contact, status: newStatus } : contact
        )
      );
    } catch (error) {
      console.error("Error updating contact status: ", error);
    }
  };

  const deleteContact = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this contact submission?")
    ) {
      try {
        await deleteDoc(doc(db, "contactUs", id));
        setContacts(contacts.filter((contact) => contact.id !== id));
      } catch (error) {
        console.error("Error deleting contact: ", error);
      }
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredContacts =
    statusFilter === "all"
      ? contacts
      : contacts.filter((contact) => contact.status === statusFilter);

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleGoBack = () => {
    navigate("/adminpage");
  };

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      {/* Header - Matching the OrdersManagementPage style */}
      <header className="bg-black text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img src={logoImage} alt="The Trendy Store" className="h-16" />
          </a>

          {/* Admin Panel Title */}
          <h1 className="text-xl font-bold">إدارة الاستفسارات</h1>

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

      <div className="container mx-auto px-4 py-8">
        {/* Contact Count Section */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">
              إجمالي الاستفسارات:{" "}
              <span className="font-bold text-black">{contacts.length}</span>
            </h2>
            <div className="flex items-center">
              <span className="ml-2 text-sm text-gray-700">تصفية:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
              >
                <option value="all">الكل</option>
                <option value="new">جديد</option>
                <option value="in-progress">قيد المعالجة</option>
                <option value="resolved">تم الرد</option>
              </select>
              <button
                onClick={fetchContacts}
                className="mr-4 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
              >
                تحديث
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
            <p className="mr-2">جاري تحميل الاستفسارات...</p>
          </div>
        ) : (
          <>
            {filteredContacts.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-lg shadow-md">
                <p className="text-xl mb-2">لا توجد استفسارات</p>
                <p className="text-gray-600">
                  ستظهر الاستفسارات هنا عندما يرسلها العملاء
                </p>
              </div>
            ) : (
              <>
                {/* Mobile view - Card layout */}
                <div className="md:hidden space-y-4">
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="bg-white shadow rounded-lg overflow-hidden"
                    >
                      <div className="p-4 border-b">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {contact.name || "غير متوفر"}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {contact.email}
                            </p>
                            {contact.phone && (
                              <p className="text-sm text-gray-600">
                                {contact.phone}
                              </p>
                            )}
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              contact.status
                            )}`}
                          >
                            {contact.status === "new"
                              ? "جديد"
                              : contact.status === "in-progress"
                              ? "قيد المعالجة"
                              : "تم الرد"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {contact.timestamp}
                        </p>
                      </div>

                      <div
                        className="px-4 py-3 border-b cursor-pointer bg-gray-50 hover:bg-gray-100"
                        onClick={() => toggleExpand(contact.id)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-indigo-600">
                            {expandedId === contact.id
                              ? "إخفاء التفاصيل"
                              : "عرض التفاصيل"}
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 transition-transform ${
                              expandedId === contact.id
                                ? "transform rotate-180"
                                : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>

                      {expandedId === contact.id && (
                        <div className="p-4 bg-gray-50">
                          <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-900 mb-1">
                              الرسالة:
                            </h3>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                              {contact.comment || "لا توجد رسالة"}
                            </p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-2">
                              تحديث الحالة:
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() =>
                                  updateContactStatus(contact.id, "new")
                                }
                                className={`px-3 py-1 text-xs rounded-md ${
                                  contact.status === "new"
                                    ? "bg-blue-600 text-white"
                                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                }`}
                              >
                                جديد
                              </button>
                              <button
                                onClick={() =>
                                  updateContactStatus(contact.id, "in-progress")
                                }
                                className={`px-3 py-1 text-xs rounded-md ${
                                  contact.status === "in-progress"
                                    ? "bg-yellow-600 text-white"
                                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                }`}
                              >
                                قيد المعالجة
                              </button>
                              <button
                                onClick={() =>
                                  updateContactStatus(contact.id, "resolved")
                                }
                                className={`px-3 py-1 text-xs rounded-md ${
                                  contact.status === "resolved"
                                    ? "bg-green-600 text-white"
                                    : "bg-green-100 text-green-800 hover:bg-green-200"
                                }`}
                              >
                                تم الرد
                              </button>
                            </div>
                          </div>
                          <div className="mt-4 pt-3 border-t border-gray-200">
                            <button
                              onClick={() => deleteContact(contact.id)}
                              className="px-3 py-1 bg-red-100 text-red-800 hover:bg-red-200 rounded text-xs"
                            >
                              حذف
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Desktop view - Table layout */}
                <div className="hidden md:block bg-white shadow rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-200">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider"
                        >
                          الاسم
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider"
                        >
                          البريد الإلكتروني
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider"
                        >
                          الهاتف
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider"
                        >
                          التاريخ
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider"
                        >
                          الحالة
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                        >
                          الإجراءات
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredContacts.map((contact) => (
                        <React.Fragment key={contact.id}>
                          <tr
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => toggleExpand(contact.id)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {contact.name || "غير متوفر"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {contact.email || "غير متوفر"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {contact.phone || "غير متوفر"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {contact.timestamp}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                  contact.status
                                )}`}
                              >
                                {contact.status === "new"
                                  ? "جديد"
                                  : contact.status === "in-progress"
                                  ? "قيد المعالجة"
                                  : "تم الرد"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteContact(contact.id);
                                }}
                                className="text-red-600 hover:text-red-900 ml-3"
                              >
                                حذف
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleExpand(contact.id);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                {expandedId === contact.id ? "إخفاء" : "عرض"}
                              </button>
                            </td>
                          </tr>
                          {expandedId === contact.id && (
                            <tr className="bg-gray-50">
                              <td colSpan="6" className="px-6 py-4">
                                <div className="flex flex-col">
                                  <div className="mb-4">
                                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                                      الرسالة:
                                    </h3>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                      {contact.comment || "لا توجد رسالة"}
                                    </p>
                                  </div>
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                                      تحديث الحالة:
                                    </h3>
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updateContactStatus(
                                            contact.id,
                                            "resolved"
                                          );
                                        }}
                                        className={`px-3 py-1 text-xs rounded-md ${
                                          contact.status === "resolved"
                                            ? "bg-green-600 text-white"
                                            : "bg-green-100 text-green-800 hover:bg-green-200"
                                        }`}
                                      >
                                        تم الرد
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updateContactStatus(
                                            contact.id,
                                            "in-progress"
                                          );
                                        }}
                                        className={`px-3 py-1 text-xs rounded-md ${
                                          contact.status === "in-progress"
                                            ? "bg-yellow-600 text-white"
                                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                        }`}
                                      >
                                        قيد المعالجة
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updateContactStatus(
                                            contact.id,
                                            "new"
                                          );
                                        }}
                                        className={`px-3 py-1 text-xs rounded-md ${
                                          contact.status === "new"
                                            ? "bg-blue-600 text-white"
                                            : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                        }`}
                                      >
                                        جديد
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ContactSubmissions;
