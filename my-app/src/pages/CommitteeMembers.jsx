import React from "react";
import { User, Phone, Mail, Shield } from "lucide-react";

const members = [
  {
    name: "Rajesh Kumar",
    role: "Chairman",
    phone: "+91 98765 43210",
    email: "chair@society.com",
  },
  {
    name: "Priya Sharma",
    role: "Secretary",
    phone: "+91 98765 43211",
    email: "secretary@society.com",
  },
  {
    name: "Amit Patel",
    role: "Treasurer",
    phone: "+91 98765 43212",
    email: "finance@society.com",
  },
];

const CommitteeMembers = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Management Committee</h1>
        <p className="text-gray-400 mt-2">
          Know the people who keep our society running.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {members.map((member, idx) => (
          <div
            key={idx}
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl text-center hover:-translate-y-2 transition-all duration-300 shadow-xl"
          >
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg">
              {member.name.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-white">{member.name}</h3>
            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30 mt-2 mb-4">
              {member.role}
            </span>

            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center justify-center gap-2">
                <Phone size={14} className="text-gray-500" /> {member.phone}
              </div>
              <div className="flex items-center justify-center gap-2">
                <Mail size={14} className="text-gray-500" /> {member.email}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommitteeMembers;
