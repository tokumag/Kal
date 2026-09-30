import React from "react";

interface HeaderProps {
  language: "en" | "am";
  onLanguageChange: (lang: "en" | "am") => void;
}

export const Header: React.FC<HeaderProps> = ({ language, onLanguageChange }) => {
  return (
    <header className="bg-slate-900 text-white shadow-md border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center font-bold text-xl text-white shadow-inner">
            K
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-teal-400">Kalcare</h1>
            <p className="text-xs text-slate-400">
              {language === "am"
                ? "የእናቶች እና የሕፃናት ጤና አሰሳ"
                : "Maternal & Newborn Health Navigator"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 hidden sm:inline">Language:</span>
          <div className="inline-flex rounded-md shadow-sm bg-slate-800 p-1 border border-slate-700">
            <button
              onClick={() => onLanguageChange("en")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                language === "en"
                  ? "bg-teal-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              English
            </button>
            <button
              onClick={() => onLanguageChange("am")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                language === "am"
                  ? "bg-teal-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              አማርኛ
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
