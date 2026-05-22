import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { z } from "zod";

const PatientRowSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dni: z.string().min(5).max(15),
  birthDate: z.string(),
  gender: z.enum(["M", "F", "O"]).default("F"),
  phone: z.string().min(6),
  email: z.string().email().optional().or(z.literal("")).or(z.undefined()),
  address: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    const body = await req.json();

    if (!Array.isArray(body.patients) || body.patients.length === 0) {
      return NextResponse.json({ error: "Se requiere un array de pacientes" }, { status: 400 });
    }

    if (body.patients.length > 500) {
      return NextResponse.json({ error: "Máximo 500 pacientes por importación" }, { status: 400 });
    }

    const year = new Date().getFullYear();
    const clinicFilter = authUser?.clinicId ? { clinicId: authUser.clinicId } : {};
    const existingCount = await prisma.patient.count({ where: clinicFilter });

    const results = { created: 0, skipped: 0, errors: [] as string[] };

    for (let i = 0; i < body.patients.length; i++) {
      try {
        const row = PatientRowSchema.parse(body.patients[i]);
        const recordNumber = `HC-${year}-${String(existingCount + results.created + 1).padStart(4, "0")}`;

        await prisma.patient.create({
          data: {
            firstName: row.firstName,
            lastName: row.lastName,
            dni: row.dni,
            birthDate: new Date(row.birthDate),
            gender: row.gender,
            phone: row.phone,
            email: row.email || null,
            address: row.address || null,
            recordNumber,
            clinicId: authUser?.clinicId ?? null,
            medicalHistory: { create: {} },
            odontogram: { create: { type: "ADULT" } },
          },
        });
        results.created++;
      } catch (e) {
        results.skipped++;
        results.errors.push(`Fila ${i + 1}: ${e instanceof Error ? e.message : "error desconocido"}`);
      }
    }

    return NextResponse.json(results, { status: 201 });
  } catch (error) {
    console.error("[POST /api/import/patients]", error);
    return NextResponse.json({ error: "Error al importar pacientes" }, { status: 500 });
  }
}
