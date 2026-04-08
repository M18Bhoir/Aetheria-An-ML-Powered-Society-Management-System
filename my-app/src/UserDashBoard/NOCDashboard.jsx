import React, { useState, useEffect } from "react";
import { FileText, Plus, Clock, CheckCircle, XCircle, ChevronRight, User, Phone, ShieldCheck } from "lucide-react";
import api from "../utils/api";
import { useToast } from "../context/ToastContext";

const NOCDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: "Renovation",
    description: "",
    startDate: "",
    endDate: "",
    workers: [{ name: "", phone: "" }]
  });
  const { show } = useToast();

  const fetchRequests = async () => {
    try {
      const res = await api.get("/api/noc/my");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAddWorker = () => {
    setFormData({
      ...formData,
      workers: [...formData.workers, { name: "", phone: "" }]
    });
  };

  const handleWorkerChange = (index, field, value) => {
    const updatedWorkers = [...formData.workers];
    updatedWorkers[index][field] = value;
    setFormData({ ...formData, workers: updatedWorkers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/noc/request", formData);
      show("NOC Request submitted successfully!", "success");
      setShowForm(false);
      setFormData({
        type: "Renovation",
        description: "",
        startDate: "",
        endDate: "",
        workers: [{ name: "", phone: "" }]
      });
      fetchRequests();
    } catch (err) {
      show("Failed to submit request.", "error");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "Rejected": return "text-rose-400 bg-rose-400/10 border-rose-400/20";
      default: return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 pt-4">
        <div>
          <h1 className="text-5xl font-black tracking-tight text-white mb-2 uppercase">Digital NOC</h1>
          <p className="text-gray-400 font-medium tracking-wide">Manage Renovations, Move-ins, and Move-outs effortlessly.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2.5 px-8 py-4 rounded-3xl font-black transition-all shadow-xl shadow-blue-500/20 ${
            showForm ? "bg-white/10 text-white" : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105 active:scale-95"
          }`}
        >
          {showForm ? <XCircle size={24} /> : <Plus size={24} />}
          {showForm ? "Close Form" : "New NOC Request"}
        </button>
      </header>

      {showForm && (
        <form onSubmit={handleSubmit} className="p-10 glass-dark rounded-[48px] border border-blue-500/20 space-y-8 shadow-2xl animate-fade-in-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Request Type</label>
              <select
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-blue-500/50 [color-scheme:dark]"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="Renovation">Renovation / Civil Work</option>
                <option value="Move In">Moving In</option>
                <option value="Move Out">Moving Out</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Start Date</label>
                <input
                  type="date"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none [color-scheme:dark]"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-4">
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">End Date</label>
                <input
                  type="date"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none [color-scheme:dark]"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Description & Scope of Work</label>
            <textarea
              placeholder="e.g., Kitchen renovation and tiling work in Master Bedroom..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-blue-500/50 resize-none"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center px-1">
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">Worker / Team Details</label>
              <button type="button" onClick={handleAddWorker} className="text-blue-400 text-xs font-bold hover:text-blue-300 transition-colors flex items-center gap-1">
                <Plus size={14} /> Add Worker
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.workers.map((worker, idx) => (
                <div key={idx} className="flex gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <input
                    type="text"
                    placeholder="Worker Name"
                    className="flex-1 bg-transparent text-sm text-white focus:outline-none"
                    value={worker.name}
                    onChange={(e) => handleWorkerChange(idx, "name", e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    className="w-32 bg-transparent text-sm text-white focus:outline-none"
                    value={worker.phone}
                    onChange={(e) => handleWorkerChange(idx, "phone", e.target.value)}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all">
            Submit NOC Request
          </button>
        </form>
      )}

      <div className="space-y-6">
        <h2 className="text-xl font-black text-white uppercase tracking-widest px-2">Request History</h2>
        {loading ? (
          <div className="p-20 text-center text-gray-500 animate-pulse font-bold tracking-widest uppercase italic">Loading vault...</div>
        ) : requests.length === 0 ? (
          <div className="p-20 glass-card rounded-[48px] text-center text-gray-500 border border-white/5 italic">No NOC requests found. Submit one to begin.</div>
        ) : (
          requests.map((req) => (
            <div key={req._id} className="p-8 glass-dark rounded-[40px] border border-white/5 hover:border-white/10 transition-all shadow-xl group">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                  <div className={`p-5 rounded-3xl border flex items-center justify-center ${getStatusStyle(req.status)}`}>
                    <FileText size={32} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{req.type}</h3>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(req.status)}`}>
                        {req.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                       {new Date(req.startDate).toLocaleDateString()} — {new Date(req.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {req.status === "Approved" && req.workers?.length > 0 && (
                   <div className="flex flex-wrap gap-2">
                     {req.workers.map((w, i) => (
                        <div key={i} className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center gap-3 group/code">
                           <ShieldCheck size={16} className="text-blue-400" />
                           <div className="text-left">
                             <p className="text-[8px] font-black text-blue-400/50 uppercase tracking-widest leading-none mb-1">{w.name}</p>
                             <p className="text-sm font-black text-blue-300 tracking-widest">{w.code}</p>
                           </div>
                        </div>
                     ))}
                   </div>
                )}

                <div className="text-right">
                  <p className="text-xs text-gray-400 font-medium leading-relaxed italic max-w-xs">{req.description}</p>
                  {req.adminComments && (
                    <div className="mt-2 text-[10px] text-gray-500 bg-white/5 p-2 rounded-xl border border-white/5">
                      <span className="font-black text-gray-400 uppercase">Commitee: </span> {req.adminComments}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NOCDashboard;
