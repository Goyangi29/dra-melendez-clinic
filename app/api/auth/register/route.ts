import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const Schema = z.object({
  supabaseId: z.string(),
  email: z.string().email(),
  name: z.string().min(2),
  clinicName: z.string().min(2),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = Schema.parse(body);

    const slug = data.clinicName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) + "-" + Date.now().toString(36);

    const result = await prisma.$transaction(async (tx) => {
      const clinic = await tx.clinic.create({
        data: {
          name: data.clinicName,
          slug,
          email: data.email,
          plan: "starter",
        },
      });

      const user = await tx.user.create({
        data: {
          supabaseId: data.supabaseId,
          email: data.email,
          name: data.name,
          role: "ADMIN",
          clinicId: clinic.id,
        },
      });

      return { clinic, user };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("[POST /api/auth/register]", error);
    return NextResponse.json({ error: "Error al registrar" }, { status: 500 });
  }
}
