import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const CreatePatientSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  dni: z.string().min(8).max(12),
  birthDate: z.string(),
  gender: z.enum(["M", "F", "O"]),
  phone: z.string().min(7),
  whatsapp: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const search = searchParams.get("q") ?? "";
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 20);

    const where = search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" as const } },
            { lastName: { contains: search, mode: "insensitive" as const } },
            { dni: { contains: search } },
            { recordNumber: { contains: search } },
          ],
          isActive: true,
        }
      : { isActive: true };

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          recordNumber: true,
          firstName: true,
          lastName: true,
          dni: true,
          phone: true,
          birthDate: true,
          loyaltyPoints: true,
          appointments: {
            where: { status: { in: ["PENDING", "CONFIRMED"] } },
            orderBy: { startTime: "asc" },
            take: 1,
            select: { startTime: true },
          },
          clinicalNotes: {
            orderBy: { noteDate: "desc" },
            take: 1,
            select: { noteDate: true },
          },
        },
      }),
      prisma.patient.count({ where }),
    ]);

    return NextResponse.json({ patients, total, page, limit });
  } catch (error) {
    console.error("[GET /api/patients]", error);
    return NextResponse.json({ error: "Error al obtener pacientes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = CreatePatientSchema.parse(body);

    const year = new Date().getFullYear();
    const count = await prisma.patient.count();
    const recordNumber = `HC-${year}-${String(count + 1).padStart(4, "0")}`;

    const patient = await prisma.patient.create({
      data: {
        ...data,
        birthDate: new Date(data.birthDate),
        email: data.email || null,
        recordNumber,
        medicalHistory: { create: {} },
        odontogram: { create: { type: "ADULT" } },
      },
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("[POST /api/patients]", error);
    return NextResponse.json({ error: "Error al crear paciente" }, { status: 500 });
  }
}
