import { Topbar } from "@/components/layout/topbar";
import { BarChart3, TrendingUp, Users, DollarSign, Calendar } from "lucide-react";

const kpis = [
  { label: "Pacientes nuevos este mes", value: "0", icon: Users },
  { label: "Tasa de ausentismo", value: "0%", icon: Calendar },
  { label: "Ticket promedio", value: "S/ 0.00", icon: DollarSign },
  { label: "Crecimiento mensual", value: "0%", icon: TrendingUp },
];

export default function ReportesPage() {
  return (
    <>
      <Topbar title="Reportes y Analitica" subtitle="KPIs y metricas del consultorio" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-[#e8f7f6]">
                  <kpi.icon className="w-4 h-4 text-[#2daa9b]" />
                </div>
                <span className="text-sm text-slate-500">{kpi.label}</span>
              </div>
              <p className="text-3xl font-bold text-slate-800">{kpi.value}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center text-slate-400">
          <BarChart3 className="w-16 h-16 mx-auto mb-3 text-slate-200" />
          <p className="text-sm">Los graficos apareceran cuando haya datos registrados</p>
        </div>
      </div>
    </>
  );
}
