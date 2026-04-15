import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPaymentDashboard = () => {
  const [history, setHistory] = useState([]);
  const [newAmount, setNewAmount] = useState("");
  const [currentPrice, setCurrentPrice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const historyRes = await axios.get(
        "http://localhost:5007/api/payments/admin/history",
      );
      setHistory(historyRes.data);

      const priceRes = await axios.get(
        "http://localhost:5007/api/payments/admin/get-price",
      );
      setCurrentPrice(priceRes.data.amount);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setLoading(false);
    }
  };

  const handleUpdatePrice = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:5007/api/payments/admin/set-price", {
        newAmount: parseFloat(newAmount),
      });
      setCurrentPrice(newAmount);
      setNewAmount("");
      alert("Success: Global Fee Updated");
      fetchData();
    } catch (err) {
      alert("Failed to update price.");
    }
  };

  // --- NEW: Function to change payment status ---
  const handleStatusChange = async (paymentId, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:5007/api/payments/admin/payment/${paymentId}/status`,
        {
          status: newStatus,
        },
      );
      alert(`Status updated to ${newStatus}`);
      fetchData(); // Refresh list to show updated status
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Error updating status");
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-[#2C3E50] animate-pulse">
        Loading Dashboard...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-6 font-sans text-[#2C3E50]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 border-b-2 border-[#2ECC71] pb-2 inline-block">
          Payment Management
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#E0E0E0]">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#3498DB] mb-2">
              Current Consultation Fee
            </p>
            <h2 className="text-4xl font-bold text-[#27AE60]">
              {currentPrice !== null ? `${currentPrice}.00` : "0.00"}{" "}
              <span className="text-lg font-normal text-gray-500">LKR</span>
            </h2>
          </div>

          <div className="bg-[#E8F8F5] p-6 rounded-xl shadow-sm border border-[#2ECC71]/30">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#27AE60] mb-4">
              Update Global Fee
            </p>
            <form onSubmit={handleUpdatePrice} className="flex gap-3">
              <input
                type="number"
                placeholder="Amount (LKR)"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="flex-1 p-3 rounded-lg border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#2ECC71]"
                required
              />
              <button
                type="submit"
                className="bg-[#F39C12] hover:bg-[#e67e22] text-white px-6 py-3 rounded-lg font-bold transition-all shadow-md active:scale-95"
              >
                Set Price
              </button>
            </form>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#E0E0E0]">
          <div className="bg-[#2C3E50] p-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <span className="w-3 h-3 bg-[#F39C12] rounded-full"></span>
              Transaction History
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F7FA] border-b border-[#E0E0E0]">
                  <th className="p-4 font-bold text-[#2C3E50]">Date</th>
                  <th className="p-4 font-bold text-[#2C3E50]">Patient</th>
                  <th className="p-4 font-bold text-[#2C3E50]">
                    Appointment ID
                  </th>
                  <th className="p-4 font-bold text-[#2C3E50]">Amount</th>
                  <th className="p-4 font-bold text-[#2C3E50]">
                    Status Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.map((pay) => (
                  <tr
                    key={pay._id}
                    className="border-b border-[#F5F7FA] hover:bg-[#E8F8F5]/50 transition-colors"
                  >
                    <td className="p-4 text-sm">
                      {new Date(pay.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-medium">{pay.patientUsername}</td>
                    <td className="p-4 text-[#3498DB] font-mono">
                      {pay.appointmentId}
                    </td>
                    <td className="p-4 font-bold">Rs. {pay.amount}.00</td>
                    <td className="p-4">
                      {/* STATUS DROPDOWN */}
                      <select
                        value={pay.status}
                        onChange={(e) =>
                          handleStatusChange(pay._id, e.target.value)
                        }
                        className={`px-3 py-1 rounded-lg text-xs font-bold uppercase cursor-pointer border-none outline-none shadow-sm transition-all ${
                          pay.status === "SUCCESS"
                            ? "bg-[#2ECC71] text-white"
                            : pay.status === "FAILED"
                              ? "bg-red-500 text-white"
                              : "bg-[#F39C12] text-white"
                        }`}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="SUCCESS">Success</option>
                        <option value="FAILED">Failed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentDashboard;
