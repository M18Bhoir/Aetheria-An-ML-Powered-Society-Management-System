import React from "react";
import { BookOpen, CheckCircle } from "lucide-react";

const rules = [
  "No loud music allowed after 10:00 PM.",
  "Guest parking must be reserved in advance via the app.",
  "Segregation of wet and dry waste is mandatory.",
  "Maintenance dues must be cleared by the 5th of every month.",
  "Common areas must be kept clean; fines apply for littering.",
];

const SocietyRules = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-4">
        <BookOpen className="text-blue-400" size={32} />
        <h1 className="text-3xl font-bold text-white">
          Society Rules & Bylaws
        </h1>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <ul className="space-y-4">
          {rules.map((rule, index) => (
            <li
              key={index}
              className="flex items-start gap-4 p-4 rounded-xl bg-black/20 border border-white/5 hover:bg-white/5 transition-colors"
            >
              <CheckCircle className="text-green-400 shrink-0 mt-1" size={20} />
              <span className="text-gray-200 text-lg">{rule}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SocietyRules;
