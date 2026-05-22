import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const CreateNoteSchema = z.object({
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  observations: z.string().optional(),
  toothNumber: z.string().optional(),
  amount: z.number().optional().nullable(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = CreateNoteSchema.parse(body);

    const note = await prisma.clinicalNote.create({
      data: {
        patientId: id,
        noteDate: new Date(),
        diagnosis: data.diagnosis || null,
        treatment: data.treatment || null,
        observations: data.observations || null,
        toothNumber: data.toothNumber || null,
        amount: data.amount ?? null,
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("[POST /api/patients/[id]/notes]", error);
    return NextResponse.json({ error: "Error al guardar evolución" }, { status: 500 });
  }
}
