"use client";

import { Topbar } from "@/components/layout/topbar";
import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Plus, Clock, User, X, Search, Loader2, Check, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
  IN_WAITING_ROOM: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400",
  IN_PROGRESS: "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400",
  COMPLETED: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400",
  CANCELLED: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400",
  NO_SHOW: "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-700 dark:text-slate-400",
};
const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente", CONFIRMED: "Confirmada", IN_WAITING_ROOM: "En sala",
  IN_PROGRESS: "En atención", COMPLETED: "Atendido", CANCELLED: "Cancelada", NO_SHOW: "No asistió",
};
const HOURS = Array.from({ length: 12 }, (_, i) => i + 8);

type Appointment = {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  treatment: string | null;
  notes: string | null;
  patient: { id: string; firstName: string; lastName: string; phone: string };
  doctor: { id: string; name: string };
};

type Patient = { id: string; firstName: string; lastName: string; recordNumber: string };

function toLocalDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export default function AgendaPage() {
  const [selectedDate, setSelectedDate] = useState(() => toLocalDate(new Date()));
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);

  const fetchAppointments = useCallback(async (date: Date) => {
    setLoading(true);
    const from = new Date(date); from.setHours(0, 0, 0, 0);
    const to = new Date(date); to.setHours(23, 59, 59, 999);
    try {
      const res = await fetch(`/api/appointments?from=${from.toISOString()}&to=${to.toISOString()}`);
      if (res.ok) setAppointments(await res.json());
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAppointments(selectedDate); }, [selectedDate, fetchAppointments]);

  const prevDay = () => setSelectedDate(d => { const n = new Date(d); n.setDate(n.getDate() - 1); return n; });
  const nextDay = () => setSelectedDate(d => { const n = new Date(d); n.setDate(n.getDate() + 1); return n; });
  const goToday = () => setSelectedDate(toLocalDate(new Date()));

  const handleStatusChange = async (id: string, status: string) => {
    await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchAppointments(selectedDate);
    setSelectedApt(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta cita?")) return;
    await fetch(`/api/appointments/${id}`, { method: "DELETE" });
    fetchAppointments(selectedDate);
    setSelectedApt(null);
  };

  const dateStr = selectedDate.toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long" });
  const isToday = selectedDate.toDateString() === new Date().toDateString();

  const getAptStyle = (apt: Appointment) => {
    const start = new Date(apt.startTime);
    const end = new Date(apt.endTime);
    const startMin = (start.getHours() - 8) * 60 + start.getMinutes();
    const durMin = Math.max((end.getTime() - start.getTime()) / 60000, 30);
    return { top: (startMin / 60) * 64, height: Math.max((durMin / 60) * 64, 32) };
  };

  return (
    <>
      <Topbar
        title="Agenda"
        subtitle={dateStr}
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#2daa9b] text-white text-sm font-medium hover:bg-[#1e8a7d] transition-colors"
          >
            <Plus className="w-4 h-4" /> Nueva cita
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto p-4">
        {/* Date nav */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button onClick={prevDay} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goToday}
              className={cn("px-3 py-1.5 rounded-xl text-sm font-medium transition-colors",
                isToday ? "bg-[#2daa9b] text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              )}
            >
              Hoy
            </button>
            <button onClick={nextDay} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300">
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200 ml-2 capitalize">{dateStr}</span>
          </div>
          <span className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
            {appointments.length} cita{appointments.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Calendar grid */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="flex">
            {/* Hours column */}
            <div className="w-16 shrink-0 border-r border-slate-100 dark:border-slate-700">
              {HOURS.map(h => (
                <div key={h} className="h-16 border-b border-slate-50 dark:border-slate-700/50 flex items-start pt-1 px-2">
                  <span className="text-xs text-slate-400 dark:text-slate-500">{h}:00</span>
                </div>
              ))}
            </div>

            {/* Events area */}
            <div className="flex-1 relative">
              {HOURS.map(h => (
                <div key={h} className="h-16 border-b border-slate-50 dark:border-slate-700/50" />
              ))}

              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-[#2daa9b] animate-spin" />
                </div>
              ) : appointments.length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                  <Clock className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-sm">Sin citas para este día</p>
                  <button onClick={() => setShowModal(true)} className="mt-2 text-xs text-[#2daa9b] hover:underline">
                    Agendar primera cita
                  </button>
                </div>
              ) : (
                appointments.map(apt => {
                  const style = getAptStyle(apt);
                  return (
                    <button
                      key={apt.id}
                      onClick={() => setSelectedApt(apt)}
                      style={{ top: style.top, height: style.height }}
                      className={cn(
                        "absolute left-2 right-2 rounded-xl border px-2 py-1 text-left text-xs font-medium transition-all hover:z-10 hover:shadow-md hover:scale-[1.01]",
                        STATUS_COLORS[apt.status]
                      )}
                    >
                      <p className="font-semibold truncate">{apt.patient.firstName} {apt.patient.lastName}</p>
                      <p className="opacity-75 truncate">{apt.treatment || "Consulta"}</p>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Appointment detail modal */}
      {selectedApt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedApt(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Detalle de cita</h3>
              <button onClick={() => setSelectedApt(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2daa9b] to-[#1e8a7d] flex items-center justify-center text-white font-bold">
                  {selectedApt.patient.firstName[0]}{selectedApt.patient.lastName[0]}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">{selectedApt.patient.firstName} {selectedApt.patient.lastName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{selectedApt.patient.phone}</p>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 space-y-1 text-sm">
                <p className="text-slate-600 dark:text-slate-300"><span className="font-medium">Tratamiento:</span> {selectedApt.treatment || "Consulta"}</p>
                <p className="text-slate-600 dark:text-slate-300"><span className="font-medium">Hora:</span> {new Date(selectedApt.startTime).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })} - {new Date(selectedApt.endTime).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}</p>
                {selectedApt.notes && <p className="text-slate-600 dark:text-slate-300"><span className="font-medium">Notas:</span> {selectedApt.notes}</p>}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {["CONFIRMED","IN_WAITING_ROOM","IN_PROGRESS","COMPLETED","CANCELLED","NO_SHOW"].map(s => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(selectedApt.id, s)}
                    className={cn(
                      "px-3 py-2 rounded-xl text-xs font-medium border transition-all",
                      selectedApt.status === s ? STATUS_COLORS[s] + " ring-2 ring-offset-1 ring-current" : "bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600"
                    )}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handleDelete(selectedApt.id)}
                className="w-full py-2 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Eliminar cita
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New appointment modal */}
      {showModal && <NewAppointmentModal onClose={() => setShowModal(false)} date={selectedDate} onCreated={() => { setShowModal(false); fetchAppointments(selectedDate); }} />}
    </>
  );
}

function NewAppointmentModal({ onClose, date, onCreated }: { onClose: () => void; date: Date; onCreated: () => void }) {
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [form, setForm] = useState({ startTime: "09:00", endTime: "10:00", treatment: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (search.length < 2) { setPatients([]); return; }
    setSearching(true);
    const t = setTimeout(async () => {
      const res = await fetch(`/api/patients?q=${encodeURIComponent(search)}&limit=5`);
      if (res.ok) { const d = await res.json(); setPatients(d.patients); }
      setSearching(false);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;
    setLoading(true);
    const start = new Date(date);
    const [sh, sm] = form.startTime.split(":").map(Number);
    start.setHours(sh, sm, 0, 0);
    const end = new Date(date);
    const [eh, em] = form.endTime.split(":").map(Number);
    end.setHours(eh, em, 0, 0);

    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId: selectedPatient.id,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        treatment: form.treatment || null,
        notes: form.notes || null,
      }),
    });
    setLoading(false);
    if (res.ok) onCreated();
    else alert("Error al crear cita");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">Nueva cita</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Patient search */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Paciente *</label>
            {selectedPatient ? (
              <div className="flex items-center justify-between p-3 bg-[#e8f7f6] dark:bg-[#0f3d38] rounded-xl">
                <span className="text-sm font-medium text-[#2daa9b]">{selectedPatient.firstName} {selectedPatient.lastName}</span>
                <button type="button" onClick={() => setSelectedPatient(null)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar paciente..." required={!selectedPatient}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2daa9b]/30 focus:border-[#2daa9b]"
                />
                {searching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />}
                {patients.length > 0 && (
                  <div className="absolute top-full mt-1 left-0 right-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl shadow-lg z-10 overflow-hidden">
                    {patients.map(p => (
                      <button key={p.id} type="button" onClick={() => { setSelectedPatient(p); setSearch(""); setPatients([]); }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-b border-slate-50 dark:border-slate-700 last:border-0">
                        {p.firstName} {p.lastName} <span className="text-slate-400 text-xs">· {p.recordNumber}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Hora inicio *</label>
              <input type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} required
                className="w-full px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2daa9b]/30 focus:border-[#2daa9b]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Hora fin *</label>
              <input type="time" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} required
                className="w-full px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2daa9b]/30 focus:border-[#2daa9b]" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Tratamiento</label>
            <input value={form.treatment} onChange={e => setForm(f => ({ ...f, treatment: e.target.value }))} placeholder="Ej: Limpieza dental, Extracción..."
              className="w-full px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2daa9b]/30 focus:border-[#2daa9b]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Notas</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} placeholder="Observaciones adicionales..."
              className="w-full px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2daa9b]/30 focus:border-[#2daa9b] resize-none" />
          </div>
          <button type="submit" disabled={loading || !selectedPatient}
            className="w-full py-3 rounded-xl bg-[#2daa9b] text-white font-semibold text-sm hover:bg-[#1e8a7d] disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Confirmar cita</>}
          </button>
        </form>
      </div>
    </div>
  );
}
