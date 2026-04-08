import React, { useState, useEffect } from "react";
import { ArrowLeft, Receipt, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const UserLedger = () => {
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        const res = await api.get("/api/billing/my-ledger");
        setLedger(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLedger();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-black text-white tracking-tight">Financial Ledger</h1>
          <p className="text-gray-400">View your detailed transaction history and dues.</p>
        </div>
      </header>

      <div className="glass-card rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-gray-500 animate-pulse">Loading transaction records...</div>
        ) : ledger.length === 0 ? (
          <div className="p-20 text-center text-gray-500 italic">No transactions found in your ledger.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-gray-400 text-[10px] uppercase font-black tracking-widest border-b border-white/10">
                  <th className="p-6">Date</th>
                  <th className="p-6">Description</th>
                  <th className="p-6">Type</th>
                  <th className="p-6">Amount</th>
                  <th className="p-6">Status</th>
                  <th className="p-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {ledger.map((item) => (
                  <tr key={item._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6 text-gray-400 font-medium">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-6">
                      <div className="text-white font-bold">{item.description || item.type}</div>
                      {item.notes && <div className="text-xs text-gray-500 mt-1">{item.notes}</div>}
                    </td>
                    <td className="p-6">
                      <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-gray-400 border border-white/10 group-hover:border-blue-500/20 transition-colors">
                        {item.type}
                      </span>
                    </td>
                    <td className="p-6 text-lg font-black text-white">
                      ₹{item.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="p-6">
                      <div className={`flex items-center gap-2 font-bold text-xs ${
                        item.status === 'Paid' ? 'text-emerald-400' : 
                        item.status === 'Overdue' ? 'text-rose-400' : 'text-amber-400'
                      }`}>
                        {item.status === 'Paid' ? <CheckCircle size={14} /> : <Clock size={14} />}
                        {item.status}
                      </div>
                    </td>
                    <td className="p-6">
                      {item.status === 'Paid' ? (
                        <button className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20 hover:bg-blue-500/20 transition-all opacity-0 group-hover:opacity-100">
                          <Receipt size={16} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => navigate('/dashboard')}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
                        >
                          Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserLedger;
