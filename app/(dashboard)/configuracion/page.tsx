"use client";

import { Topbar } from "@/components/layout/topbar";
import { useEffect, useState } from "react";
import { Building2, Phone, MapPin, Mail, Save, Loader2, CheckCircle2, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";

type Clinic = {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  email: string;
  logoUrl: string | null;
};

export default function ConfiguracionPage() {
  const { theme, toggleTheme } = useTheme();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", address: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/clinic")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setClinic(data);
          setForm({
            name: data.name ?? "",
            phone: data.phone ?? "",
            address: data.address ?? "",
            email: data.email ?? "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/clinic", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name || undefined,
          phone: form.phone || undefined,
          address: form.address || undefined,
          email: form.email || undefined,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const d = await res.json();
        setError(d.error ?? "Error al guardar");
      }
    } finally { setSaving(false); }
  };

  const inputCls = "w-full px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2daa9b]/30 focus:border-[#2daa9b] placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors";

  return (
    <>
      <Topbar title="Configuración" subtitle="Ajustes del consultorio" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-2xl">
        {/* Clinic profile */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 p-5 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-r from-[#2daa9b]/5 to-transparent dark:from-[#2daa9b]/10">
            <div className="p-2.5 rounded-xl bg-[#e8f7f6] dark:bg-[#2daa9b]/20">
              <Building2 className="w-5 h-5 text-[#2daa9b]" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 dark:text-slate-200">Perfil del Consultorio</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">Nombre, contacto y dirección</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-[#2daa9b] animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Nombre del consultorio *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    required
                    placeholder="Ej: Dra. Melendez Odontología Integral"
                    className={`${inputCls} pl-9`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Teléfono
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+51 987 654 321"
                      className={`${inputCls} pl-9`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="consultorio@example.com"
                      className={`${inputCls} pl-9`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Dirección
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <textarea
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    rows={2}
                    placeholder="Av. Ejemplo 123, Lima"
                    className={`${inputCls} pl-9 resize-none`}
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-xl">{error}</p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2daa9b] text-white text-sm font-semibold hover:bg-[#1e8a7d] disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
                ) : saved ? (
                  <><CheckCircle2 className="w-4 h-4" /> ¡Guardado!</>
                ) : (
                  <><Save className="w-4 h-4" /> Guardar cambios</>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Appearance */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 p-5 border-b border-slate-100 dark:border-slate-700">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20">
              {theme === "dark" ? <Moon className="w-5 h-5 text-amber-500" /> : <Sun className="w-5 h-5 text-amber-500" />}
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 dark:text-slate-200">Apariencia</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">Tema de la interfaz</p>
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Modo {theme === "dark" ? "Oscuro" : "Claro"}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  {theme === "dark" ? "Interfaz oscura para reducir fatiga visual" : "Interfaz clara y nítida"}
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-[#2daa9b] hover:text-[#2daa9b] dark:hover:border-[#2daa9b] dark:hover:text-[#2daa9b] transition-colors"
              >
                {theme === "dark" ? <><Sun className="w-4 h-4" /> Cambiar a claro</> : <><Moon className="w-4 h-4" /> Cambiar a oscuro</>}
              </button>
            </div>
          </div>
        </div>

        {/* System info */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5">
          <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-4">Información del Sistema</h3>
          <div className="space-y-0">
            {[
              ["Versión", "1.0.0"],
              ["Plataforma", "DentCloud SaaS"],
              ["Base de datos", "Supabase PostgreSQL"],
              ["Infraestructura", "Netlify Edge Network"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-2.5 border-b border-slate-50 dark:border-slate-700 last:border-0">
                <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
