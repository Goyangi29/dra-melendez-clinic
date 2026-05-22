import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { z } from "zod";

const PatchSchema = z.object({
  status: z.enum(["PENDING","CONFIRMED","IN_WAITING_ROOM","IN_PROGRESS","COMPLETED","CANCELLED","NO_SHOW"]).optional(),
  treatment: z.string().optional(),
  notes: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = PatchSchema.parse(body);

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        ...data,
        startTime: data.startTime ? new Date(data.startTime) : undefined,
        endTime: data.endTime ? new Date(data.endTime) : undefined,
      },
      include: {
        patient: { select: { firstName: true, lastName: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("[PATCH /api/appointments/[id]]", error);
    return NextResponse.json({ error: "Error al actualizar cita" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.appointment.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/appointments/[id]]", error);
    return NextResponse.json({ error: "Error al eliminar cita" }, { status: 500 });
  }
}
