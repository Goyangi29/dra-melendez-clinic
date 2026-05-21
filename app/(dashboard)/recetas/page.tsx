import { Topbar } from "@/components/layout/topbar";
import { FileText, Plus } from "lucide-react";

export default function RecetasPage() {
  return (
    <>
      <Topbar title="Recetas" subtitle="Generador de recetas y post-operatorias" />
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2daa9b] text-white text-sm font-medium hover:bg-[#1e8a7d] transition-colors">
            <Plus className="w-4 h-4" />
            Nueva Receta
          </button>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center text-slate-400">
          <FileText className="w-12 h-12 mx-auto mb-3 text-slate-200" />
          <p className="text-sm">No hay recetas registradas</p>
          <p className="text-xs text-slate-300 mt-1">
            Genera recetas medicas con exportacion a PDF
          </p>
        </div>
      </div>
    </>
  );
}
