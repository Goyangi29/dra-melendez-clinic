import { Topbar } from "@/components/layout/topbar";
import { FlaskConical, Plus, Clock, CheckCircle2, Truck } from "lucide-react";

const STATUS_CONFIG = {
  PENDING: { label: "Pendiente", color: "bg-amber-100 text-amber-700", icon: Clock },
  IN_LAB: { label: "En laboratorio", color: "bg-blue-100 text-blue-700", icon: FlaskConical },
  READY: { label: "Listo", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  DELIVERED: { label: "Entregado", color: "bg-slate-100 text-slate-600", icon: Truck },
};

export default function LaboratorioPage() {
  return (
    <>
      <Topbar title="Laboratorio Dental" subtitle="Ordenes de trabajo a laboratorio externo" />
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2daa9b] text-white text-sm font-medium hover:bg-[#1e8a7d] transition-colors">
            <Plus className="w-4 h-4" />
            Nueva orden
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <div key={key} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 text-center">
              <span className={`inline-flex p-2 rounded-lg mb-2 ${cfg.color}`}>
                <cfg.icon className="w-4 h-4" />
              </span>
              <p className="text-xl font-bold text-slate-800">0</p>
              <p className="text-xs text-slate-400">{cfg.label}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center text-slate-400">
          <FlaskConical className="w-12 h-12 mx-auto mb-3 text-slate-200" />
          <p className="text-sm">No hay ordenes de laboratorio</p>
        </div>
      </div>
    </>
  );
}
