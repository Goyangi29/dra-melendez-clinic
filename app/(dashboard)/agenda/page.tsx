"use client";

import { Topbar } from "@/components/layout/topbar";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  CONFIRMED: "bg-blue-100 text-blue-700 border-blue-200",
  IN_WAITING_ROOM: "bg-purple-100 text-purple-700 border-purple-200",
  IN_PROGRESS: "bg-[#e8f7f6] text-[#2daa9b] border-[#2daa9b]/20",
  COMPLETED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
  NO_SHOW: "bg-slate-100 text-slate-500 border-slate-200",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  IN_WAITING_ROOM: "En sala",
  IN_PROGRESS: "En atencion",
  COMPLETED: "Atendido",
  CANCELLED: "Cancelada",
  NO_SHOW: "No asistio",
};

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8am - 7pm

// Citas de ejemplo
const mockAppointments = [
  {
    id: "1",
    patient: "Maria Garcia",
    treatment: "Limpieza dental",
    startHour: 9,
    startMin: 0,
    duration: 60,
    status: "CONFIRMED",
    doctor: "Dra. Melendez",
  },
  {
    id: "2",
    patient: "Carlos Rios",
    treatment: "Endodoncia - Pieza 16",
    startHour: 11,
    startMin: 30,
    duration: 90,
    status: "PENDING",
    doctor: "Dra. Melendez",
  },
];

function getTopPercent(hour: number, min: number) {
  return ((hour - 8) * 60 + min) / (12 * 60);
}

function getHeightPercent(duration: number) {
  return duration / (12 * 60);
}

export default function AgendaPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const dateStr = currentDate.toLocaleDateString("es-PE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const goBack = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };

  const goForward = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };

  const goToday = () => setCurrentDate(new Date());

  return (
    <>
      <Topbar title="Agenda" subtitle="Calendario de citas" />
      <div className="flex-1 overflow-y-auto p-6 space-y-4">

        {/* Toolbar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={goBack}
              className="p-2 rounded-lg hover:bg-slate-100 border border-slate-200 bg-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-500" />
            </button>
            <button
              onClick={goToday}
              className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Hoy
            </button>
            <button
              onClick={goForward}
              className="p-2 rounded-lg hover:bg-slate-100 border border-slate-200 bg-white transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
            <span className="text-sm font-medium text-slate-700 capitalize ml-1">
              {dateStr}
            </span>
          </div>

          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2daa9b] text-white text-sm font-medium hover:bg-[#1e8a7d] transition-colors">
            <Plus className="w-4 h-4" />
            Nueva Cita
          </button>
        </div>

        {/* Status legend */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <span
              key={key}
              className={cn(
                "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
                STATUS_COLORS[key]
              )}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Day view */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="relative" style={{ minHeight: "700px" }}>
            {/* Hour lines */}
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="flex border-b border-slate-100"
                style={{ height: "58.33px" }}
              >
                <div className="w-16 shrink-0 px-3 py-1 text-xs text-slate-400 border-r border-slate-100 text-right">
                  {hour}:00
                </div>
                <div className="flex-1 relative" />
              </div>
            ))}

            {/* Appointments overlay */}
            <div className="absolute inset-0 left-16 pointer-events-none">
              {mockAppointments.map((apt) => {
                const topPct =
                  ((apt.startHour - 8) * 60 + apt.startMin) / (12 * 60);
                const heightPct = apt.duration / (12 * 60);
                return (
                  <div
                    key={apt.id}
                    className={cn(
                      "absolute left-2 right-2 rounded-lg border p-2 pointer-events-auto cursor-pointer hover:shadow-md transition-shadow",
                      STATUS_COLORS[apt.status]
                    )}
                    style={{
                      top: `${topPct * 100}%`,
                      height: `${heightPct * 100}%`,
                    }}
                  >
                    <div className="flex items-start gap-1.5 h-full overflow-hidden">
                      <User className="w-3 h-3 mt-0.5 shrink-0" />
                      <div className="overflow-hidden text-xs">
                        <p className="font-semibold truncate">{apt.patient}</p>
                        <p className="truncate opacity-80">{apt.treatment}</p>
                        <p className="flex items-center gap-0.5 opacity-70 mt-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          {apt.startHour}:{String(apt.startMin).padStart(2, "0")} ·{" "}
                          {apt.duration} min
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
