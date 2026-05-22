import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { z } from "zod";

const CreateSchema = z.object({
  patientId: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  treatment: z.string().optional(),
  notes: z.string().optional(),
  colorTag: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    const clinicFilter = authUser?.clinicId ? { clinicId: authUser.clinicId } : {};
    const { searchParams } = req.nextUrl;
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const appointments = await prisma.appointment.findMany({
      where: {
        ...clinicFilter,
        startTime: {
          gte: from ? new Date(from) : undefined,
          lte: to ? new Date(to) : undefined,
        },
      },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true, phone: true } },
        doctor: { select: { id: true, name: true } },
      },
      orderBy: { startTime: "asc" },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("[GET /api/appointments]", error);
    return NextResponse.json({ error: "Error al obtener citas" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    const body = await req.json();
    const data = CreateSchema.parse(body);

    // Default doctor: the authenticated user
    const doctorId = authUser?.id;
    if (!doctorId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: data.patientId,
        doctorId,
        clinicId: authUser?.clinicId ?? null,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        treatment: data.treatment ?? null,
        notes: data.notes ?? null,
        colorTag: data.colorTag ?? null,
        status: "PENDING",
      },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
        doctor: { select: { name: true } },
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("[POST /api/appointments]", error);
    return NextResponse.json({ error: "Error al crear cita" }, { status: 500 });
  }
}
