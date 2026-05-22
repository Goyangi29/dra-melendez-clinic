"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Stethoscope, Loader2, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    clinicName: "",
    doctorName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmEmail, setConfirmEmail] = useState(false);

  const change = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setLoading(true);
    setError("");

    const supabase = createClient();

    const { data, error: authErr } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (authErr) {
      setError(authErr.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError("No se pudo crear el usuario. Intenta de nuevo.");
      setLoading(false);
      return;
    }

    // Crear clínica y perfil en nuestra DB
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        supabaseId: data.user.id,
        email: form.email,
        name: form.doctorName,
        clinicName: form.clinicName,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      setError(`Error al configurar la clínica: ${errData.detail || errData.error || "intenta de nuevo"}`);
      setLoading(false);
      return;
    }

    // Si hay sesión activa → ir al dashboard
    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      // Supabase requiere confirmar email
      setConfirmEmail(true);
      setLoading(false);
    }
  };

  if (confirmEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafb] p-6">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-[#e8f7f6] flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-[#2daa9b]" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">¡Cuenta creada!</h2>
          <p className="text-slate-500 text-sm mb-6">
            Revisa tu correo <strong>{form.email}</strong> y haz click en el enlace de confirmación para activar tu cuenta.
          </p>
          <p className="text-xs text-slate-400 mb-6">
            Si no ves el correo, revisa tu carpeta de spam.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2daa9b] text-white font-semibold text-sm hover:bg-[#1e8a7d] transition-all"
          >
            Ir a iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#0f2437] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#2daa9b] blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#c9a030] blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2daa9b] flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl">DentCloud</span>
        </div>
        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Empieza <span className="text-[#2daa9b]">gratis</span> hoy
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Configura tu clínica en menos de 2 minutos. Sin tarjeta de crédito.
          </p>
          <div className="space-y-4">
            {[
              { icon: "🦷", text: "Pacientes y expedientes ilimitados" },
              { icon: "📅", text: "Agenda con notificaciones automáticas" },
              { icon: "💰", text: "Control de pagos y presupuestos" },
              { icon: "📊", text: "Reportes y estadísticas en tiempo real" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <span className="text-xl">{f.icon}</span>
                <span className="text-slate-300 text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-slate-500 text-sm">© 2025 DentCloud</div>
      </div>

      {/* Panel derecho */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#f8fafb] overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-[#2daa9b] flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[#0f2437]">DentCloud</span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-slate-800">Crear cuenta</h2>
              <p className="text-slate-500 mt-1 text-sm">Configura tu clínica en minutos</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre de la clínica</label>
                <input value={form.clinicName} onChange={(e) => change("clinicName", e.target.value)} required placeholder="Clínica Dental Melendez" className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2daa9b]/30 focus:border-[#2daa9b] bg-slate-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Tu nombre completo</label>
                <input value={form.doctorName} onChange={(e) => change("doctorName", e.target.value)} required placeholder="Dra. María Melendez" className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2daa9b]/30 focus:border-[#2daa9b] bg-slate-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Correo electrónico</label>
                <input type="email" value={form.email} onChange={(e) => change("email", e.target.value)} required placeholder="doctor@clinica.com" className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2daa9b]/30 focus:border-[#2daa9b] bg-slate-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Contraseña</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} value={form.password} onChange={(e) => change("password", e.target.value)} required placeholder="Mínimo 6 caracteres" className="w-full px-4 py-3 pr-11 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2daa9b]/30 focus:border-[#2daa9b] bg-slate-50" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirmar contraseña</label>
                <input type="password" value={form.confirmPassword} onChange={(e) => change("confirmPassword", e.target.value)} required placeholder="••••••••" className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2daa9b]/30 focus:border-[#2daa9b] bg-slate-50" />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#2daa9b] text-white font-semibold text-sm hover:bg-[#1e8a7d] disabled:opacity-60 transition-all shadow-md shadow-[#2daa9b]/20">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (<>Crear mi clínica <ArrowRight className="w-4 h-4" /></>)}
              </button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-sm text-slate-500">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login" className="text-[#2daa9b] font-medium hover:underline">Inicia sesión</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
