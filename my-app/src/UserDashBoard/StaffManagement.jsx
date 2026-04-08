import React, { useState, useEffect } from "react";
import { UserPlus, UserCheck, Shield, Clock, Phone, Trash2, ArrowRight } from "lucide-react";
import api from "../utils/api";
import { useToast } from "../context/ToastContext";

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: "", phone: "", type: "Maid" });
  const { show } = useToast();

  const fetchStaff = async () => {
    try {
      const res = await api.get("/api/staff/my-staff");
      setStaff(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/staff/register", newStaff);
      show("Staff registered successfully! Pending approval.", "success");
      setNewStaff({ name: "", phone: "", type: "Maid" });
      setShowAdd(false);
      fetchStaff();
    } catch (err) {
      show("Failed to register staff.", "error");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "Revoked": return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      default: return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 pt-4">
        <div>
          <h1 className="text-5xl font-black tracking-tight text-white mb-2">Domestic Staff</h1>
          <p className="text-gray-400 font-medium tracking-wide">Register and track entry/exit of your domestic workers. <Shield size={14} className="inline ml-1 text-blue-400" /></p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/20 ${
            showAdd ? "bg-white/10 text-white" : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105 active:scale-95"
          }`}
        >
          <UserPlus size={20} />
          {showAdd ? "Cancel" : "Add Staff"}
        </button>
      </header>

      {showAdd && (
        <form onSubmit={handleAdd} className="p-8 glass-dark rounded-[32px] border border-blue-500/20 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-2xl animate-fade-in-up">
          <input
            type="text"
            placeholder="Staff Full Name"
            className="bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none"
            value={newStaff.name}
            onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none"
            value={newStaff.phone}
            onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
            required
          />
          <select
            className="bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none [color-scheme:dark]"
            value={newStaff.type}
            onChange={(e) => setNewStaff({ ...newStaff, type: e.target.value })}
          >
            <option value="Maid">Maid</option>
            <option value="Cook">Cook</option>
            <option value="Driver">Driver</option>
            <option value="Security">Security</option>
            <option value="Other">Other</option>
          </select>
          <button type="submit" className="md:col-span-3 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg">
            Register & Request Approval
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center p-20 text-gray-500 animate-pulse">Fetching staff records...</div>
        ) : staff.length === 0 ? (
          <div className="col-span-full text-center p-20 glass-card rounded-[32px] text-gray-500 italic border border-white/5">No domestic staff registered. Add one to get started.</div>
        ) : (
          staff.map((s) => (
            <div key={s._id} className="p-8 glass-dark rounded-[32px] border border-white/5 hover:border-white/10 transition-all shadow-xl relative group">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all">
                  <UserCheck className="text-blue-400" size={24} />
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(s.status)}`}>
                  {s.status}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{s.name}</h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-1">
                {s.type} · <Phone size={10} /> {s.phone}
              </p>

              <div className="space-y-3 bg-white/5 rounded-2xl p-4 border border-white/5 group-hover:border-white/10 transition-colors">
                <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  <span>Entry/Exit Logs</span>
                  <span>Today</span>
                </div>
                {s.entryStats?.length > 0 ? (
                  s.entryStats.slice(-2).map((log, i) => (
                    <div key={i} className="flex justify-between text-xs font-medium text-gray-300">
                      <span className="flex items-center gap-1"><Clock size={12} className="text-blue-400" /> {new Date(log.enteredAt).toLocaleTimeString()}</span>
                      {log.exitedAt ? <span className="text-emerald-400">{new Date(log.exitedAt).toLocaleTimeString()}</span> : <span className="text-amber-400 animate-pulse">Inside</span>}
                    </div>
                  ))
                ) : (
                  <div className="text-[10px] text-gray-600 italic">No entry logs reported today.</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StaffManagement;
