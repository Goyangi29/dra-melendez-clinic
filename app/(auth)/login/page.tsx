"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Stethoscope, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError("Correo o contraseña incorrectos");
      setLoading(false);
    } else {
      router.push("/pacientes");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo — branding */}
      <div className="hidden lg:flex lg:w-[55%] bg-[#0f2437] flex-col justify-between p-12 relative overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[#2daa9b] blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#2daa9b] blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2daa9b] flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">DentCloud</span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight">
              El sistema de gestión dental más{" "}
              <span className="text-[#2daa9b]">completo</span> de Peru
            </h1>
            <p className="text-slate-400 mt-4 text-lg leading-relaxed">
              Gestiona pacientes, agenda, finanzas e inventario desde un solo lugar.
              100% en la nube, seguro y sin instalaciones.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { num: "500+", label: "Clínicas activas" },
              { num: "50k+", label: "Pacientes gestionados" },
              { num: "99.9%", label: "Uptime garantizado" },
              { num: "24/7", label: "Soporte incluido" },
            ].map((item) => (
              <div key={item.label} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <p className="text-2xl font-bold text-[#2daa9b]">{item.num}</p>
                <p className="text-slate-400 text-sm mt-1">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {[
              "Historial clínico completo con odontograma",
              "Agenda inteligente con recordatorios WhatsApp",
              "Facturación, pagos y reportes en tiempo real",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#2daa9b]/20 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-[#2daa9b]" />
                </div>
                <span className="text-slate-300 text-sm">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-slate-500 text-sm">
          © 2025 DentCloud · Todos los derechos reservados
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#f8fafb]">
        <div className="w-full max-w-md">
          {/* Logo móvil */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-[#2daa9b] flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[#0f2437]">DentCloud</span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Bienvenido</h2>
              <p className="text-slate-500 mt-1 text-sm">Ingresa a tu clínica digital</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="doctor@clinica.com"
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2daa9b]/30 focus:border-[#2daa9b] bg-slate-50 transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-slate-700">Contraseña</label>
                  <button type="button" className="text-xs text-[#2daa9b] hover:underline">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-11 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2daa9b]/30 focus:border-[#2daa9b] bg-slate-50 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#2daa9b] text-white font-semibold text-sm hover:bg-[#1e8a7d] disabled:opacity-60 transition-all shadow-md shadow-[#2daa9b]/20"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Iniciar sesión
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                ¿No tienes cuenta?{" "}
                <Link href="/register" className="text-[#2daa9b] font-medium hover:underline">
                  Regístrate gratis
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Al ingresar aceptas nuestros{" "}
            <span className="underline cursor-pointer">Términos de servicio</span>
            {" "}y{" "}
            <span className="underline cursor-pointer">Política de privacidad</span>
          </p>
        </div>
      </div>
    </div>
  );
}
