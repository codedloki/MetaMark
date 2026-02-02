import React from "react";
import { useNavigate } from "react-router-dom";
import { PackagePlus, Layers, ArrowRight } from "lucide-react";

export default function AddActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Add Product",
      desc: "Register a new product type on the blockchain with unique attributes.",
      icon: <PackagePlus className="h-8 w-8" />,
      path: "/m/create/product",
      color: "from-blue-500 to-cyan-500",
      lightColor: "bg-blue-50 text-blue-600",
    },
    {
      title: "Add Batch",
      desc: "Create a production batch for existing products and generate QR roots.",
      icon: <Layers className="h-8 w-8" />,
      path: "/m/create/batch",
      color: "from-indigo-500 to-purple-500",
      lightColor: "bg-indigo-50 text-indigo-600",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10">
      <div className="mb-8 space-y-2">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
          Inventory Actions
        </h2>
        <p className="text-slate-500">
          Manage your production pipeline and blockchain records.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => navigate(action.path)}
            className="p-4 group relative overflow-hidden flex flex-col items-start gap-6 rounded-[2.5rem] bg-white p-8 
                       shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300
                       hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-2 active:scale-[0.98]"
          >
            {/* Background Hover Gradient */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 bg-gradient-to-br ${action.color}`} />

            {/* Icon Box */}
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 
                            ${action.lightColor} group-hover:scale-110 group-hover:shadow-lg shadow-current/20`}>
              {action.icon}
            </div>

            <div className="text-left space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold text-slate-800">
                  {action.title}
                </h3>
                <ArrowRight className="h-5 w-5 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-slate-400" />
              </div>
              <p className="text-base leading-relaxed text-slate-500 max-w-[280px]">
                {action.desc}
              </p>
            </div>

            {/* Bottom Accent Line */}
            <div className={`absolute bottom-0 left-0 h-1.5 w-0 transition-all duration-500 group-hover:w-full bg-gradient-to-r ${action.color}`} />
          </button>
        ))}
      </div>

      {/* Quick Help Note */}
      <div className="mt-10 rounded-2xl bg-slate-100 p-4 flex items-center gap-3 text-sm text-slate-600 border border-slate-200">
        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
        Note: Product registration requires a one-time blockchain gas fee.
      </div>
    </div>
  );
}