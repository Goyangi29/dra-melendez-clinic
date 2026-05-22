"use client";

import { Topbar } from "@/components/layout/topbar";
import { useState, useRef } from "react";
import {
  Upload, FileSpreadsheet, CheckCircle2, XCircle, AlertCircle,
  Download, Loader2, ChevronDown, ChevronUp, Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ParsedRow = {
  firstName: string;
  lastName: string;
  dni: string;
  birthDate: string;
  gender: "M" | "F" | "O";
  phone: string;
  email?: string;
  address?: string;
};

type ImportResult = {
  created: number;
  skipped: number;
  errors: string[];
};

function parseCSV(text: string): ParsedRow[] {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];
  // Detect separator
  const sep = lines[0].includes(";") ? ";" : ",";
  const headers = lines[0].split(sep).map(h => h.trim().toLowerCase().replace(/["']/g, ""));

  const idxOf = (...keys: string[]) => keys.map(k => headers.indexOf(k)).find(i => i >= 0) ?? -1;

  const iFirst = idxOf("firstname", "nombre", "nombres", "first_name");
  const iLast = idxOf("lastname", "apellido", "apellidos", "last_name");
  const iDni = idxOf("dni", "cedula", "rut", "documento", "id");
  const iBirth = idxOf("birthdate", "fecha_nacimiento", "nacimiento", "birth_date", "fechanacimiento");
  const iGender = idxOf("gender", "genero", "sexo");
  const iPhone = idxOf("phone", "telefono", "celular", "movil");
  const iEmail = idxOf("email", "correo");
  const iAddress = idxOf("address", "direccion", "domicilio");

  return lines.slice(1).map(line => {
    const cols = line.split(sep).map(c => c.trim().replace(/^["']|["']$/g, ""));
    const g = (cols[iGender] ?? "").toUpperCase();
    return {
      firstName: iFirst >= 0 ? cols[iFirst] : "",
      lastName: iLast >= 0 ? cols[iLast] : "",
      dni: iDni >= 0 ? cols[iDni] : "",
      birthDate: iBirth >= 0 ? cols[iBirth] : "",
      gender: (g === "M" || g === "F" ? g : "F") as "M" | "F" | "O",
      phone: iPhone >= 0 ? cols[iPhone] : "",
      email: iEmail >= 0 ? cols[iEmail] || undefined : undefined,
      address: iAddress >= 0 ? cols[iAddress] || undefined : undefined,
    };
  }).filter(r => r.firstName && r.lastName);
}

const TEMPLATE_HEADER = "firstName,lastName,dni,birthDate,gender,phone,email,address";
const TEMPLATE_ROW = "María,García,12345678,1985-03-15,F,987654321,maria@example.com,Av. Lima 123";

export default function ImportarPage() {
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setFileName(file.name);
    setResult(null);
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      setPreview(parseCSV(text));
    };
    reader.readAsText(file, "utf-8");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleImport = async () => {
    if (preview.length === 0) return;
    setImporting(true);
    try {
      const res = await fetch("/api/import/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patients: preview }),
      });
      const data = await res.json();
      setResult(data);
      setPreview([]);
      setFileName("");
    } finally { setImporting(false); }
  };

  const downloadTemplate = () => {
    const blob = new Blob([`${TEMPLATE_HEADER}\n${TEMPLATE_ROW}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "plantilla_pacientes.csv";
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <>
      <Topbar title="Importar Pacientes" subtitle="Migra tu base de datos desde Excel o CSV" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-3xl">
        {/* Instructions */}
        <div className="bg-[#e8f7f6] dark:bg-[#0a2e2b] rounded-2xl border border-[#2daa9b]/20 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#2daa9b] shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm font-semibold text-[#1e6b63] dark:text-[#2daa9b]">Cómo importar tu base de datos</p>
              <ol className="text-sm text-slate-600 dark:text-slate-300 space-y-1 list-decimal list-inside">
                <li>Descarga la plantilla CSV de abajo</li>
                <li>Abre la plantilla en Excel o Google Sheets</li>
                <li>Pega o escribe los datos de tus pacientes</li>
                <li>Guarda el archivo como <strong>CSV (separado por comas)</strong></li>
                <li>Arrastra o selecciona el archivo aquí</li>
                <li>Revisa la vista previa y haz clic en <strong>Importar</strong></li>
              </ol>
              <p className="text-xs text-slate-500 dark:text-slate-400">Máximo 500 pacientes por importación. Si tienes más, importa en varias partes.</p>
            </div>
          </div>
        </div>

        {/* Template download */}
        <button
          onClick={downloadTemplate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-[#2daa9b] hover:text-[#2daa9b] dark:hover:border-[#2daa9b] dark:hover:text-[#2daa9b] transition-colors bg-white dark:bg-slate-800"
        >
          <Download className="w-4 h-4" />
          Descargar plantilla CSV
        </button>

        {/* Drop zone */}
        {preview.length === 0 && !result && (
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={cn(
              "border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all",
              dragging
                ? "border-[#2daa9b] bg-[#e8f7f6] dark:bg-[#0f3d38]"
                : "border-slate-200 dark:border-slate-600 hover:border-[#2daa9b]/50 hover:bg-slate-50 dark:hover:bg-slate-700/50"
            )}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.txt"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
            <FileSpreadsheet className={cn("w-12 h-12 mx-auto mb-3 transition-colors", dragging ? "text-[#2daa9b]" : "text-slate-300 dark:text-slate-600")} />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              {dragging ? "Suelta el archivo aquí" : "Arrastra tu archivo CSV aquí"}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">o haz clic para seleccionar</p>
            <p className="text-xs text-slate-300 dark:text-slate-600 mt-3">Formatos aceptados: .csv, .txt</p>
          </div>
        )}

        {/* Preview */}
        {preview.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                  <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">Vista previa: {fileName}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{preview.length} paciente{preview.length !== 1 ? "s" : ""} detectado{preview.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
              <button
                onClick={() => { setPreview([]); setFileName(""); }}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Cancelar
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-50 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30">
                    <th className="px-4 py-2.5 text-left font-medium text-slate-500 dark:text-slate-400">#</th>
                    <th className="px-4 py-2.5 text-left font-medium text-slate-500 dark:text-slate-400">Nombre</th>
                    <th className="px-4 py-2.5 text-left font-medium text-slate-500 dark:text-slate-400">DNI</th>
                    <th className="px-4 py-2.5 text-left font-medium text-slate-500 dark:text-slate-400">Nacimiento</th>
                    <th className="px-4 py-2.5 text-left font-medium text-slate-500 dark:text-slate-400">Teléfono</th>
                    <th className="px-4 py-2.5 text-left font-medium text-slate-500 dark:text-slate-400">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(0, 10).map((row, i) => (
                    <tr key={i} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/20">
                      <td className="px-4 py-2.5 text-slate-400 dark:text-slate-500">{i + 1}</td>
                      <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-200">{row.firstName} {row.lastName}</td>
                      <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{row.dni}</td>
                      <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{row.birthDate}</td>
                      <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{row.phone}</td>
                      <td className="px-4 py-2.5 text-slate-400 dark:text-slate-500">{row.email || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {preview.length > 10 && (
              <p className="px-4 py-2 text-xs text-slate-400 dark:text-slate-500 border-t border-slate-50 dark:border-slate-700">
                Mostrando los primeros 10 de {preview.length} pacientes...
              </p>
            )}

            <div className="p-4 border-t border-slate-100 dark:border-slate-700">
              <button
                onClick={handleImport}
                disabled={importing}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2daa9b] text-white text-sm font-semibold hover:bg-[#1e8a7d] disabled:opacity-50 transition-colors"
              >
                {importing ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Importando...</>
                ) : (
                  <><Upload className="w-4 h-4" /> Importar {preview.length} paciente{preview.length !== 1 ? "s" : ""}</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="space-y-3">
            <div className={cn(
              "rounded-2xl border p-5 flex items-start gap-4",
              result.errors.length === 0
                ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
            )}>
              {result.errors.length === 0 ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0" />
              )}
              <div>
                <p className={cn("font-semibold", result.errors.length === 0 ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400")}>
                  {result.errors.length === 0 ? "¡Importación exitosa!" : "Importación completada con advertencias"}
                </p>
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ {result.created} creado{result.created !== 1 ? "s" : ""}
                  </span>
                  {result.skipped > 0 && (
                    <span className="text-amber-600 dark:text-amber-400 font-medium">
                      ⚠ {result.skipped} omitido{result.skipped !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                <button
                  onClick={() => setShowErrors(!showErrors)}
                  className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    Ver {result.errors.length} error{result.errors.length !== 1 ? "es" : ""}
                  </span>
                  {showErrors ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {showErrors && (
                  <div className="px-5 pb-4 space-y-1 max-h-48 overflow-y-auto">
                    {result.errors.map((e, i) => (
                      <p key={i} className="text-xs text-red-500 dark:text-red-400 py-1 border-b border-slate-50 dark:border-slate-700 last:border-0">{e}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => { setResult(null); }}
              className="text-sm text-[#2daa9b] hover:underline"
            >
              Importar más pacientes
            </button>
          </div>
        )}

        {/* Column reference */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5">
          <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-4">Referencia de columnas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { col: "firstName", desc: "Nombre(s)", req: true },
              { col: "lastName", desc: "Apellido(s)", req: true },
              { col: "dni", desc: "DNI / Documento", req: true },
              { col: "birthDate", desc: "Fecha nacimiento (YYYY-MM-DD)", req: true },
              { col: "phone", desc: "Teléfono / Celular", req: true },
              { col: "gender", desc: "Género (M / F / O)", req: false },
              { col: "email", desc: "Correo electrónico", req: false },
              { col: "address", desc: "Dirección", req: false },
            ].map(item => (
              <div key={item.col} className="flex items-start gap-2 py-2 border-b border-slate-50 dark:border-slate-700 last:border-0">
                <code className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[#2daa9b] shrink-0">{item.col}</code>
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{item.desc}</p>
                  {item.req ? (
                    <span className="text-xs text-red-500">Requerido</span>
                  ) : (
                    <span className="text-xs text-slate-400">Opcional</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
