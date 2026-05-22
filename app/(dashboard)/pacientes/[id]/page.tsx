"use client";

import { Topbar } from "@/components/layout/topbar";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  User, Phone, Mail, MapPin, FileText, Calendar,
  Stethoscope, DollarSign, Heart, ChevronLeft, Loader2,
  Plus, CheckCircle, XCircle,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "historia", label: "Historia", icon: FileText },
  { id: "odontograma", label: "Odontograma", icon: Stethoscope },
  { id: "evoluciones", label: "Evoluciones", icon: Calendar },
  { id: "finanzas", label: "Finanzas", icon: DollarSign },
  { id: "consentimientos", label: "Consentimientos", icon: Heart },
];

type Patient = {
  id: string;
  recordNumber: string;
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  birthDate: string;
  gender: string;
  loyaltyPoints: number;
  medicalHistory?: {
    hypertension: boolean;
    diabetes: boolean;
    heartDisease: boolean;
    asthma: boolean;
    epilepsy: boolean;
    hiv: boolean;
    allergies?: string;
    currentMedications?: string;
    notes?: string;
  };
  clinicalNotes: {
    id: string;
    noteDate: string;
    diagnosis?: string;
    treatment?: string;
    observations?: string;
    toothNumber?: string;
    amount?: number;
  }[];
  quotes: {
    id: string;
    quoteNumber: string;
    total: number;
    status: string;
    createdAt: string;
    items: { description: string; quantity: number; unitPrice: number }[];
  }[];
  payments: {
    id: string;
    amount: number;
    method: string;
    paymentDate: string;
    description?: string;
  }[];
};

function calcAge(birthDate: string) {
  return Math.floor((Date.now() - new Date(birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
}

function formatCurrency(amount: number) {
  return `S/ ${amount.toFixed(2)}`;
}

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("historia");
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteForm, setNoteForm] = useState({ diagnosis: "", treatment: "", observations: "", toothNumber: "", amount: "" });
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/patients/${params.id}`)
      .then((r) => {
        if (r.status === 404) { router.push("/pacientes"); return null; }
        return r.json();
      })
      .then((data) => { if (data) setPatient(data); })
      .finally(() => setLoading(false));
  }, [params.id, router]);

  const saveNote = async () => {
    if (!noteForm.diagnosis && !noteForm.treatment) return;
    setSavingNote(true);
    try {
      const res = await fetch(`/api/patients/${params.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...noteForm,
          amount: noteForm.amount ? parseFloat(noteForm.amount) : null,
        }),
      });
      if (res.ok) {
        const note = await res.json();
        setPatient((prev) => prev ? { ...prev, clinicalNotes: [note, ...prev.clinicalNotes] } : prev);
        setNoteForm({ diagnosis: "", treatment: "", observations: "", toothNumber: "", amount: "" });
        setShowNoteForm(false);
      }
    } finally {
      setSavingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#2daa9b] animate-spin" />
      </div>
    );
  }

  if (!patient) return null;

  const age = calcAge(patient.birthDate);
  const totalQuoted = patient.quotes.reduce((s, q) => s + q.total, 0);
  const totalPaid = patient.payments.reduce((s, p) => s + p.amount, 0);
  const balance = totalQuoted - totalPaid;

  return (
    <>
      <Topbar title={`${patient.firstName} ${patient.lastName}`} subtitle={patient.recordNumber} />
      <div className="flex-1 overflow-y-auto">

        <div className="bg-white border-b border-slate-100 px-6 pt-4 pb-0">
          <div className="flex items-start gap-4 mb-4">
            <Link href="/pacientes" className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors mt-0.5">
              <ChevronLeft className="w-4 h-4" />
            </Link>

            <div className="w-14 h-14 rounded-2xl bg-[#e8f7f6] flex items-center justify-center shrink-0">
              <span className="text-[#2daa9b] font-bold text-xl">
                {patient.firstName[0]}{patient.lastName[0]}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-slate-800">{patient.firstName} {patient.lastName}</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  DNI: {patient.dni} · {age} años · {patient.gender === "F" ? "Femenino" : patient.gender === "M" ? "Masculino" : "Otro"}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {patient.phone}
                </span>
                {patient.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {patient.email}
                  </span>
                )}
                {patient.address && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {patient.address}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#fdf8ec] border border-[#c9a030]/20 rounded-xl px-3 py-2 shrink-0">
              <span className="text-xs text-[#c9a030] font-medium">{patient.loyaltyPoints} puntos</span>
            </div>
          </div>

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

        <div className="p-6">
          {activeTab === "historia" && <HistoriaTab patient={patient} />}
          {activeTab === "odontograma" && <OdontogramaTab />}
          {activeTab === "evoluciones" && (
            <EvolucionesTab
              notes={patient.clinicalNotes}
              showForm={showNoteForm}
              form={noteForm}
              saving={savingNote}
              onToggleForm={() => setShowNoteForm((v) => !v)}
              onFormChange={(k, v) => setNoteForm((prev) => ({ ...prev, [k]: v }))}
              onSave={saveNote}
              onCancel={() => setShowNoteForm(false)}
            />
          )}
          {activeTab === "finanzas" && (
            <FinanzasTab
              totalQuoted={totalQuoted}
              totalPaid={totalPaid}
              balance={balance}
              payments={patient.payments}
              quotes={patient.quotes}
            />
          )}
          {activeTab === "consentimientos" && <ConsentimientosTab />}
        </div>
      </div>
    </>
  );
}

function HistoriaTab({ patient }: { patient: Patient }) {
  const mh = patient.medicalHistory;
  const conditions = [
    { label: "Hipertensión", value: mh?.hypertension ?? false },
    { label: "Diabetes", value: mh?.diabetes ?? false },
    { label: "Cardiopatía", value: mh?.heartDisease ?? false },
    { label: "Asma", value: mh?.asthma ?? false },
    { label: "Epilepsia", value: mh?.epilepsy ?? false },
    { label: "VIH", value: mh?.hiv ?? false },
  ];
  return (
    <div className="max-w-3xl space-y-5">
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Heart className="w-4 h-4 text-[#2daa9b]" />
          Anamnesis Médica
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {conditions.map((item) => (
            <div
              key={item.label}
              className={cn(
                "flex items-center gap-2 p-3 rounded-lg text-sm",
                item.value ? "bg-red-50 text-red-600 border border-red-100" : "bg-slate-50 text-slate-500"
              )}
            >
              {item.value
                ? <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                : <CheckCircle className="w-4 h-4 text-slate-300 shrink-0" />}
              {item.label}
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
            <span className="font-medium text-slate-700">Alergias: </span>
            {mh?.allergies || "Sin alergias conocidas"}
          </div>
          <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
            <span className="font-medium text-slate-700">Medicación actual: </span>
            {mh?.currentMedications || "Sin medicación actual"}
          </div>
          {mh?.notes && (
            <div className="p-3 bg-amber-50 rounded-lg text-sm text-amber-700">
              <span className="font-medium">Notas: </span>{mh.notes}
            </div>
          )}
        </div>
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
          <p className="text-slate-400 text-sm">Odontograma interactivo — próxima actualización</p>
        </div>
      </div>
    </div>
  );
}

function EvolucionesTab({
  notes, showForm, form, saving,
  onToggleForm, onFormChange, onSave, onCancel,
}: {
  notes: Patient["clinicalNotes"];
  showForm: boolean;
  form: Record<string, string>;
  saving: boolean;
  onToggleForm: () => void;
  onFormChange: (k: string, v: string) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-700">Evoluciones Clínicas</h3>
        <button
          onClick={onToggleForm}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#2daa9b] text-white text-sm hover:bg-[#1e8a7d] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva evolución
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-[#2daa9b]/30 shadow-sm p-5 space-y-3">
          <h4 className="text-sm font-semibold text-slate-700">Nueva evolución clínica</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Diente (opcional)</label>
              <input
                value={form.toothNumber}
                onChange={(e) => onFormChange("toothNumber", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2daa9b]/30 focus:border-[#2daa9b]"
                placeholder="Ej: 18, 21-22"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Monto (S/)</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => onFormChange("amount", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2daa9b]/30 focus:border-[#2daa9b]"
                placeholder="0.00"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Diagnóstico</label>
            <input
              value={form.diagnosis}
              onChange={(e) => onFormChange("diagnosis", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2daa9b]/30 focus:border-[#2daa9b]"
              placeholder="Diagnóstico clínico..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Tratamiento realizado</label>
            <textarea
              value={form.treatment}
              onChange={(e) => onFormChange("treatment", e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2daa9b]/30 focus:border-[#2daa9b] resize-none"
              placeholder="Procedimiento realizado..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Observaciones</label>
            <textarea
              value={form.observations}
              onChange={(e) => onFormChange("observations", e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2daa9b]/30 focus:border-[#2daa9b] resize-none"
              placeholder="Próximos pasos, recomendaciones..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={onCancel} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              Cancelar
            </button>
            <button
              onClick={onSave}
              disabled={saving || (!form.diagnosis && !form.treatment)}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-[#2daa9b] text-white rounded-lg hover:bg-[#1e8a7d] disabled:opacity-60 transition-colors"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Guardar
            </button>
          </div>
        </div>
      )}

      {notes.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8 text-center text-slate-400">
          <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-200" />
          <p className="text-sm">No hay evoluciones registradas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase">
                    {new Date(note.noteDate).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                  {note.toothNumber && (
                    <span className="text-xs bg-[#e8f7f6] text-[#2daa9b] px-2 py-0.5 rounded-full">
                      Diente {note.toothNumber}
                    </span>
                  )}
                </div>
                {note.amount != null && note.amount > 0 && (
                  <span className="text-sm font-semibold text-[#2daa9b]">{formatCurrency(note.amount)}</span>
                )}
              </div>
              {note.diagnosis && <p className="text-sm font-medium text-slate-700">{note.diagnosis}</p>}
              {note.treatment && <p className="text-sm text-slate-600 mt-1">{note.treatment}</p>}
              {note.observations && <p className="text-xs text-slate-400 mt-1 italic">{note.observations}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FinanzasTab({
  totalQuoted, totalPaid, balance, payments, quotes,
}: {
  totalQuoted: number;
  totalPaid: number;
  balance: number;
  payments: Patient["payments"];
  quotes: Patient["quotes"];
}) {
  return (
    <div className="max-w-3xl space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalQuoted)}</p>
          <p className="text-xs text-slate-400 mt-1">Total Presupuestado</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalPaid)}</p>
          <p className="text-xs text-slate-400 mt-1">Pagado</p>
        </div>
        <div className={cn("rounded-xl border shadow-sm p-4 text-center", balance > 0 ? "bg-red-50 border-red-100" : "bg-white border-slate-100")}>
          <p className={cn("text-2xl font-bold", balance > 0 ? "text-red-600" : "text-slate-800")}>{formatCurrency(balance)}</p>
          <p className="text-xs text-slate-400 mt-1">Saldo Pendiente</p>
        </div>
      </div>

      {payments.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <h4 className="font-semibold text-slate-700 mb-3 text-sm">Pagos realizados</h4>
          <div className="space-y-2">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div>
                  <p className="text-sm text-slate-700">{p.description || p.method}</p>
                  <p className="text-xs text-slate-400">{new Date(p.paymentDate).toLocaleDateString("es-PE")} · {p.method}</p>
                </div>
                <span className="text-sm font-semibold text-emerald-600">{formatCurrency(p.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {payments.length === 0 && quotes.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-10 text-center text-slate-400">
          <DollarSign className="w-10 h-10 mx-auto mb-2 text-slate-200" />
          <p className="text-sm">Sin presupuestos ni pagos registrados</p>
        </div>
      )}
    </div>
  );
}

function ConsentimientosTab() {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-700">Consentimientos Informados</h3>
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#2daa9b] text-white text-sm hover:bg-[#1e8a7d] transition-colors">
          <Plus className="w-4 h-4" />
          Nuevo consentimiento
        </button>
      </div>
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8 text-center text-slate-400">
        <FileText className="w-10 h-10 mx-auto mb-2 text-slate-200" />
        <p className="text-sm">No hay consentimientos registrados</p>
      </div>
    </div>
  );
}
