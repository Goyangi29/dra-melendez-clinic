import { Topbar } from "@/components/layout/topbar";
import { MessageSquare, Send, Users, Bell, Gift } from "lucide-react";

const campaigns = [
  { label: "Recordatorio de cita", icon: Bell, desc: "Envia 24h antes automaticamente", active: false },
  { label: "Reactivacion de pacientes", icon: Users, desc: "Pacientes sin cita hace +3 meses", active: false },
  { label: "Feliz cumpleanos", icon: Gift, desc: "Mensaje + codigo QR de descuento", active: false },
];

export default function CRMPage() {
  return (
    <>
      <Topbar title="WhatsApp CRM" subtitle="Automatizacion y campanas de mensajes" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
          <strong>Configuracion requerida:</strong> Conecta tu numero de WhatsApp Business API
          para activar los envios automaticos. Compatible con n8n y Zapier.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {campaigns.map((c) => (
            <div key={c.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-[#e8f7f6]">
                  <c.icon className="w-5 h-5 text-[#2daa9b]" />
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={c.active} />
                  <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-[#2daa9b] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                </label>
              </div>
              <h4 className="font-semibold text-slate-700 text-sm">{c.label}</h4>
              <p className="text-xs text-slate-400 mt-1">{c.desc}</p>
              <button className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                <Send className="w-3.5 h-3.5" />
                Configurar
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-700">Historial de Mensajes</h3>
          </div>
          <div className="p-10 text-center text-slate-400">
            <MessageSquare className="w-10 h-10 mx-auto mb-2 text-slate-200" />
            <p className="text-sm">No hay mensajes enviados aun</p>
          </div>
        </div>
      </div>
    </>
  );
}
