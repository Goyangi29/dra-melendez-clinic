"use client";

import { Topbar } from "@/components/layout/topbar";
import { useEffect, useState, useCallback } from "react";
import {
  DollarSign, TrendingUp, CreditCard, Plus, X, Search,
  Loader2, Trash2, Banknote, Smartphone, Building2, Coins,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Payment = {
  id: string;
  amount: number;
  method: string;
  description: string | null;
  paymentDate: string;
  patient: { firstName: string; lastName: string; recordNumber: string };
};

type Patient = { id: string; firstName: string; lastName: string; recordNumber: string };

const METHOD_LABELS: Record<string, string> = {
  CASH: "Efectivo", CARD_CREDIT: "T. Crédito", CARD_DEBIT: "T. Débito",
  YAPE: "Yape", PLIN: "Plin", TRANSFER: "Transferencia", OTHER: "Otro",
};

const METHOD_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  CASH: Banknote, CARD_CREDIT: CreditCard, CARD_DEBIT: CreditCard,
  YAPE: Smartphone, PLIN: Smartphone, TRANSFER: Building2, OTHER: Coins,
};

const METHOD_COLORS: Record<string, string> = {
  CASH: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  CARD_CREDIT: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  CARD_DEBIT: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  YAPE: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  PLIN: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  TRANSFER: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  OTHER: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
};

function fmt(n: number) {
  return `S/ ${n.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function FinanzasPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);

  const monthTotal = payments
    .filter(p => {
      const d = new Date(p.paymentDate);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((s, p) => s + p.amount, 0);

  const fetchPayments = useCallback(async (pg = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/payments?page=${pg}&limit=20`);
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments);
        setTotal(data.total);
        setPage(pg);
      }
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPayments(1); }, [fetchPayments]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este pago?")) return;
    await fetch(`/api/payments/${id}`, { method: "DELETE" });
    fetchPayments(page);
  };

  const pages = Math.ceil(total / 20);

  return (
    <>
      <Topbar
        title="Finanzas"
        subtitle="Registro de pagos y cobros"
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#2daa9b] text-white text-sm font-medium hover:bg-[#1e8a7d] transition-colors"
          >
            <Plus className="w-4 h-4" /> Registrar pago
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-500 dark:text-slate-400">Ingresos del mes</span>
              <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{fmt(monthTotal)}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-500 dark:text-slate-400">Total de cobros</span>
              <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                <DollarSign className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {fmt(payments.reduce((s, p) => s + p.amount, 0))}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Últimos {payments.length} registros</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-500 dark:text-slate-400">Número de cobros</span>
              <span className="p-2 rounded-xl bg-[#e8f7f6] dark:bg-teal-900/20 text-[#2daa9b]">
                <CreditCard className="w-4 h-4" />
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{total}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Total registrados</p>
          </div>
        </div>

        {/* Payments table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
            <h3 className="font-semibold text-slate-700 dark:text-slate-200">Historial de pagos</h3>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 text-[#2daa9b] animate-spin" />
            </div>
          ) : payments.length === 0 ? (
            <div className="py-16 text-center">
              <DollarSign className="w-10 h-10 mx-auto mb-2 text-slate-200 dark:text-slate-600" />
              <p className="text-sm text-slate-400 dark:text-slate-500">No hay pagos registrados</p>
              <button onClick={() => setShowModal(true)} className="mt-2 text-xs text-[#2daa9b] hover:underline">
                Registrar primer pago
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-50 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30">
                      <th className="text-left px-5 py-3 font-medium text-slate-500 dark:text-slate-400">Paciente</th>
                      <th className="text-left px-5 py-3 font-medium text-slate-500 dark:text-slate-400">Descripción</th>
                      <th className="text-left px-5 py-3 font-medium text-slate-500 dark:text-slate-400">Método</th>
                      <th className="text-left px-5 py-3 font-medium text-slate-500 dark:text-slate-400">Fecha</th>
                      <th className="text-right px-5 py-3 font-medium text-slate-500 dark:text-slate-400">Monto</th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(p => {
                      const Icon = METHOD_ICONS[p.method] ?? Coins;
                      return (
                        <tr key={p.id} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                          <td className="px-5 py-3">
                            <p className="font-medium text-slate-700 dark:text-slate-200">{p.patient.firstName} {p.patient.lastName}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">{p.patient.recordNumber}</p>
                          </td>
                          <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{p.description || "—"}</td>
                          <td className="px-5 py-3">
                            <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", METHOD_COLORS[p.method])}>
                              <Icon className="w-3 h-3" />
                              {METHOD_LABELS[p.method] ?? p.method}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-slate-500 dark:text-slate-400 text-xs">
                            {new Date(p.paymentDate).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" })}
                          </td>
                          <td className="px-5 py-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                            {fmt(p.amount)}
                          </td>
                          <td className="px-5 py-3">
                            <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg text-slate-300 dark:text-slate-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {pages > 1 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-slate-700">
                  <span className="text-xs text-slate-400 dark:text-slate-500">Página {page} de {pages}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => fetchPayments(page - 1)} disabled={page === 1}
                      className="px-3 py-1.5 rounded-lg text-xs border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => fetchPayments(page + 1)} disabled={page === pages}
                      className="px-3 py-1.5 rounded-lg text-xs border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 transition-colors"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showModal && (
        <NewPaymentModal
          onClose={() => setShowModal(false)}
          onCreated={() => { setShowModal(false); fetchPayments(1); }}
        />
      )}
    </>
  );
}

function NewPaymentModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [form, setForm] = useState({ amount: "", method: "CASH", description: "" });
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (search.length < 2) { setPatients([]); return; }
    setSearching(true);
    const t = setTimeout(async () => {
      const res = await fetch(`/api/patients?q=${encodeURIComponent(search)}&limit=5`);
      if (res.ok) { const d = await res.json(); setPatients(d.patients ?? []); }
      setSearching(false);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;
    setLoading(true);
    const res = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId: selectedPatient.id,
        amount: parseFloat(form.amount),
        method: form.method,
        description: form.description || undefined,
      }),
    });
    setLoading(false);
    if (res.ok) onCreated();
    else alert("Error al registrar pago");
  };

  const inputCls = "w-full px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2daa9b]/30 focus:border-[#2daa9b]";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">Registrar pago</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Patient search */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Paciente *</label>
            {selectedPatient ? (
              <div className="flex items-center justify-between p-3 bg-[#e8f7f6] dark:bg-[#0f3d38] rounded-xl">
                <span className="text-sm font-medium text-[#2daa9b]">{selectedPatient.firstName} {selectedPatient.lastName}</span>
                <button type="button" onClick={() => setSelectedPatient(null)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar paciente..." className={cn(inputCls, "pl-9")} />
                {searching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />}
                {patients.length > 0 && (
                  <div className="absolute top-full mt-1 left-0 right-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl shadow-lg z-10 overflow-hidden">
                    {patients.map(p => (
                      <button key={p.id} type="button" onClick={() => { setSelectedPatient(p); setSearch(""); setPatients([]); }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-b border-slate-50 dark:border-slate-700 last:border-0">
                        {p.firstName} {p.lastName} <span className="text-slate-400 text-xs">· {p.recordNumber}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Monto (S/) *</label>
              <input type="number" min="0.01" step="0.01" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required placeholder="0.00" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Método *</label>
              <select value={form.method} onChange={e => setForm(f => ({ ...f, method: e.target.value }))} className={inputCls}>
                {Object.entries(METHOD_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Descripción</label>
            <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Ej: Limpieza, Extracción..." className={inputCls} />
          </div>

          <button type="submit" disabled={loading || !selectedPatient || !form.amount}
            className="w-full py-3 rounded-xl bg-[#2daa9b] text-white font-semibold text-sm hover:bg-[#1e8a7d] disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><DollarSign className="w-4 h-4" /> Guardar pago</>}
          </button>
        </form>
      </div>
    </div>
  );
}
