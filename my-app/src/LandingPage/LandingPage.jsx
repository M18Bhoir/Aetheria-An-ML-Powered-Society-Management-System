// LandingPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import building_icon from "../Assets/building.png";
import frontendImage from "../Assets/frontend1.png";

// --- Animations ---
const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay },
  },
});

// --- Reusable Glass Card ---
const Card = ({ title, description }) => (
  <motion.div
    variants={fadeIn(0.2)}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    // Glassmorphism Styles
    className="bg-white/10 dark:bg-black/40 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 text-left"
  >
    <h2 className="text-xl font-bold mb-3 text-white">{title}</h2>
    <p className="text-gray-200 dark:text-gray-300 font-light leading-relaxed">
      {description}
    </p>
  </motion.div>
);

// --- Header ---
const Header = ({ isDarkMode, toggleTheme }) => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-4 left-0 right-0 mx-auto w-[95%] max-w-7xl z-50 rounded-2xl bg-white/10 dark:bg-black/40 backdrop-blur-lg border border-white/20 shadow-lg px-8 py-4 flex justify-between items-center transition-all">
      <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        Aetheria
      </h1>
      <nav className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-white hover:bg-white/10 transition duration-300"
        >
          {isDarkMode ? "🌞" : "🌙"}
        </button>
        <button
          className="py-2 px-6 rounded-full text-white border border-white/30 hover:bg-white/10 transition duration-300 font-medium"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button
          className="py-2 px-6 rounded-full bg-blue-600/80 hover:bg-blue-600 text-white backdrop-blur-sm shadow-lg transition duration-300 font-medium"
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </button>
      </nav>
    </header>
  );
};

// --- Main Content ---
const Main = () => {
  return (
    <main className="pt-32 relative overflow-hidden">
      {/* Background blobs for glass effect */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[128px] pointer-events-none"></div>

      {/* Hero Section */}
      <section className="flex flex-col justify-center items-center text-center pb-24 px-8 w-full relative z-10">
        <motion.p
          variants={fadeIn(0.1)}
          initial="hidden"
          animate="show"
          className="text-lg text-blue-300 font-semibold mb-2 uppercase tracking-wider"
        >
          Welcome to Aetheria
        </motion.p>
        <motion.img
          variants={fadeIn(0.2)}
          initial="hidden"
          animate="show"
          src={building_icon}
          alt="Building icon"
          className="mx-auto my-8 w-56 drop-shadow-2xl"
        />
        <motion.h1
          variants={fadeIn(0.25)}
          initial="hidden"
          animate="show"
          className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
        >
          Community Living, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Reimagined.
          </span>
        </motion.h1>
        <motion.p
          variants={fadeIn(0.3)}
          initial="hidden"
          animate="show"
          className="text-gray-200 leading-relaxed text-lg md:text-xl max-w-3xl mx-auto font-light"
        >
          An AI-powered society management system designed to streamline
          residential operations, improve transparency, and enhance engagement.
        </motion.p>
      </section>

      {/* Challenge Section (Bento Grid) */}
      <section className="py-20 px-8 w-full relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeIn(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-sm uppercase text-blue-300 font-bold tracking-widest mb-2">
              The Challenge
            </h2>
            <h1 className="text-4xl font-bold text-white">Why Aetheria?</h1>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 w-full">
            <Card
              title="Manual & Error-Prone"
              description="Traditional society management relies on manual processes, leading to frequent errors and significant administrative burden."
            />
            <Card
              title="Time-Consuming"
              description="Managing residents, bills, complaints, and staff can consume countless hours, diverting focus from community well-being."
            />
            <Card
              title="Lack of Transparency"
              description="Opaque operations often lead to distrust and communication breakdowns between management and residents."
            />
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-8 w-full text-center relative z-10">
        <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-16">
          <motion.h5
            variants={fadeIn(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-sm uppercase text-blue-300 font-bold tracking-widest mb-2"
          >
            Our Solution
          </motion.h5>
          <motion.p
            variants={fadeIn(0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold mb-12 text-white"
          >
            Aetheria: The All-in-One Solution
          </motion.p>

          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              variants={fadeIn(0.3)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="w-full lg:w-1/2"
            >
              <img
                src={frontendImage}
                alt="Aetheria UI"
                className="rounded-2xl shadow-2xl border border-white/20"
              />
            </motion.div>

            <div className="w-full lg:w-1/2 text-left space-y-8">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h3 className="text-xl font-bold text-white mb-2">
                  Cloud-Based & Accessible
                </h3>
                <p className="text-gray-300">
                  Manage your society anytime, anywhere via an intuitive web
                  application designed for every device.
                </p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h3 className="text-xl font-bold text-white mb-2">
                  Real-Time Synchronization
                </h3>
                <p className="text-gray-300">
                  Instant updates ensure seamless interaction between admin and
                  residents without the lag.
                </p>
              </div>
              <p className="text-blue-200 text-lg italic">
                "Aetheria is designed to bring efficiency and harmony to your
                community."
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

// --- Footer ---
const Footer = () => (
  <footer className="bg-black/30 backdrop-blur-md border-t border-white/10 py-8 px-8 text-center text-gray-400">
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
