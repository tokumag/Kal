import React from "react";

interface EmergencyHotlineCardProps {
  language: "en" | "am";
}

export const EmergencyHotlineCard: React.FC<EmergencyHotlineCardProps> = ({ language }) => {
  return (
    <div className="bg-slate-900 text-white rounded-xl p-4 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-rose-600/20 text-rose-400 flex items-center justify-center font-bold text-lg border border-rose-500/30">
          📞
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">
            {language === "am"
              ? "የኢትዮጵያ ነፃ የጤና ጥሪ መስመር"
              : "Ethiopia National Health Toll-Free Hotline"}
          </h4>
          <p className="text-xs text-slate-400">
            {language === "am"
              ? "ለአስቸኳይ እናቶች እና ህፃናት ህክምና ምክር በ 952 ይደውሉ"
              : "Direct support for maternal emergencies & health extension workers."}
          </p>
        </div>
      </div>

      <a
        href="tel:952"
        className="w-full sm:w-auto text-center px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition-colors shadow"
      >
        {language === "am" ? "952 ይደውሉ" : "Call 952"}
      </a>
    </div>
  );
};
