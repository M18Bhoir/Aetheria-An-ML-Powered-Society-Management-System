// LandingPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; 
// --- UPDATED: Use relative paths ---
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

// --- Reusable Card Components ---
const Card = ({ title, description }) => (
  <motion.div
    variants={fadeIn(0.2)}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-500 dark:bg-gray-700"
  >
    <h2 className="text-xl font-semibold mb-2 dark:text-white">{title}</h2>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </motion.div>
);

const NumberedCard = ({ number, title, description }) => (
  <motion.div
    variants={fadeIn(0.3)}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-start space-y-4 dark:bg-gray-700"
  >
    <div className="flex items-center space-x-4">
      <span className="text-4xl font-bold text-blue-500">{number}</span>
      <hr className="border-t-2 border-blue-500 w-12" />
    </div>
    <h3 className="text-lg font-semibold mt-2 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </motion.div>
);

// --- Header ---
const Header = ({ isDarkMode, toggleTheme }) => {
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center py-4 px-8 bg-white shadow-md fixed top-0 w-full z-50 dark:bg-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
        Aetheria
      </h1>
      <nav className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition duration-300 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          {isDarkMode ? "🌞" : "🌙"}
        </button>
        <button
          className="py-2 px-4 rounded-full text-blue-600 hover:bg-blue-50 transition duration-300 dark:text-blue-400 dark:hover:bg-blue-900"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button
          className="py-2 px-4 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition duration-300 dark:bg-blue-400 dark:hover:bg-blue-500"
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
    <main className="pt-28">
      {/* Hero Section */}
      <section className="flex flex-col justify-center items-center text-center pb-20 px-8 w-full">
        <motion.p
          variants={fadeIn(0.1)}
          initial="hidden"
          animate="show"
          className="text-lg text-blue-600 font-semibold mb-2"
        >
          Welcome to Aetheria. Please log in or sign up to continue.
        </motion.p>
        <motion.img
          variants={fadeIn(0.2)}
          initial="hidden"
          animate="show"
          src={building_icon}
          alt="Building icon"
          className="mx-auto my-8 w-56"
        />
        <motion.p
          variants={fadeIn(0.3)}
          initial="hidden"
          animate="show"
          className="text-gray-600 leading-relaxed text-lg max-w-5xl dark:text-gray-400"
        >
          Welcome to the Future of community living. Aetheria is an AI-powered
          society management system designed to streamline and automate
          residential operations, improve transparency, and enhance engagement.
        </motion.p>
      </section>

      {/* Challenge Section */}
      <section className="bg-gray-100 py-20 px-8 dark:bg-gray-800 w-full">
        <div className="w-full text-center">
          <motion.h2
            variants={fadeIn(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-sm uppercase text-gray-500 font-bold tracking-widest mb-2 dark:text-gray-400"
          >
            The Challenge
          </motion.h2>
          <motion.h1
            variants={fadeIn(0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-4xl font-extrabold mb-10 dark:text-white"
          >
            Why Aetheria?
          </motion.h1>
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
      <section className="py-20 px-8 w-full text-center">
        <motion.h5
          variants={fadeIn(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-sm uppercase text-gray-500 font-bold tracking-widest mb-2 dark:text-gray-400"
        >
          Our Solution
        </motion.h5>
        <motion.p
          variants={fadeIn(0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-4xl font-extrabold mb-8 text-blue-600 dark:text-blue-400"
        >
          Aetheria: The All-in-One Solution
        </motion.p>
        <motion.img
          variants={fadeIn(0.3)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          src={frontendImage}
          alt="Aetheria UI"
          className="mx-auto rounded-2xl shadow-lg mb-8 w-full max-w-4xl"
        />
        <div className="flex flex-col md:flex-row justify-center items-start md:space-x-12 w-full">
          <ul className="text-left space-y-4 mb-6 md:mb-0 max-w-lg">
            <li>
              <p className="dark:text-gray-400">
                <b>Cloud-Based & Accessible:</b> Manage your society anytime,
                anywhere via an intuitive web application.
              </p>
            </li>
            <li>
              <p className="dark:text-gray-400">
                <b>Real-Time Synchronization:</b> Instant updates and seamless
                interaction between admin and residents.
              </p>
            </li>
          </ul>
          <p className="text-gray-600 text-lg max-w-lg text-left dark:text-gray-400">
            Aetheria is designed to bring efficiency and harmony to your
            community.
          </p>
        </div>
      </section>
    </main>
  );
};

// --- Footer ---
const Footer = () => (
  <footer className="bg-gray-200 py-6 px-8 text-center dark:bg-gray-800 dark:text-gray-400">
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
    <div className="font-sans text-gray-800 bg-gray-50 min-h-screen w-full dark:bg-gray-900 dark:text-gray-300">
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <Main />
      <Footer />
    </div>
  );
};

export default LandingPage;