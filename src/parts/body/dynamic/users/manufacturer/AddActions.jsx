import React from "react";
import { useNavigate } from "react-router-dom";
import { PackagePlus, Layers } from "lucide-react";

export default function AddActions() {
  const navigate = useNavigate();

  return (
    <div className=" p-4 mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
      
      {/* Add Product Card */}
      <button
        onClick={() => navigate("/m/create/product")}
        className="group flex items-center gap-5 rounded-3xl bg-white/90 p-6 shadow-sm transition-all
                   hover:scale-[1.02] hover:shadow-lg active:scale-95"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600
                        transition-colors group-hover:bg-blue-600 group-hover:text-white">
          <PackagePlus className="h-7 w-7" />
        </div>

        <div className="text-left">
          <h3 className="text-lg font-semibold text-slate-800">
            Add Product
          </h3>
          <p className="text-sm text-slate-500">
            Register a new product on blockchain
          </p>
        </div>
      </button>

      {/* Add Batch Card */}
      <button
        onClick={() => navigate("/m/create/batch")}
        className="group flex items-center gap-5 rounded-3xl bg-white/90 p-6 shadow-sm transition-all
                   hover:scale-[1.02] hover:shadow-lg active:scale-95"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600
                        transition-colors group-hover:bg-indigo-600 group-hover:text-white">
          <Layers className="h-7 w-7" />
        </div>

        <div className="text-left">
          <h3 className="text-lg font-semibold text-slate-800">
            Add Batch
          </h3>
          <p className="text-sm text-slate-500">
            Create a new production batch
          </p>
        </div>
      </button>

    </div>
  );
}
