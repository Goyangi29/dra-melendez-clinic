import { Topbar } from "@/components/layout/topbar";
import { DollarSign, TrendingUp, CreditCard, Banknote, Plus } from "lucide-react";

const stats = [
  { label: "Ingresos del mes", value: "S/ 0.00", icon: DollarSign, color: "bg-emerald-50 text-emerald-600" },
  { label: "Cobros pendientes", value: "S/ 0.00", icon: CreditCard, color: "bg-amber-50 text-amber-600" },
  { label: "Comisiones por pagar", value: "S/ 0.00", icon: Banknote, color: "bg-blue-50 text-blue-600" },
  { label: "Crecimiento", value: "0%", icon: TrendingUp, color: "bg-[#e8f7f6] text-[#2daa9b]" },
];

export default function FinanzasPage() {
  return (
    <>
      <Topbar title="Finanzas" subtitle="Presupuestos, pagos y comisiones" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-500">{s.label}</span>
                <span className={`p-2 rounded-lg ${s.color}`}>
                  <s.icon className="w-4 h-4" />
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-800">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-700">Presupuestos Recientes</h3>
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#2daa9b] text-white text-sm hover:bg-[#1e8a7d] transition-colors">
              <Plus className="w-4 h-4" />
              Nuevo presupuesto
            </button>
          </div>
          <div className="p-8 text-center text-slate-400">
            <DollarSign className="w-10 h-10 mx-auto mb-2 text-slate-200" />
            <p className="text-sm">No hay presupuestos registrados</p>
          </div>
        </div>
      </div>
    </>
  );
}
