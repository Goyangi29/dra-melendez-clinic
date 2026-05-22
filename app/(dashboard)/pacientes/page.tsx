"use client";

import { Topbar } from "@/components/layout/topbar";
import { useEffect, useState, useCallback } from "react";
import { Search, Plus, User, Phone, FileText, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";

type Patient = {
  id: string;
  recordNumber: string;
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  birthDate: string;
  appointments: { startTime: string }[];
  clinicalNotes: { noteDate: string }[];
};

function calcAge(birthDate: string) {
  return Math.floor((Date.now() - new Date(birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
}

export default function PacientesPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPatients = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/patients?q=${encodeURIComponent(q)}&limit=50`);
      if (res.ok) {
        const data = await res.json();
        setPatients(data.patients);
        setTotal(data.total);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchPatients(search), 300);
    return () => clearTimeout(timer);
  }, [search, fetchPatients]);

  return (
    <>
      <Topbar title="Pacientes" subtitle="Gestión de historias clínicas" />
      <div className="flex-1 overflow-y-auto p-6 space-y-5">

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, DNI o N° historia..."
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2daa9b]/30 focus:border-[#2daa9b]"
            />
          </div>
          <Link
            href="/pacientes/nuevo"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2daa9b] text-white text-sm font-medium hover:bg-[#1e8a7d] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Paciente
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Paciente</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">DNI</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">Contacto</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider hidden lg:table-cell">Última visita</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider hidden lg:table-cell">Próx. cita</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <Loader2 className="w-6 h-6 mx-auto text-[#2daa9b] animate-spin" />
                    </td>
                  </tr>
                ) : patients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">
                      <User className="w-10 h-10 mx-auto mb-2 text-slate-200" />
                      <p>{search ? "No se encontraron pacientes" : "No hay pacientes registrados"}</p>
                      {!search && (
                        <Link href="/pacientes/nuevo" className="mt-3 inline-block text-sm text-[#2daa9b] hover:underline">
                          Registrar primer paciente
                        </Link>
                      )}
                    </td>
                  </tr>
                ) : (
                  patients.map((patient) => {
                    const nextAppt = patient.appointments[0]?.startTime;
                    const lastNote = patient.clinicalNotes[0]?.noteDate;
                    return (
                      <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#e8f7f6] flex items-center justify-center shrink-0">
                              <span className="text-[#2daa9b] font-semibold text-sm">
                                {patient.firstName[0]}{patient.lastName[0]}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">{patient.firstName} {patient.lastName}</p>
                              <p className="text-xs text-slate-400">{patient.recordNumber} · {calcAge(patient.birthDate)} años</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 font-mono text-xs">{patient.dni}</td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <div className="flex items-center gap-1 text-slate-600">
                            <Phone className="w-3 h-3" />
                            {patient.phone}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs hidden lg:table-cell">
                          {lastNote ? new Date(lastNote).toLocaleDateString("es-PE") : "—"}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          {nextAppt ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-[#e8f7f6] text-[#2daa9b] font-medium">
                              {new Date(nextAppt).toLocaleDateString("es-PE")}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">Sin cita</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 justify-end">
                            <Link href={`/pacientes/${patient.id}`} className="p-1.5 rounded-lg hover:bg-[#e8f7f6] text-slate-400 hover:text-[#2daa9b] transition-colors" title="Ver historia">
                              <FileText className="w-4 h-4" />
                            </Link>
                            <Link href={`/pacientes/${patient.id}`} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {!loading && patients.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-400">
              {total} paciente{total !== 1 ? "s" : ""} en total
            </div>
          )}
        </div>
      </div>
    </>
  );
}
