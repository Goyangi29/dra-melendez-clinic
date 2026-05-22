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
      <div className="flex-1 overflow-y-auto p-6 space-y-4">

        {/* Search + action bar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, DNI o N° historia..."
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2daa9b]/30 focus:border-[#2daa9b] text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
          <Link
            href="/pacientes/nuevo"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2daa9b] text-white text-sm font-medium hover:bg-[#1e8a7d] transition-colors shadow-sm shadow-[#2daa9b]/20"
          >
            <Plus className="w-4 h-4" />
            Nuevo Paciente
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Paciente</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">DNI</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">Contacto</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell">Última visita</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell">Próx. cita</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-14">
                      <Loader2 className="w-6 h-6 mx-auto text-[#2daa9b] animate-spin" />
                    </td>
                  </tr>
                ) : patients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-14">
                      <User className="w-10 h-10 mx-auto mb-3 text-slate-200 dark:text-slate-600" />
                      <p className="text-slate-400 dark:text-slate-500">
                        {search ? "No se encontraron pacientes" : "No hay pacientes registrados"}
                      </p>
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
                      <tr key={patient.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2daa9b] to-[#1e8a7d] flex items-center justify-center shrink-0 shadow-sm shadow-[#2daa9b]/20">
                              <span className="text-white font-bold text-sm">
                                {patient.firstName[0]}{patient.lastName[0]}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 dark:text-slate-100">
                                {patient.firstName} {patient.lastName}
                              </p>
                              <p className="text-xs text-slate-400 dark:text-slate-500">
                                {patient.recordNumber} · {calcAge(patient.birthDate)} años
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-mono text-xs">{patient.dni}</td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 text-xs">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {patient.phone}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs hidden lg:table-cell">
                          {lastNote ? new Date(lastNote).toLocaleDateString("es-PE") : "—"}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          {nextAppt ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-[#e8f7f6] dark:bg-[#0f3d38] text-[#2daa9b] font-medium">
                              {new Date(nextAppt).toLocaleDateString("es-PE")}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 dark:text-slate-500">Sin cita</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <Link
                              href={`/pacientes/${patient.id}`}
                              className="p-1.5 rounded-lg hover:bg-[#e8f7f6] dark:hover:bg-[#0f3d38] text-slate-400 hover:text-[#2daa9b] transition-colors"
                              title="Ver historia"
                            >
                              <FileText className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/pacientes/${patient.id}`}
                              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            >
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
            <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-400 dark:text-slate-500">
              {total} paciente{total !== 1 ? "s" : ""} en total
            </div>
          )}
        </div>
      </div>
    </>
  );
}
