import React, { useState, useEffect } from "react";
import { Check, X, Eye, FileText, Calendar, User, Phone, MapPin, Search } from "lucide-react";
import api from "../../utils/api";
import { useToast } from "../../context/ToastContext";

const AdminNOCManager = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Pending");
  const [selectedReq, setSelectedReq] = useState(null);
  const [comment, setComment] = useState("");
  const { show } = useToast();

  const fetchRequests = async () => {
    try {
      const res = await api.get("/api/noc/admin/all");
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

  const handleResponse = async (id, status) => {
    try {
      await api.patch(`/api/noc/admin/${id}/respond`, { status, adminComments: comment });
      show(`NOC Request ${status} successfully!`, "success");
      setSelectedReq(null);
      setComment("");
      fetchRequests();
    } catch (err) {
      show("Failed to update NOC status.", "error");
    }
  };

  const filteredRequests = requests.filter(r => r.status === filter || filter === "All");

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10 animate-fade-in-up">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 pt-4">
        <div>
          <h1 className="text-5xl font-black tracking-tight text-white mb-2 uppercase">Workflow Management</h1>
          <p className="text-gray-400 font-medium tracking-wide">Review and approve Society No-Objection Certificates (NOCs).</p>
        </div>
        <div className="flex bg-white/5 p-2 rounded-[24px] border border-white/5">
          {["Pending", "Approved", "Rejected", "All"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-[18px] text-xs font-black uppercase tracking-widest transition-all ${
                filter === f ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="p-20 text-center text-gray-500 animate-pulse font-black uppercase tracking-widest">Fetching applications...</div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-20 glass-card rounded-[48px] text-center text-gray-500 border border-white/5 italic">No requests found for the selected filter.</div>
        ) : (
          filteredRequests.map((req) => (
            <div key={req._id} className="p-10 glass-dark rounded-[48px] border border-white/5 hover:border-blue-500/10 transition-all shadow-xl group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
               
               <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 relative z-10">
                 <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-white/5 rounded-[24px] border border-white/10 text-blue-400">
                        <FileText size={32} />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{req.type}</h3>
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <MapPin size={10} className="text-blue-500" /> Flat {req.resident?.flat} · {req.resident?.name}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed font-bold tracking-tight italic">"{req.description}"</p>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-300">
                      <Calendar size={20} className="text-blue-400" />
                      <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Duration Period</p>
                        <p className="font-bold text-sm tracking-tight">{new Date(req.startDate).toLocaleDateString()} — {new Date(req.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <User size={20} className="text-indigo-400" />
                      <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Worker Team Size</p>
                        <p className="font-bold text-sm tracking-tight">{req.workers?.length || 0} Registered Workers</p>
                      </div>
                    </div>
                 </div>

                 <div className="flex flex-col justify-center gap-4">
                    {req.status === "Pending" ? (
                      <div className="flex flex-col gap-3">
                        <textarea
                          placeholder="Committee Comments..."
                          className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
                          rows="2"
                          value={selectedReq === req._id ? comment : ""}
                          onChange={(e) => {
                            setSelectedReq(req._id);
                            setComment(e.target.value);
                          }}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleResponse(req._id, "Approved")}
                            className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                          >
                            <Check size={16} /> Approve
                          </button>
                          <button
                            onClick={() => handleResponse(req._id, "Rejected")}
                            className="py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                          >
                            <X size={16} /> Reject
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-6 bg-white/5 rounded-[32px] border border-white/5">
                        <span className={`text-[12px] font-black uppercase tracking-[0.2em] ${req.status === "Approved" ? "text-emerald-400" : "text-rose-400"}`}>
                          {req.status}
                        </span>
                        {req.adminComments && (
                          <p className="text-[10px] text-gray-500 mt-2 font-medium italic">"{req.adminComments}"</p>
                        )}
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

export default AdminNOCManager;
