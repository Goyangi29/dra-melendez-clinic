import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { z } from "zod";

const UpdateSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  email: z.string().email().optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
});

export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser?.clinicId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const clinic = await prisma.clinic.findUnique({
      where: { id: authUser.clinicId },
    });

    return NextResponse.json(clinic);
  } catch (error) {
    console.error("[GET /api/clinic]", error);
    return NextResponse.json({ error: "Error al obtener clínica" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser?.clinicId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const data = UpdateSchema.parse(body);

    const clinic = await prisma.clinic.update({
      where: { id: authUser.clinicId },
      data,
    });

    return NextResponse.json(clinic);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("[PATCH /api/clinic]", error);
    return NextResponse.json({ error: "Error al actualizar clínica" }, { status: 500 });
  }
}
