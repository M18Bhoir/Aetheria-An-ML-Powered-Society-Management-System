import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { 
  ShieldCheck, 
  Zap, 
  Users, 
  BarChart3, 
  Bell, 
  Smartphone,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// --- Animations ---
const fadeIn = (delay = 0, direction = "up") => ({
  hidden: { 
    opacity: 0, 
    y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
    x: direction === "left" ? 40 : direction === "right" ? -40 : 0
  },
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: { duration: 0.8, delay, ease: "easeOut" },
  },
});

// --- Feature Item ---
const FeatureItem = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    variants={fadeIn(delay)}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/30 transition-all duration-500"
  >
    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
      <Icon className="text-blue-400" size={24} />
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed font-light">{description}</p>
  </motion.div>
);

// --- Reusable Glass Card ---
const Card = ({ title, description, delay = 0.2 }) => (
  <motion.div
    variants={fadeIn(delay)}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    // Glassmorphism Styles
    className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2rem] shadow-xl hover:shadow-blue-500/5 hover:-translate-y-2 transition-all duration-500 text-left group"
  >
    <div className="h-1 w-12 bg-blue-500/50 rounded-full mb-6 group-hover:w-20 transition-all duration-500"></div>
    <h2 className="text-xl font-bold mb-3 text-white">{title}</h2>
    <p className="text-gray-400 font-light leading-relaxed">
      {description}
    </p>
  </motion.div>
);

// --- Header ---
const Header = ({ isDarkMode, toggleTheme }) => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-6 left-0 right-0 mx-auto w-[90%] max-w-7xl z-50 rounded-3xl bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl px-8 py-4 flex justify-between items-center transition-all">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg shadow-blue-500/20"></div>
        <h1 className="text-2xl font-black text-white tracking-tighter">
          AETHERIA
        </h1>
      </div>
      <nav className="flex items-center space-x-6">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition duration-300"
        >
          {isDarkMode ? "🌞" : "🌙"}
        </button>
        <button
          className="text-gray-400 hover:text-white transition duration-300 font-bold text-sm uppercase tracking-widest"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button
          className="py-3 px-8 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-500/20 transition duration-300 font-black text-xs uppercase tracking-[0.2em]"
          onClick={() => navigate("/signup")}
        >
          Get Started
        </button>
      </nav>
    </header>
  );
};

// --- Main Content ---
const Main = () => {
  const navigate = useNavigate();
  return (
    <main className="pt-32 relative overflow-hidden">
      {/* Background blobs for glass effect */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Hero Section */}
      <section className="flex flex-col justify-center items-center text-center pb-32 px-8 w-full relative z-10">
        <motion.div
          variants={fadeIn(0.1)}
          initial="hidden"
          animate="show"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em]">Next-Gen Living Experience</span>
        </motion.div>
        
        <motion.h1
          variants={fadeIn(0.2)}
          initial="hidden"
          animate="show"
          className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]"
        >
          Welcome to your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            Better Neighborhood.
          </span>
        </motion.h1>

        <motion.p
          variants={fadeIn(0.3)}
          initial="hidden"
          animate="show"
          className="text-gray-400 leading-relaxed text-lg md:text-xl max-w-2xl mx-auto font-medium mb-12"
        >
          We believe community living should be simple, safe, and stress-free. 
          Aetheria helps you connect with neighbors, manage dues effortlessly, and get help when you need it.
        </motion.p>

        <motion.div
          variants={fadeIn(0.4)}
          initial="hidden"
          animate="show"
          className="flex flex-col sm:flex-row gap-6"
        >
          <button 
            onClick={() => navigate("/signup")}
            className="group px-10 py-5 bg-white text-black font-black text-sm uppercase tracking-widest rounded-3xl hover:bg-blue-500 hover:text-white transition-all duration-500 flex items-center gap-3"
          >
            Start For Free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black text-sm uppercase tracking-widest rounded-3xl hover:bg-white/10 transition-all duration-500">
            Watch Demo
          </button>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-8 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Active Societies", value: "500+" },
            { label: "Happy Residents", value: "10k+" },
            { label: "Issues Resolved", value: "98%" },
            { label: "Efficiency Boost", value: "40%" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeIn(0.1 * i)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-center"
            >
              <h4 className="text-4xl md:text-5xl font-black text-white mb-2">{stat.value}</h4>
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Challenge Section (Bento Grid) */}
      <section className="py-32 px-8 w-full relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeIn(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-[10px] uppercase text-blue-400 font-black tracking-[0.4em] mb-4">
              The Problem
            </h2>
            <h1 className="text-5xl font-black text-white tracking-tight">Outdated Management.</h1>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 w-full">
            <Card
              title="Paperwork Headaches"
              description="Tired of tracking down receipts and keeping ledgers? We automate the boring stuff so you don't have to."
              delay={0.1}
            />
            <Card
              title="Missed Updates"
              description="No more scrolling through endless WhatsApp groups to find out when the water will be back on."
              delay={0.2}
            />
            <Card
              title="Maintenance Delays"
              description="Reporting a broken elevator shouldn't feel like sending a message in a bottle. Get instant tracking on all your requests."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-8 bg-white/[0.02] relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-[10px] uppercase text-blue-400 font-black tracking-[0.4em] mb-4 text-left">
                Powerful Features
              </h2>
              <h1 className="text-5xl font-black text-white tracking-tight text-left leading-tight">
                Everything you need to <br /> run your society.
              </h1>
            </div>
            <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
              Explore All Features
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureItem 
              icon={ShieldCheck}
              title="Peace of Mind"
              description="Know exactly who is at the gate before they even ring your doorbell with our digital guest passes."
              delay={0.1}
            />
            <FeatureItem 
              icon={BarChart3}
              title="Clear Finances"
              description="Easily view your maintenance dues, pay online in seconds, and see exactly where the community funds go."
              delay={0.2}
            />
            <FeatureItem 
              icon={Zap}
              title="Quick Fixes"
              description="Report an issue directly from your phone and our system will notify the right technician instantly."
              delay={0.3}
            />
            <FeatureItem 
              icon={Users}
              title="Say Hello"
              description="Connect with neighbors, buy/sell items in the marketplace, and vote on community decisions."
              delay={0.4}
            />
            <FeatureItem 
              icon={Bell}
              title="Stay in the Loop"
              description="Get polite, timely notifications about important community events right to your pocket."
              delay={0.5}
            />
            <FeatureItem 
              icon={Smartphone}
              title="Everything in One Place"
              description="Your entire neighborhood, neatly organized into one friendly, easy-to-use app."
              delay={0.6}
            />
          </div>
        </div>
      </section>


      {/* Solution Section */}
      <section className="py-32 px-8 w-full relative z-10">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[4rem] p-12 md:p-24 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all duration-700"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
            <h5 className="text-[10px] uppercase text-blue-200 font-black tracking-[0.4em] mb-6">
              Our Promise
            </h5>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-none">
              A happier place to call home.
            </h2>
            <p className="text-blue-100/80 text-lg mb-12 font-medium leading-relaxed">
              We're building more than just an app. We're building stronger, friendlier, 
              and more connected communities where everyone feels like they belong.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center w-full">
              <button 
                onClick={() => navigate("/signup")}
                className="px-10 py-5 bg-white text-blue-600 font-black text-sm uppercase tracking-widest rounded-3xl hover:scale-105 transition-all duration-300"
              >
                Join Aetheria Today
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};


// --- Footer ---
const Footer = () => (
  <footer className="bg-black/30 backdrop-blur-md border-t border-white/10 py-8 px-8 text-center text-gray-400 mt-20">
    <p>© {new Date().getFullYear()} Aetheria. All rights reserved.</p>
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
    <div className="font-sans text-gray-100 min-h-screen w-full transition-colors duration-300">
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <Main />
      <Footer />
    </div>
  );
};

export default LandingPage;
