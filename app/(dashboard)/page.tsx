import { Topbar } from "@/components/layout/topbar";
import {
  Users,
  CalendarDays,
  DollarSign,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  UserPlus,
} from "lucide-react";

const stats = [
  {
    label: "Pacientes Activos",
    value: "0",
    icon: Users,
    color: "bg-[#e8f7f6] text-[#2daa9b]",
    trend: "+0 este mes",
  },
  {
    label: "Citas Hoy",
    value: "0",
    icon: CalendarDays,
    color: "bg-blue-50 text-blue-600",
    trend: "0 pendientes",
  },
  {
    label: "Ingresos del Mes",
    value: "S/ 0.00",
    icon: DollarSign,
    color: "bg-emerald-50 text-emerald-600",
    trend: "0% vs mes anterior",
  },
  {
    label: "Tasa de Retencion",
    value: "0%",
    icon: TrendingUp,
    color: "bg-amber-50 text-amber-600",
    trend: "Calculando...",
  },
];

const quickActions = [
  { label: "Nueva Cita", icon: CalendarDays, href: "/agenda", color: "bg-[#2daa9b]" },
  { label: "Nuevo Paciente", icon: UserPlus, href: "/pacientes/nuevo", color: "bg-[#c9a030]" },
  { label: "Ver Agenda", icon: Clock, href: "/agenda", color: "bg-blue-500" },
  { label: "Stock Critico", icon: AlertCircle, href: "/inventario", color: "bg-red-500" },
];

export default function DashboardPage() {
  return (
    <>
      <Topbar
        title="Dashboard"
        subtitle="Resumen general del consultorio"
      />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Banner bienvenida */}
        <div className="rounded-2xl bg-gradient-to-r from-[#0f2437] to-[#1e3a52] p-6 text-white flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              Bienvenida, Dra. Melendez
            </h2>
            <p className="text-slate-300 text-sm mt-1">
              Tu sonrisa es lo primero para nosotros
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3">
            <CheckCircle2 className="w-5 h-5 text-[#2daa9b]" />
            <span className="text-sm">Sistema listo</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-500">{stat.label}</span>
                <span className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.trend}</p>
            </div>
          ))}
        </div>

        {/* Quick actions + upcoming */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Quick actions */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-semibold text-slate-700 mb-4">Acciones Rapidas</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group"
                >
                  <span
                    className={`${action.color} w-10 h-10 rounded-lg flex items-center justify-center`}
                  >
                    <action.icon className="w-5 h-5 text-white" />
                  </span>
                  <span className="text-xs text-center text-slate-600 font-medium leading-tight">
                    {action.label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Proximas citas */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-700">Proximas Citas</h3>
              <a
                href="/agenda"
                className="text-xs text-[#2daa9b] hover:underline"
              >
                Ver agenda completa
              </a>
            </div>
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CalendarDays className="w-12 h-12 text-slate-200 mb-3" />
              <p className="text-slate-400 text-sm">
                No hay citas programadas
              </p>
              <a
                href="/agenda"
                className="mt-3 text-sm text-[#2daa9b] hover:underline"
              >
                Crear primera cita
              </a>
            </div>
          </div>
        </div>

        {/* Alertas stock */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700">Alertas de Stock</h3>
            <a href="/inventario" className="text-xs text-[#2daa9b] hover:underline">
              Ver inventario
            </a>
          </div>
          <div className="flex items-center gap-3 text-slate-400 py-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm">No hay alertas criticas de inventario</span>
          </div>
        </div>

      </div>
    </>
  );
}
