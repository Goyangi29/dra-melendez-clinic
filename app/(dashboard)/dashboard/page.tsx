"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users, CalendarDays, DollarSign, TrendingUp, TrendingDown,
  Clock, ArrowRight, Plus, Activity, Loader2,
} from "lucide-react";

interface Stats {
  totalPatients: number;
  newPatientsThisMonth: number;
  patientsGrowth: string;
  appointmentsToday: number;
  appointmentsPending: number;
  revenueThisMonth: number;
  revenueGrowth: string;
  recentPatients: { id: string; firstName: string; lastName: string; createdAt: string; recordNumber: string }[];
  upcomingAppointments: { id: string; startTime: string; status: string; treatment: string | null; patient: { firstName: string; lastName: string } }[];
}

function StatCard({
  title, value, sub, icon: Icon, growth, color, loading,
}: {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  growth?: string;
  color: string;
  loading?: boolean;
}) {
  const growthNum = parseFloat(growth ?? "0");
  const isPositive = growthNum >= 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {growth !== undefined && !loading && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            isPositive
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
              : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(growthNum)}%
          </div>
        )}
      </div>
      {loading ? (
        <div className="space-y-2">
          <div className="h-7 w-24 bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse" />
          <div className="h-4 w-32 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" />
        </div>
      ) : (
        <>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{sub || title}</p>
        </>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", minimumFractionDigits: 0 }).format(n);

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    CONFIRMED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    COMPLETED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  const statusLabel: Record<string, string> = {
    PENDING: "Pendiente", CONFIRMED: "Confirmada",
    COMPLETED: "Completada", CANCELLED: "Cancelada",
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Dashboard</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {new Date().toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/pacientes/nuevo"
              className="flex items-center gap-2 px-4 py-2 bg-[#2daa9b] hover:bg-[#1e8a7d] text-white rounded-xl text-sm font-medium transition-colors shadow-sm shadow-[#2daa9b]/20"
            >
              <Plus className="w-4 h-4" />
              Nuevo paciente
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Total Pacientes"
            value={stats?.totalPatients ?? 0}
            sub={`${stats?.newPatientsThisMonth ?? 0} nuevos este mes`}
            icon={Users}
            growth={stats?.patientsGrowth}
            color="bg-gradient-to-br from-[#2daa9b] to-[#1e8a7d]"
            loading={loading}
          />
          <StatCard
            title="Citas Hoy"
            value={stats?.appointmentsToday ?? 0}
            sub={`${stats?.appointmentsPending ?? 0} pendientes`}
            icon={CalendarDays}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            loading={loading}
          />
          <StatCard
            title="Ingresos del Mes"
            value={loading ? "—" : formatCurrency(stats?.revenueThisMonth ?? 0)}
            sub="vs mes anterior"
            icon={DollarSign}
            growth={stats?.revenueGrowth}
            color="bg-gradient-to-br from-[#c9a030] to-amber-600"
            loading={loading}
          />
          <StatCard
            title="Actividad"
            value={loading ? "—" : (stats?.appointmentsPending ?? 0) + (stats?.appointmentsToday ?? 0)}
            sub="citas activas"
            icon={Activity}
            color="bg-gradient-to-br from-violet-500 to-purple-600"
            loading={loading}
          />
        </div>

        {/* Lower grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Próximas citas */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#2daa9b]" />
                <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Próximas Citas</h2>
              </div>
              <Link href="/agenda" className="text-xs text-[#2daa9b] hover:underline flex items-center gap-1">
                Ver agenda <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="p-4 space-y-3">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-14 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse" />
                ))
              ) : stats?.upcomingAppointments?.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-400 dark:text-slate-500">No hay citas próximas</p>
                  <Link href="/agenda" className="text-xs text-[#2daa9b] hover:underline mt-1 block">
                    Agendar cita
                  </Link>
                </div>
              ) : (
                stats?.upcomingAppointments?.map((apt) => (
                  <div key={apt.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                        {formatTime(apt.startTime)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                        {apt.patient.firstName} {apt.patient.lastName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{apt.treatment ?? "Consulta"}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[apt.status]}`}>
                      {statusLabel[apt.status]}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pacientes recientes */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#2daa9b]" />
                <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Pacientes Recientes</h2>
              </div>
              <Link href="/pacientes" className="text-xs text-[#2daa9b] hover:underline flex items-center gap-1">
                Ver todos <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="p-4 space-y-3">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-14 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse" />
                ))
              ) : stats?.recentPatients?.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-400 dark:text-slate-500">Sin pacientes aún</p>
                  <Link href="/pacientes/nuevo" className="text-xs text-[#2daa9b] hover:underline mt-1 block">
                    Registrar primer paciente
                  </Link>
                </div>
              ) : (
                stats?.recentPatients?.map((p) => (
                  <Link
                    key={p.id}
                    href={`/pacientes/${p.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2daa9b] to-[#1e8a7d] flex items-center justify-center shrink-0 text-white text-sm font-bold">
                      {p.firstName[0]}{p.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate group-hover:text-[#2daa9b] transition-colors">
                        {p.firstName} {p.lastName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{p.recordNumber}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-[#2daa9b] transition-colors" />
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Nuevo Paciente", href: "/pacientes/nuevo", icon: Users, color: "from-[#2daa9b] to-[#1e8a7d]" },
            { label: "Agendar Cita", href: "/agenda", icon: CalendarDays, color: "from-blue-500 to-blue-600" },
            { label: "Registrar Pago", href: "/finanzas", icon: DollarSign, color: "from-[#c9a030] to-amber-600" },
            { label: "Ver Reportes", href: "/reportes", icon: TrendingUp, color: "from-violet-500 to-purple-600" },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300 text-center leading-tight">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
