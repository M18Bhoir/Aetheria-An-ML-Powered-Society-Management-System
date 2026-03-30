import React, { useEffect, useMemo, useRef, useState } from "react";
import { Users, Phone, Search, Mail, ArrowLeft } from "lucide-react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function ResidentsDirectory() {
  const [residents, setResidents] = useState([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const debounceRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/api/user/residents");
        setResidents(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, 250);
    return () => debounceRef.current && clearTimeout(debounceRef.current);
  }, [query]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    if (!q) return residents;
    return residents.filter((r) => {
      return (
        r.name?.toLowerCase().includes(q) ||
        r.userId?.toLowerCase().includes(q) ||
        r.phone?.toLowerCase().includes(q)
      );
    });
  }, [residents, debouncedQuery]);

  return (
    <div className="max-w-5xl mx-auto p-4 animate-fade-in-up">
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Dashboard
      </button>
      <div className="flex items-center gap-3 mb-4">
        <Users className="text-blue-400" />
        <h1 className="text-2xl font-bold text-white">Society Community</h1>
      </div>
      <p className="text-gray-400 text-sm mb-6">
        Directory of resident contacts for easy communication.
      </p>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, flat ID, or phone"
          aria-label="Search residents by name, flat ID, or phone"
          className="w-full pl-11 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
        />
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {loading ? (
          <div className="grid grid-cols-1 divide-y divide-white/5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4">
                <div className="h-4 w-1/3 bg-white/10 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-1/5 bg-white/10 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No matches found.
          </div>
        ) : (
          <>
            <ul className="divide-y divide-white/5">
              {filtered.slice(0, 50).map((r) => (
                <li
                  key={r._id || r.userId}
                  className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <div>
                    <p className="text-white font-semibold">{r.name}</p>
                    <p className="text-gray-400 text-xs">{r.userId}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    {r.phone && (
                      <a
                        href={`tel:${r.phone}`}
                        className="flex items-center gap-1 text-gray-300 hover:text-white"
                        title="Call"
                      >
                        <Phone size={16} /> {r.phone}
                      </a>
                    )}
                    {r.email && (
                      <a
                        href={`mailto:${r.email}`}
                        className="flex items-center gap-1 text-gray-300 hover:text-white"
                        title="Email"
                      >
                        <Mail size={16} /> {r.email}
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            {filtered.length > 50 && (
              <div className="p-4 text-center">
                <span className="text-xs text-gray-500">
                  Showing first 50 results. Refine your search to see more.
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
