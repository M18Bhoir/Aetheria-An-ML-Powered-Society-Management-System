import React from "react";
import { Phone, Mail, MapPin, ShieldAlert } from "lucide-react";

const ContactUs = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <h1 className="text-3xl font-bold text-white text-center">Help Desk</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Emergency Card */}
        <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 p-6 rounded-3xl text-center">
          <ShieldAlert size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Emergency Security
          </h2>
          <p className="text-red-300 mb-4">
            For immediate security assistance.
          </p>
          <a
            href="tel:100"
            className="text-3xl font-bold text-white hover:text-red-400 transition-colors"
          >
            +91 98765 00000
          </a>
        </div>

        {/* Office Card */}
        <div className="bg-blue-500/10 backdrop-blur-xl border border-blue-500/30 p-6 rounded-3xl text-center">
          <MapPin size={48} className="text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Society Office</h2>
          <p className="text-blue-300 mb-4">Mon - Sat (10 AM - 6 PM)</p>
          <p className="text-white text-lg">
            Aetheria Main Block, Ground Floor
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
