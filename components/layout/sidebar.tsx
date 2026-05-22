"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, CalendarDays, FileText, DollarSign,
  Package, FlaskConical, MessageSquare, BarChart3, Settings,
  Stethoscope, ChevronLeft, ChevronRight, LogOut, User,
  Sun, Moon, Zap,
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "@/components/providers/theme-provider";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Pacientes", href: "/pacientes", icon: Users },
  { label: "Agenda", href: "/agenda", icon: CalendarDays },
  { label: "Finanzas", href: "/finanzas", icon: DollarSign },
  { label: "Recetas", href: "/recetas", icon: FileText },
  { label: "Inventario", href: "/inventario", icon: Package },
  { label: "Laboratorio", href: "/laboratorio", icon: FlaskConical },
  { label: "WhatsApp CRM", href: "/crm", icon: MessageSquare },
  { label: "Reportes", href: "/reportes", icon: BarChart3 },
  { label: "Configuración", href: "/configuracion", icon: Settings },
];

type Props = { clinicName?: string; userName?: string; userRole?: string };

export function Sidebar({ clinicName, userName, userRole }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const roleLabel: Record<string, string> = {
    ADMIN: "Administrador",
    DOCTOR: "Doctor",
    ASSISTANT: "Asistente",
    RECEPTIONIST: "Recepcionista",
  };

  return (
    <aside className={cn(
      "flex flex-col bg-[#0f2437] text-slate-300 transition-all duration-300 shrink-0 shadow-2xl",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header clínica */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#2daa9b] to-[#1e8a7d] shrink-0 shadow-lg shadow-[#2daa9b]/30">
          <Stethoscope className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden flex-1">
            <p className="text-white font-bold text-sm leading-tight truncate">
              {clinicName || "Mi Clínica"}
            </p>
            <p className="text-[#2daa9b] text-xs font-medium truncate">DentCloud</p>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors shrink-0"
          >
            {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150",
                isActive
                  ? "bg-gradient-to-r from-[#2daa9b] to-[#1e8a7d] text-white font-medium shadow-lg shadow-[#2daa9b]/25"
                  : "text-slate-400 hover:bg-white/8 hover:text-white"
              )}
            >
              <item.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-white" : "")} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Usuario */}
      {!collapsed && (
        <div className="mx-2 mb-2 bg-white/5 rounded-xl p-3 border border-white/8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2daa9b] to-[#1e8a7d] flex items-center justify-center shrink-0 shadow-md shadow-[#2daa9b]/20">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{userName || "Usuario"}</p>
              <p className="text-slate-500 text-xs truncate">{roleLabel[userRole || ""] || "Usuario"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-xs disabled:opacity-50"
          >
            <LogOut className="w-3.5 h-3.5" />
            {loggingOut ? "Cerrando..." : "Cerrar sesión"}
          </button>
        </div>
      )}

      {/* Footer + Collapse */}
      <div className="border-t border-white/10">
        {/* Powered by */}
        {!collapsed && (
          <div className="flex items-center justify-center gap-1.5 py-2 px-4">
            <Zap className="w-3 h-3 text-[#c9a030]" />
            <span className="text-xs text-slate-600">
              Powered by{" "}
              <span className="text-[#c9a030] font-semibold">ViralStudio</span>
            </span>
          </div>
        )}
        <div className="p-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
            title={collapsed ? "Expandir" : "Colapsar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </aside>
  );
}
