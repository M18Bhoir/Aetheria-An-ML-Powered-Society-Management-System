// LandingPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  Zap,
  Users,
  Smartphone,
  PieChart,
  Lock,
  ArrowRight,
  CheckCircle2,
  Building2,
  Calendar,
  MessageSquare,
} from "lucide-react";
import building_icon from "../Assets/building.png";
import frontendImage from "../Assets/frontend1.png";

// --- Animations ---
const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: "easeOut" },
  },
});

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// --- Reusable Glass Card ---
const Card = ({ title, description, icon: Icon }) => (
  <motion.div
    variants={fadeIn()}
    className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl transition-all duration-300 hover:bg-white/10 hover:border-blue-500/30 group"
  >
    {Icon && (
      <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <Icon className="text-blue-400" size={24} />
      </div>
    )}
    <h2 className="text-xl font-black mb-3 text-white uppercase tracking-tight">
      {title}
    </h2>
    <p className="text-slate-400 font-medium leading-relaxed text-sm">
      {description}
    </p>
  </motion.div>
);

// --- Header ---
const Header = ({ isDarkMode, toggleTheme }) => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 px-8 md:px-16 py-8 flex justify-between items-center transition-all">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Building2 size={18} className="text-white" />
        </div>
        <h1 className="text-2xl font-black text-white tracking-tighter uppercase">
          Aetheria
        </h1>
      </div>
      <nav className="hidden md:flex items-center space-x-12">
        {["Features", "About", "Contact"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-sm font-bold text-slate-400 hover:text-white transition-all uppercase tracking-[0.2em] hover:scale-105 active:scale-95"
          >
            {item}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-6">
        <button
          onClick={toggleTheme}
          className="text-white hover:text-blue-400 transition-colors"
        >
          {isDarkMode ? "🌞" : "🌙"}
        </button>
        <button
          className="text-white font-black uppercase tracking-widest text-[10px] hover:text-blue-400 transition-colors"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button
          className="py-3 px-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-blue-500/20 transition-all active:scale-95"
          onClick={() => navigate("/signup")}
        >
          Join Now
        </button>
      </div>
    </header>
  );
};

// --- Main Content ---
const Main = () => {
  return (
    <main className="relative">
      {/* Hero Section */}
      <section className="min-h-screen pt-48 pb-24 px-8 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px] animate-pulse"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            variants={fadeIn(0.1)}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full mb-8"
          ></motion.div>

          <motion.h1
            variants={fadeIn(0.2)}
            initial="hidden"
            animate="show"
            className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.9]"
          >
            Community Living <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">
              Redefined.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeIn(0.3)}
            initial="hidden"
            animate="show"
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed mb-12"
          >
            An intelligent, machine learning-driven ecosystem that works to make
            residential life easier, encourage openness, and build a strong
            sense of community.
          </motion.p>

          <motion.div
            variants={fadeIn(0.4)}
            initial="hidden"
            animate="show"
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button className="w-full sm:w-auto px-10 py-5 bg-white text-black font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-3 group">
              Get Started{" "}
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-white/10 transition-all">
              Watch Demo
            </button>
          </motion.div>
        </div>
      </section>

      {/* Feature Showcase (New Section with Images) */}
      <section id="features" className="py-32 px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-4">
              Core Ecosystem
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">
              Empowering Every Stakeholder
            </h3>
          </div>

          <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
            <motion.div
              variants={fadeIn(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-[3rem] blur-2xl opacity-20"></div>
              <img
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80"
                alt="Luxury Living"
                className="rounded-[2.5rem] shadow-2xl relative z-10 border border-white/10"
              />
              <div className="absolute bottom-8 left-8 right-8 bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl z-20">
                <p className="text-white font-black uppercase tracking-widest text-xs mb-1">
                  Residential Excellence
                </p>
                <p className="text-slate-400 text-xs font-medium">
                  Smart automation for a seamless living experience.
                </p>
              </div>
            </motion.div>

            <div className="space-y-12">
              <div className="flex gap-6">
                <div className="shrink-0 w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                  <Shield className="text-blue-400" size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                    Smart Security
                  </h4>
                  <p className="text-slate-400 font-medium leading-relaxed">
                    Advanced visitor management and real-time alerts ensure your
                    community's safety is never compromised.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="shrink-0 w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20">
                  <PieChart className="text-purple-400" size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                    Financial Transparency
                  </h4>
                  <p className="text-slate-400 font-medium leading-relaxed">
                    Automated billing, ledger tracking, and instant payment
                    receipts bring ultimate clarity to society finances.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="shrink-0 w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                  <MessageSquare className="text-emerald-400" size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                    Community Engagement
                  </h4>
                  <p className="text-slate-400 font-medium leading-relaxed">
                    Digital voting, notice boards, and community forums keep
                    everyone connected and heard.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-20 items-center flex-row-reverse">
            <div className="order-2 lg:order-1 space-y-12">
              <div className="flex gap-6">
                <div className="shrink-0 w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20">
                  <Calendar className="text-amber-400" size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                    Amenity Management
                  </h4>
                  <p className="text-slate-400 font-medium leading-relaxed">
                    Effortless booking for clubhouse, pool, and courts with
                    real-time availability and conflict resolution.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="shrink-0 w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center border border-rose-500/20">
                  <Zap className="text-rose-400" size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                    Predictive Maintenance
                  </h4>
                  <p className="text-slate-400 font-medium leading-relaxed">
                    AI-powered insights to predict equipment failure and
                    schedule maintenance before issues arise.
                  </p>
                </div>
              </div>
            </div>

            <motion.div
              variants={fadeIn(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="relative order-1 lg:order-2"
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-amber-600 to-rose-600 rounded-[3rem] blur-2xl opacity-20"></div>
              <img
                src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=80"
                alt="Community Life"
                className="rounded-[2.5rem] shadow-2xl relative z-10 border border-white/10"
              />
              <div className="absolute top-8 right-8 bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl z-20">
                <p className="text-white font-black uppercase tracking-widest text-xs mb-1">
                  Vibrant Spaces
                </p>
                <p className="text-slate-400 text-xs font-medium">
                  Fostering connections in every corner.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-8 relative z-10 bg-blue-600/5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <p className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">
              500+
            </p>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Societies Managed
            </p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">
              10k+
            </p>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Active Residents
            </p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">
              99.9%
            </p>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              System Uptime
            </p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">
              24/7
            </p>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Support Node
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-8 relative z-10 overflow-hidden">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-blue-600/20">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <Building2 size={400} className="absolute -top-20 -left-20" />
          </div>
          <h3 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter uppercase relative z-10">
            Ready to transform your society?
          </h3>
          <p className="text-blue-100 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto relative z-10">
            Join the elite communities already using Aetheria to power their
            daily operations.
          </p>
          <button className="relative z-10 px-12 py-6 bg-white text-blue-600 font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-slate-100 transition-all shadow-xl active:scale-95">
            Start Free Trial
          </button>
        </div>
      </section>
    </main>
  );
};

// --- Footer ---
const Footer = () => (
  <footer className="bg-black py-16 px-8 border-t border-white/5 relative z-10">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Building2 size={18} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tighter uppercase">
            Aetheria
          </h1>
        </div>
        <p className="text-slate-500 font-medium max-w-sm leading-relaxed">
          The world's most advanced community management platform, built for the
          future of urban living.
        </p>
      </div>
      <div>
        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">
          Product
        </h4>
        <ul className="space-y-4 text-sm font-bold text-slate-500">
          <li>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Features
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Pricing
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Security
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">
          Company
        </h4>
        <ul className="space-y-4 text-sm font-bold text-slate-500">
          <li>
            <a href="#" className="hover:text-blue-400 transition-colors">
              About Us
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Contact
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Privacy
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
      <p className="text-xs font-black uppercase tracking-widest text-slate-600">
        © {new Date().getFullYear()} Aetheria Ecosystem. All rights reserved.
      </p>
      <div className="flex gap-8 text-slate-600">
        {/* Social Icons Placeholder */}
      </div>
    </div>
  </footer>
);

// --- Landing Page (Wrapper) ---
const LandingPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <div className="font-sans text-gray-100 min-h-screen w-full transition-colors duration-300 bg-[#020617] selection:bg-blue-500/30">
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <Main />
      <Footer />
    </div>
  );
};

export default LandingPage;
