import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const CreateAppointmentSchema = z.object({
  patientId: z.string(),
  doctorId: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  treatment: z.string().optional(),
  notes: z.string().optional(),
  colorTag: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const appointments = await prisma.appointment.findMany({
      where: {
        startTime: {
          gte: from ? new Date(from) : undefined,
          lte: to ? new Date(to) : undefined,
        },
      },
      include: {
        patient: { select: { firstName: true, lastName: true, phone: true } },
        doctor: { select: { name: true } },
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
    const body = await req.json();
    const data = CreateAppointmentSchema.parse(body);

    const appointment = await prisma.appointment.create({
      data: {
        ...data,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
      },
      include: {
        patient: { select: { firstName: true, lastName: true } },
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
