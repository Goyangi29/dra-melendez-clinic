"use client";

import { Topbar } from "@/components/layout/topbar";
import { useState } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Calendar,
  Stethoscope,
  Image,
  DollarSign,
  Heart,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "historia", label: "Historia", icon: FileText },
  { id: "odontograma", label: "Odontograma", icon: Stethoscope },
  { id: "evoluciones", label: "Evoluciones", icon: Calendar },
  { id: "imagenes", label: "Imagenes", icon: Image },
  { id: "finanzas", label: "Finanzas", icon: DollarSign },
  { id: "consentimientos", label: "Consentimientos", icon: Heart },
];

// Datos de ejemplo
const mockPatient = {
  id: "1",
  recordNumber: "HC-2024-0001",
  firstName: "Maria",
  lastName: "Garcia Lopez",
  dni: "12345678",
  phone: "999-111-222",
  whatsapp: "999-111-222",
  email: "maria.garcia@email.com",
  address: "Av. Principal 123, Lima",
  birthDate: "1985-03-15",
  gender: "F",
  loyaltyPoints: 150,
};

export default function PatientDetailPage() {
  const [activeTab, setActiveTab] = useState("historia");

  const age = Math.floor(
    (Date.now() - new Date(mockPatient.birthDate).getTime()) /
      (1000 * 60 * 60 * 24 * 365.25)
  );

  return (
    <>
      <Topbar
        title={`${mockPatient.firstName} ${mockPatient.lastName}`}
        subtitle={mockPatient.recordNumber}
      />
      <div className="flex-1 overflow-y-auto">

        {/* Header paciente */}
        <div className="bg-white border-b border-slate-100 px-6 pt-4 pb-0">
          <div className="flex items-start gap-4 mb-4">
            <Link
              href="/pacientes"
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors mt-0.5"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>

            <div className="w-14 h-14 rounded-2xl bg-[#e8f7f6] flex items-center justify-center shrink-0">
              <span className="text-[#2daa9b] font-bold text-xl">
                {mockPatient.firstName[0]}{mockPatient.lastName[0]}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-slate-800">
                {mockPatient.firstName} {mockPatient.lastName}
              </h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  DNI: {mockPatient.dni} · {age} años · {mockPatient.gender === "F" ? "Femenino" : "Masculino"}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {mockPatient.phone}
                </span>
                {mockPatient.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {mockPatient.email}
                  </span>
                )}
                {mockPatient.address && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {mockPatient.address}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#fdf8ec] border border-[#c9a030]/20 rounded-xl px-3 py-2 shrink-0">
              <span className="text-xs text-[#c9a030] font-medium">
                {mockPatient.loyaltyPoints} puntos
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                  activeTab === tab.id
                    ? "border-[#2daa9b] text-[#2daa9b]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido del tab */}
        <div className="p-6">
          {activeTab === "historia" && <HistoriaTab />}
          {activeTab === "odontograma" && <OdontogramaTab />}
          {activeTab === "evoluciones" && <EvolucionesTab />}
          {activeTab === "imagenes" && <ImagenesTab />}
          {activeTab === "finanzas" && <FinanzasTab />}
          {activeTab === "consentimientos" && <ConsentimientosTab />}
        </div>
      </div>
    </>
  );
}

function HistoriaTab() {
  return (
    <div className="max-w-3xl space-y-5">
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Heart className="w-4 h-4 text-[#2daa9b]" />
          Anamnesis Medica
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "Hipertension", value: false },
            { label: "Diabetes", value: false },
            { label: "Cardiopatia", value: false },
            { label: "Asma", value: false },
            { label: "Epilepsia", value: false },
            { label: "VIH", value: false },
          ].map((item) => (
            <div
              key={item.label}
              className={cn(
                "flex items-center gap-2 p-3 rounded-lg text-sm",
                item.value
                  ? "bg-red-50 text-red-600 border border-red-100"
                  : "bg-slate-50 text-slate-500"
              )}
            >
              <span
                className={cn(
                  "w-2 h-2 rounded-full shrink-0",
                  item.value ? "bg-red-500" : "bg-slate-300"
                )}
              />
              {item.label}
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-slate-50 rounded-lg text-sm text-slate-500">
          Sin alergias conocidas · Sin medicacion actual
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-700">Historia Dental Previa</h3>
          <button className="text-xs text-[#2daa9b] hover:underline">Editar</button>
        </div>
        <p className="text-sm text-slate-400">Sin informacion registrada.</p>
      </div>
    </div>
  );
}

function OdontogramaTab() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-700">Odontograma</h3>
        <span className="text-xs bg-[#e8f7f6] text-[#2daa9b] px-2 py-1 rounded-full">Adulto</span>
      </div>
      <div className="flex items-center justify-center py-16 text-slate-300">
        <div className="text-center">
          <Stethoscope className="w-16 h-16 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">
            Odontograma interactivo en construccion
          </p>
          <p className="text-xs text-slate-300 mt-1">
            Modulo disponible en la proxima actualizacion
          </p>
        </div>
      </div>
    </div>
  );
}

function EvolucionesTab() {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-700">Evoluciones Clinicas</h3>
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#2daa9b] text-white text-sm hover:bg-[#1e8a7d] transition-colors">
          + Nueva evolucion
        </button>
      </div>
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8 text-center text-slate-400">
        <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-200" />
        <p className="text-sm">No hay evoluciones registradas</p>
      </div>
    </div>
  );
}

function ImagenesTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-700">Imagenes Clinicas</h3>
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#2daa9b] text-white text-sm hover:bg-[#1e8a7d] transition-colors">
          + Subir imagen
        </button>
      </div>
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8 text-center text-slate-400">
        <Image className="w-10 h-10 mx-auto mb-2 text-slate-200" />
        <p className="text-sm">No hay imagenes cargadas</p>
        <p className="text-xs text-slate-300 mt-1">
          Radiografias, fotos intraorales, panoramicas
        </p>
      </div>
    </div>
  );
}

function FinanzasTab() {
  return (
    <div className="max-w-3xl space-y-5">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Tratamientos", value: "S/ 0.00" },
          { label: "Pagado", value: "S/ 0.00" },
          { label: "Saldo Pendiente", value: "S/ 0.00" },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-slate-800">{item.value}</p>
            <p className="text-xs text-slate-400 mt-1">{item.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 text-center text-slate-400 py-10">
        <DollarSign className="w-10 h-10 mx-auto mb-2 text-slate-200" />
        <p className="text-sm">Sin presupuestos ni pagos registrados</p>
      </div>
    </div>
  );
}

function ConsentimientosTab() {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-700">Consentimientos Informados</h3>
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#2daa9b] text-white text-sm hover:bg-[#1e8a7d] transition-colors">
          + Nuevo consentimiento
        </button>
      </div>
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8 text-center text-slate-400">
        <FileText className="w-10 h-10 mx-auto mb-2 text-slate-200" />
        <p className="text-sm">No hay consentimientos registrados</p>
      </div>
    </div>
  );
}
