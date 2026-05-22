"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  CalendarDays, FileText, DollarSign, Package, Users, MessageSquare,
  Stethoscope, ChevronDown, Star, Menu, X, ArrowRight, CheckCircle2,
  Phone, Mail, MapPin, Facebook, Instagram, Youtube, Zap,
  Shield, Clock, TrendingUp, Bell, BarChart3, Wifi,
} from "lucide-react";

/* ─── Constants ─────────────────────────────────────── */

const WA_LINK = "https://wa.me/51972595272?text=Hola%2C%20quiero%20una%20demo%20de%20DentCloud";

const NAV_LINKS = [
  { label: "Inicio", href: "#inicio" },
  { label: "Características", href: "#caracteristicas" },
  { label: "Precios", href: "#precios" },
  { label: "Testimonios", href: "#testimonios" },
];

const FEATURES = [
  {
    icon: CalendarDays,
    title: "Agenda Digital",
    sub: "Minimiza inasistencias, maximiza ingresos",
    items: [
      "Validación automática y manual de citas",
      "Link para que pacientes agenden online",
      "Recordatorios automáticos por WhatsApp",
    ],
    color: "bg-teal-50 text-teal-600",
  },
  {
    icon: FileText,
    title: "Historia Clínica",
    sub: "Registra, accede y analiza con facilidad",
    items: [
      "Odontograma digital interactivo",
      "Acceso rápido a antecedentes y tratamientos",
      "Seguimiento en tiempo real de cada paciente",
    ],
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: DollarSign,
    title: "Gestión Financiera",
    sub: "Organización financiera total",
    items: [
      "Reportes gráficos de ingresos",
      "Seguimiento de presupuestos y pagos",
      "Reportes de flujo de caja diaria",
    ],
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Package,
    title: "Inventario",
    sub: "Control total, menos desperdicio",
    items: [
      "Control en tiempo real del stock",
      "Reportes detallados de materiales",
      "Alertas de stock mínimo automáticas",
    ],
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: Users,
    title: "CRM Dental",
    sub: "Fideliza a tus pacientes",
    items: [
      "Administración centralizada de pacientes",
      "Gestión automatizada de seguimientos",
      "Creación de campañas de fidelización",
    ],
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: MessageSquare,
    title: "Campañas WhatsApp",
    sub: "Comunicación efectiva, más pacientes",
    items: [
      "Envío masivo y segmentado a pacientes",
      "Confirmaciones automáticas de citas",
      "Personalización de mensajes por paciente",
    ],
    color: "bg-green-50 text-green-600",
  },
];

const FEATURE_DETAILS = [
  {
    icon: CalendarDays,
    tag: "Agenda",
    title: "Gestiona todas tus citas en un solo lugar",
    desc: "Olvídate de las agendas físicas. Con DentCloud puedes ver, crear y modificar citas desde cualquier dispositivo, recibir confirmaciones automáticas y reducir las inasistencias hasta un 40% con recordatorios por WhatsApp.",
    points: [
      "Vista diaria, semanal y mensual",
      "Gestión de múltiples doctores",
      "Recordatorios automáticos por WhatsApp",
      "Link de agendamiento para pacientes",
    ],
    color: "#2daa9b",
    isEven: true,
    bg: "bg-slate-50",
  },
  {
    icon: FileText,
    tag: "Historia Clínica",
    title: "Historial clínico 100% digital y seguro",
    desc: "Digitaliza completamente la historia clínica de tus pacientes. Accede a odontogramas, imágenes, tratamientos y evoluciones desde cualquier lugar con la máxima seguridad.",
    points: [
      "Odontograma interactivo completo",
      "Imágenes y radiografías digitales",
      "Recetas y consentimientos informados",
      "Acceso desde cualquier dispositivo",
    ],
    color: "#3b82f6",
    isEven: false,
    bg: "bg-white",
  },
  {
    icon: DollarSign,
    tag: "Finanzas",
    title: "Controla las finanzas de tu clínica",
    desc: "Toma decisiones basadas en datos reales. Visualiza tus ingresos, crea presupuestos, registra pagos y genera reportes financieros detallados para mejorar la rentabilidad de tu clínica.",
    points: [
      "Dashboard financiero en tiempo real",
      "Presupuestos y cotizaciones digitales",
      "Registro de múltiples métodos de pago",
      "Reportes de rentabilidad por período",
    ],
    color: "#10b981",
    isEven: true,
    bg: "bg-slate-50",
  },
];

const STATS = [
  { value: "5k+", label: "Citas agendadas" },
  { value: "2k+", label: "Historias clínicas" },
  { value: "98%", label: "Satisfacción" },
  { value: "24h", label: "Implementación" },
];

const TESTIMONIALS = [
  {
    name: "Dra. Ana María Torres",
    clinic: "Clínica Dental Torres",
    quote: "DentCloud transformó completamente la gestión de mi clínica. Las historias clínicas digitales y la agenda automática me ahorraron horas de trabajo cada semana.",
    stars: 5,
  },
  {
    name: "Dr. Carlos Mendoza",
    clinic: "Odontología Mendoza",
    quote: "Excelente software. Me permitió tener todas las historias clínicas digitalizadas con herramientas de producción diaria y mensual. El soporte es increíble.",
    stars: 5,
  },
  {
    name: "Dra. Patricia Ramírez",
    clinic: "Centro Dental Ramírez",
    quote: "Gracias a DentCloud hemos mejorado la organización de nuestra clínica. Es una solución práctica, confiable y muy fácil de usar para todo el equipo.",
    stars: 5,
  },
];

const FAQS = [
  {
    q: "¿Cómo me ayuda a incrementar la rentabilidad de mi clínica?",
    a: "DentCloud automatiza citas, recordatorios y pagos; reduce inasistencias hasta un 40%; mejora la fidelización de pacientes; y brinda reportes para tomar mejores decisiones de negocio.",
  },
  {
    q: "¿Qué diferencias tiene con otros softwares odontológicos?",
    a: "Ofrecemos más de 50 herramientas especializadas, acceso multiplataforma desde cualquier dispositivo, soporte personalizado en español y un sistema diseñado para clínicas de todos los tamaños.",
  },
  {
    q: "¿Puedo acceder desde cualquier lugar?",
    a: "Sí, DentCloud es 100% en la nube. Solo necesitas conexión a internet para acceder desde computadora, tablet o celular, con seguridad de datos garantizada en todo momento.",
  },
  {
    q: "¿Cómo reduce las inasistencias de pacientes?",
    a: "El sistema envía recordatorios automáticos por WhatsApp antes de cada cita, reduciendo los olvidos y asegurando una mayor tasa de asistencia en tu clínica.",
  },
  {
    q: "¿Mis datos y los de mis pacientes están seguros?",
    a: "Utilizamos encriptación avanzada y servidores de alta seguridad para proteger toda la información de tu clínica y tus pacientes en todo momento.",
  },
  {
    q: "¿Cuánto tiempo tarda la implementación?",
    a: "Menos de 24 horas. Nuestro equipo de soporte te guía en la configuración inicial para que tu clínica esté operativa al día siguiente.",
  },
  {
    q: "¿Cuáles son las funciones más utilizadas por las clínicas?",
    a: "Las más populares son: agenda digital, historia clínica electrónica, control de pagos, gestión de inventario, reportes financieros y campañas de WhatsApp.",
  },
  {
    q: "¿Cómo puedo comenzar con DentCloud?",
    a: "Solicita tu demo gratuita por WhatsApp y nuestro equipo te mostrará cómo DentCloud puede adaptarse a las necesidades específicas de tu clínica.",
  },
];

/* ─── Mini Dashboard Mockup ─────────────────────────── */
function DashboardMockup() {
  return (
    <div className="relative w-full max-w-lg">
      {/* Browser frame */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-slate-200">
        <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 border-b border-slate-200">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 ml-2 bg-white rounded-md px-3 py-1.5 text-xs text-slate-400 flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#2daa9b]" />
            app.dentcloud.com/dashboard
          </div>
        </div>
        <div className="flex" style={{ height: 300 }}>
          {/* Sidebar */}
          <div className="w-14 bg-[#0f2437] flex flex-col items-center py-3 gap-3 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-[#2daa9b] flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            {[CalendarDays, Users, DollarSign, Package, BarChart3].map((Icon, i) => (
              <div key={i} className={`w-8 h-8 rounded-xl flex items-center justify-center ${i === 0 ? "bg-[#2daa9b]/20" : ""}`}>
                <Icon className={`w-4 h-4 ${i === 0 ? "text-[#2daa9b]" : "text-slate-600"}`} />
              </div>
            ))}
          </div>
          {/* Content */}
          <div className="flex-1 bg-slate-50 p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-slate-700">Dashboard</p>
              <Bell className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                { label: "Citas hoy", value: "12", c: "text-teal-600 bg-teal-50" },
                { label: "Ingresos", value: "S/2,840", c: "text-emerald-600 bg-emerald-50" },
                { label: "Pacientes", value: "348", c: "text-blue-600 bg-blue-50" },
                { label: "Pendientes", value: "5", c: "text-amber-600 bg-amber-50" },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl p-2.5 border border-slate-100">
                  <p className="text-slate-400 text-[10px] mb-0.5">{s.label}</p>
                  <p className={`text-sm font-bold ${s.c.split(" ")[0]}`}>{s.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-2.5">
              <p className="text-[10px] font-semibold text-slate-500 mb-2">Próximas citas</p>
              {[
                { time: "09:00", name: "García, M.", c: "bg-teal-100 text-teal-700" },
                { time: "10:30", name: "López, C.", c: "bg-blue-100 text-blue-700" },
                { time: "12:00", name: "Torres, A.", c: "bg-purple-100 text-purple-700" },
                { time: "15:00", name: "Ramírez, P.", c: "bg-amber-100 text-amber-700" },
              ].map(a => (
                <div key={a.time} className="flex items-center gap-1.5 mb-1.5 last:mb-0">
                  <span className="text-[10px] text-slate-400 w-9">{a.time}</span>
                  <div className={`flex-1 h-5 rounded-lg text-[10px] flex items-center px-2 font-medium ${a.c}`}>{a.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Floating cards */}
      <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2.5 border border-slate-100">
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-700">Cita confirmada</p>
          <p className="text-xs text-slate-400">WhatsApp enviado ✓</p>
        </div>
      </div>
      <div className="absolute -top-5 -right-5 bg-white rounded-2xl shadow-xl p-3 border border-slate-100">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-[#2daa9b]" />
          <span className="text-xs font-bold text-slate-700">+32% ingresos</span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">este mes</p>
      </div>
    </div>
  );
}

/* ─── Feature Section Mock ──────────────────────────── */
function FeatureMock({ type, color }: { type: number; color: string }) {
  if (type === 0) {
    // Calendar mock
    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-sm border border-slate-100">
        <div className="px-4 py-3 flex items-center justify-between text-white text-sm font-semibold" style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>
          <span>Agenda — Mayo 2025</span>
          <CalendarDays className="w-4 h-4 opacity-70" />
        </div>
        <div className="p-4">
          <div className="grid grid-cols-7 gap-1 mb-3">
            {["L","M","M","J","V","S","D"].map(d => <div key={d} className="text-center text-xs font-medium text-slate-400 py-1">{d}</div>)}
            {Array.from({ length: 31 }, (_, i) => (
              <div key={i} className={`text-center text-xs py-1.5 rounded-lg ${i + 1 === 22 ? "text-white font-bold" : i + 1 > 30 ? "text-slate-200" : "text-slate-600 hover:bg-slate-100 cursor-pointer"}`}
                style={i + 1 === 22 ? { background: color } : {}}>
                {i + 1}
              </div>
            ))}
          </div>
          <div className="space-y-2 border-t border-slate-100 pt-3">
            {[
              { time: "09:00", name: "García, María", c: "bg-teal-50 text-teal-700" },
              { time: "10:30", name: "López, Carlos", c: "bg-blue-50 text-blue-700" },
              { time: "12:00", name: "Torres, Ana", c: "bg-purple-50 text-purple-700" },
            ].map(s => (
              <div key={s.time} className="flex items-center gap-2">
                <span className="text-xs text-slate-400 w-10">{s.time}</span>
                <span className={`flex-1 text-xs px-2.5 py-1.5 rounded-lg font-medium ${s.c}`}>{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (type === 1) {
    // Record mock
    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-sm border border-slate-100">
        <div className="px-4 py-3 flex items-center gap-2 text-white text-sm font-semibold" style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>
          <FileText className="w-4 h-4" />
          <span>Historia Clínica</span>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ background: color }}>MG</div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">María García López</p>
              <p className="text-xs text-slate-400">HC-2025-0042 · 34 años</p>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-1">
            {Array.from({ length: 32 }, (_, i) => (
              <div key={i} className={`h-6 rounded text-[9px] flex items-center justify-center font-medium ${
                [3, 14, 21].includes(i) ? "bg-amber-100 text-amber-700" : [5, 28].includes(i) ? "text-white" : "bg-slate-50 text-slate-400"
              }`} style={[5, 28].includes(i) ? { background: color } : {}}>
                {i + 1}
              </div>
            ))}
          </div>
          <div className="space-y-2 border-t border-slate-100 pt-3">
            {[
              ["Última visita", "15 May 2025"],
              ["Tratamiento", "Limpieza dental"],
              ["Próxima cita", "29 May, 10:30"],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between text-xs">
                <span className="text-slate-500">{l}</span>
                <span className="font-medium text-slate-700">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  // Finance mock
  const bars = [60, 80, 45, 90, 70, 85, 100];
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-sm border border-slate-100">
      <div className="px-4 py-3 flex items-center gap-2 text-white text-sm font-semibold" style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>
        <DollarSign className="w-4 h-4" />
        <span>Gestión Financiera</span>
      </div>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl p-3" style={{ background: `${color}10` }}>
            <p className="text-xs text-slate-500">Este mes</p>
            <p className="text-lg font-bold" style={{ color }}>S/ 8,420</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3">
            <p className="text-xs text-slate-500">Cobros</p>
            <p className="text-lg font-bold text-blue-600">47</p>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 mb-2">Ingresos mensuales</p>
          <div className="flex items-end gap-1 h-16">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                <div className="w-full rounded-t-md" style={{ height: `${h}%`, background: i === 6 ? color : `${color}50` }} />
                <span className="text-[9px] text-slate-400">{["N","D","E","F","M","A","M"][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────── */
export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="min-h-screen text-slate-800 overflow-x-hidden bg-white">

      {/* ── NAVBAR ─────────────────────────────────────── */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-200 ${scrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-sm"}`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#inicio" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2daa9b] to-[#1e8a7d] flex items-center justify-center shadow-lg shadow-[#2daa9b]/30">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">
              Dent<span className="text-[#2daa9b]">Cloud</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-[#2daa9b] hover:bg-[#2daa9b]/5 transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#2daa9b] transition-colors">
              Iniciar sesión
            </Link>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2daa9b] text-white text-sm font-semibold hover:bg-[#1e8a7d] transition-colors shadow-lg shadow-[#2daa9b]/25">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.507 3.934 1.395 5.61L0 24l6.562-1.373A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.807 9.807 0 01-5.031-1.382l-.361-.214-3.734.98.998-3.648-.235-.374A9.818 9.818 0 012.182 12C2.182 6.566 6.566 2.182 12 2.182S21.818 6.566 21.818 12 17.434 21.818 12 21.818z" />
              </svg>
              Contáctanos
            </a>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors">
            {mobileOpen ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
          </button>
        </nav>

        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-1 shadow-xl">
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-[#2daa9b]/5 hover:text-[#2daa9b] transition-colors">
                {link.label}
              </a>
            ))}
            <div className="pt-2 space-y-2 border-t border-slate-100">
              <Link href="/login" onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
                Iniciar sesión
              </Link>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
                className="block px-4 py-3 rounded-xl text-sm font-semibold bg-[#2daa9b] text-white text-center hover:bg-[#1e8a7d]">
                Solicita tu demo
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ───────────────────────────────────────── */}
      <section id="inicio" className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f2437] via-[#0d3d38] to-[#0a2e2b]" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-[#2daa9b]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 rounded-full bg-[#2daa9b]/15 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left max-w-xl mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2 bg-[#2daa9b]/20 text-[#4dddd0] text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-[#2daa9b]/30">
              <Zap className="w-3 h-3" />
              Software Dental N°1 en Latinoamérica
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Software odontológico para{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2daa9b] to-[#4dddd0]">
                tu clínica dental
              </span>
            </h1>
            <p className="text-lg text-slate-300 mb-10">
              Optimiza la fidelización de pacientes y aumenta la rentabilidad de tu clínica con nuestra plataforma todo-en-uno.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#2daa9b] text-white font-bold hover:bg-[#1e8a7d] transition-all shadow-2xl shadow-[#2daa9b]/40 hover:scale-105">
                Solicita tu demo gratis
                <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#caracteristicas"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-white/20 text-white font-semibold hover:bg-white/10 transition-all">
                Ver características
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-6 mt-10 justify-center lg:justify-start">
              {[
                { icon: Shield, text: "Datos seguros" },
                { icon: Clock, text: "Soporte 24/7" },
                { icon: Wifi, text: "100% en la nube" },
              ].map(b => (
                <div key={b.text} className="flex items-center gap-2 text-slate-400 text-sm">
                  <b.icon className="w-4 h-4 text-[#2daa9b]" />
                  {b.text}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex justify-center lg:justify-end w-full">
            <DashboardMockup />
          </div>
        </div>
      </section>

      {/* ── FEATURE CARDS ─────────────────────────────── */}
      <section id="caracteristicas" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#2daa9b] text-sm font-semibold uppercase tracking-wider">Características</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mt-2">
              Todo lo que tu clínica necesita
            </h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto text-lg">
              Más de 50 herramientas diseñadas específicamente para clínicas odontológicas.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="group p-6 rounded-2xl border border-slate-100 hover:border-[#2daa9b]/40 hover:shadow-xl hover:shadow-[#2daa9b]/5 transition-all duration-300 bg-white">
                <div className={`inline-flex p-3 rounded-2xl mb-5 ${f.color}`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">{f.title}</h3>
                <p className="text-sm font-medium mb-4" style={{ color: "#2daa9b" }}>{f.sub}</p>
                <ul className="space-y-2.5">
                  {f.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-500">
                      <CheckCircle2 className="w-4 h-4 text-[#2daa9b] shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURE DETAIL SECTIONS ───────────────────── */}
      {FEATURE_DETAILS.map((f, idx) => (
        <section key={f.title} className={`py-24 ${f.bg}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${!f.isEven ? "lg:flex-row-reverse" : ""}`}>
              <div className="flex-1 max-w-xl">
                <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-5"
                  style={{ background: `${f.color}15`, color: f.color }}>
                  <f.icon className="w-3.5 h-3.5" />
                  {f.tag}
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-5 leading-tight">
                  {f.title}
                </h2>
                <p className="text-slate-500 text-lg mb-7 leading-relaxed">{f.desc}</p>
                <ul className="space-y-3 mb-8">
                  {f.points.map(p => (
                    <li key={p} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: `${f.color}15` }}>
                        <CheckCircle2 className="w-3.5 h-3.5" style={{ color: f.color }} />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{p}</span>
                    </li>
                  ))}
                </ul>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:scale-105 shadow-lg"
                  style={{ background: f.color, boxShadow: `0 8px 25px ${f.color}40` }}>
                  Pidelo ahora
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="transform hover:scale-105 transition-transform duration-500">
                  <FeatureMock type={idx} color={f.color} />
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ── STATS ─────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-r from-[#0f2437] to-[#0d3d38] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-[#2daa9b]/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-[#2daa9b]/10 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Resultados que hablan por sí solos
          </h2>
          <p className="text-slate-400 mb-16">Clínicas en toda Latinoamérica confían en DentCloud</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {STATS.map(s => (
              <div key={s.label}>
                <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-[#2daa9b] to-[#4dddd0] mb-2">
                  {s.value}
                </p>
                <p className="text-slate-400 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────── */}
      <section id="testimonios" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#2daa9b] text-sm font-semibold uppercase tracking-wider">Testimonios</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mt-2">
              Lo que dicen nuestros clientes
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                onClick={() => setActiveTestimonial(i)}
                className={`p-7 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  activeTestimonial === i
                    ? "border-[#2daa9b] bg-white shadow-xl shadow-[#2daa9b]/10 scale-[1.02]"
                    : "border-slate-100 bg-white hover:border-[#2daa9b]/30 hover:shadow-md"
                }`}
              >
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#2daa9b] to-[#1e8a7d] flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {t.name.split(" ").filter((_, ni) => ni < 2).map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.clinic}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#2daa9b] text-sm font-semibold uppercase tracking-wider">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mt-2">
              Preguntas frecuentes
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className={`rounded-2xl border transition-all overflow-hidden ${openFaq === i ? "border-[#2daa9b]/40 shadow-md" : "border-slate-100"}`}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-semibold text-slate-800 text-sm pr-4">{faq.q}</span>
                  <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${openFaq === i ? "text-white rotate-180" : "bg-slate-100 text-slate-400"}`}
                    style={openFaq === i ? { background: "#2daa9b" } : {}}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────── */}
      <section id="precios" className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #2daa9b 0%, #1e6b63 100%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-semibold px-4 py-2 rounded-full mb-7 border border-white/25">
            <Zap className="w-3 h-3" />
            Demo gratuita disponible
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6">
            Empieza a digitalizar tu clínica hoy
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
            Sin costos ocultos. Soporte personalizado en español. Implementación en menos de 24 horas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-[#2daa9b] font-bold text-base hover:bg-slate-50 transition-all shadow-2xl hover:scale-105">
              Solicitar demo gratis
              <ArrowRight className="w-5 h-5" />
            </a>
            <Link href="/register"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-white text-white font-semibold text-base hover:bg-white/10 transition-all">
              Crear cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────── */}
      <footer className="bg-[#0f2437] text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2daa9b] to-[#1e8a7d] flex items-center justify-center shadow-lg shadow-[#2daa9b]/30">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">
                  Dent<span className="text-[#2daa9b]">Cloud</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-6 max-w-xs">
                Software odontológico todo-en-uno diseñado para optimizar la gestión de clínicas dentales en Latinoamérica.
              </p>
              <div className="flex gap-3">
                {[Facebook, Instagram, Youtube].map((Icon, i) => (
                  <a key={i} href="#"
                    className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#2daa9b] transition-colors">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-5 text-sm tracking-wider uppercase">Módulos</h4>
              <ul className="space-y-3">
                {["Agenda Digital", "Historia Clínica", "Gestión Financiera", "Inventario", "CRM Dental", "Campañas WhatsApp"].map(link => (
                  <li key={link}>
                    <a href="#caracteristicas" className="text-sm hover:text-[#2daa9b] transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-5 text-sm tracking-wider uppercase">Contacto</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-2.5 text-sm">
                  <Phone className="w-4 h-4 text-[#2daa9b] shrink-0 mt-0.5" />
                  <a href="tel:+51972595272" className="hover:text-[#2daa9b] transition-colors">+51 972 595 272</a>
                </li>
                <li className="flex items-start gap-2.5 text-sm">
                  <Mail className="w-4 h-4 text-[#2daa9b] shrink-0 mt-0.5" />
                  <a href="mailto:info@dentcloud.app" className="hover:text-[#2daa9b] transition-colors">info@dentcloud.app</a>
                </li>
                <li className="flex items-start gap-2.5 text-sm">
                  <MapPin className="w-4 h-4 text-[#2daa9b] shrink-0 mt-0.5" />
                  <span>Lima, Perú</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs">© 2025 DentCloud. Todos los derechos reservados.</p>
            <div className="flex items-center gap-1.5 text-xs">
              <Zap className="w-3 h-3 text-amber-400" />
              Powered by <span className="text-amber-400 font-semibold ml-1">ViralStudio</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
