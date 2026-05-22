import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const Schema = z.object({
  supabaseId: z.string(),
  email: z.string().email(),
  name: z.string().min(2),
  clinicName: z.string().min(2),
});

function makeSlug(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[áàäâ]/g, "a")
      .replace(/[éèëê]/g, "e")
      .replace(/[íìïî]/g, "i")
      .replace(/[óòöô]/g, "o")
      .replace(/[úùüû]/g, "u")
      .replace(/ñ/g, "n")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 30) +
    "-" +
    Date.now().toString(36)
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = Schema.parse(body);

    // Si el usuario ya existe, devolver sus datos
    const existingUser = await prisma.user.findUnique({
      where: { supabaseId: data.supabaseId },
      include: { clinic: true },
    });
    if (existingUser) {
      return NextResponse.json({ user: existingUser, clinic: existingUser.clinic });
    }

    const slug = makeSlug(data.clinicName);

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
    return NextResponse.json(
      { error: "Error al registrar", detail: String(error) },
      { status: 500 }
    );
  }
}
