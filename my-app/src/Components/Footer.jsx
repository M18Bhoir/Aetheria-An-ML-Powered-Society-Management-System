import React from "react";

const Footer = () => {
  return (
    <footer className="mt-12 py-6 border-t border-white/10 text-center text-gray-500 text-sm">
      <p>
        &copy; {new Date().getFullYear()} Aetheria Society Management. All
        rights reserved.
      </p>
      <div className="flex justify-center gap-4 mt-2">
        <a href="#" className="hover:text-blue-400 transition-colors">
          Privacy Policy
        </a>
        <a href="#" className="hover:text-blue-400 transition-colors">
          Terms of Service
        </a>
        <a href="/contact" className="hover:text-blue-400 transition-colors">
          Contact Support
        </a>
      </div>
    </footer>
  );
};

export default Footer;
