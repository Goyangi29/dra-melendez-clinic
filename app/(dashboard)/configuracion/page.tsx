import { Topbar } from "@/components/layout/topbar";
import { Settings, User, Bell, Shield, Palette } from "lucide-react";

const sections = [
  { icon: User, label: "Perfil del consultorio", desc: "Nombre, logo, direccion, RUC" },
  { icon: Bell, label: "Notificaciones", desc: "Alertas de stock, recordatorios" },
  { icon: Palette, label: "Apariencia", desc: "Tema, colores de la interfaz" },
  { icon: Shield, label: "Usuarios y permisos", desc: "Doctores, asistentes, recepcion" },
];

export default function ConfiguracionPage() {
  return (
    <>
      <Topbar title="Configuracion" subtitle="Ajustes del sistema" />
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((s) => (
            <button
              key={s.label}
              className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 text-left hover:border-[#2daa9b]/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#e8f7f6] group-hover:bg-[#2daa9b] transition-colors">
                  <s.icon className="w-5 h-5 text-[#2daa9b] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-700">{s.label}</h4>
                  <p className="text-sm text-slate-400 mt-0.5">{s.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <h3 className="font-semibold text-slate-700 mb-4">Informacion del Sistema</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500">Version</span>
              <span className="text-slate-700 font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500">Base de datos</span>
              <span className="text-slate-700 font-medium">Supabase PostgreSQL</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Consultorio</span>
              <span className="text-slate-700 font-medium">Dra. Melendez Odontologia Integral</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
