import { Topbar } from "@/components/layout/topbar";
import { Package, AlertCircle, Plus, TrendingDown } from "lucide-react";

const mockItems = [
  { id: "1", name: "Guantes de latex M", category: "GLOVES", currentStock: 3, minStock: 10, unit: "caja", status: "critical" },
  { id: "2", name: "Anestesia Septocaine", category: "ANESTHESIA", currentStock: 25, minStock: 10, unit: "cartucho", status: "ok" },
  { id: "3", name: "Resina Z350 A2", category: "RESIN", currentStock: 8, minStock: 5, unit: "jeringa", status: "ok" },
];

const CATEGORY_LABELS: Record<string, string> = {
  ANESTHESIA: "Anestesia",
  RESIN: "Resinas",
  CEMENT: "Cementos",
  GLOVES: "Guantes",
  MASKS: "Mascarillas",
  STERILIZATION: "Esterilizacion",
  INSTRUMENTS: "Instrumentos",
  RADIOLOGY: "Radiologia",
  ORTHODONTICS: "Ortodoncia",
  OTHER: "Otros",
};

export default function InventarioPage() {
  const criticalCount = mockItems.filter((i) => i.status === "critical").length;

  return (
    <>
      <Topbar title="Inventario" subtitle="Control de stock de insumos" />
      <div className="flex-1 overflow-y-auto p-6 space-y-5">

        {criticalCount > 0 && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-red-600">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">
              {criticalCount} producto{criticalCount !== 1 ? "s" : ""} con stock critico
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div />
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2daa9b] text-white text-sm font-medium hover:bg-[#1e8a7d] transition-colors">
            <Plus className="w-4 h-4" />
            Agregar insumo
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Insumo</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Categoria</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">Stock actual</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">Stock minimo</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-700">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {CATEGORY_LABELS[item.category]}
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-slate-700">
                    {item.currentStock} {item.unit}
                  </td>
                  <td className="px-4 py-3 text-center text-slate-400">
                    {item.minStock} {item.unit}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {item.status === "critical" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-600 font-medium">
                        <TrendingDown className="w-3 h-3" />
                        Critico
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-600 font-medium">
                        OK
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
