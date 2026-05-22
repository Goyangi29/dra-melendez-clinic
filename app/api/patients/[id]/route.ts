import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const UpdatePatientSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().min(7).optional(),
  whatsapp: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        medicalHistory: true,
        appointments: {
          orderBy: { startTime: "desc" },
          take: 20,
          include: { doctor: { select: { name: true } } },
        },
        clinicalNotes: {
          orderBy: { noteDate: "desc" },
        },
        quotes: {
          orderBy: { createdAt: "desc" },
          include: { items: true },
        },
        payments: {
          orderBy: { paymentDate: "desc" },
        },
        consents: {
          orderBy: { signedAt: "desc" },
        },
      },
    });

    if (!patient) {
      return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error("[GET /api/patients/[id]]", error);
    return NextResponse.json({ error: "Error al obtener paciente" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = UpdatePatientSchema.parse(body);

    const patient = await prisma.patient.update({
      where: { id },
      data: { ...data, email: data.email || null },
    });

    return NextResponse.json(patient);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("[PATCH /api/patients/[id]]", error);
    return NextResponse.json({ error: "Error al actualizar paciente" }, { status: 500 });
  }
}
