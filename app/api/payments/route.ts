import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { z } from "zod";

const CreateSchema = z.object({
  patientId: z.string(),
  amount: z.number().positive(),
  method: z.enum(["CASH","CARD_CREDIT","CARD_DEBIT","YAPE","PLIN","TRANSFER","OTHER"]),
  description: z.string().optional(),
  reference: z.string().optional(),
  paymentDate: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    const clinicFilter = authUser?.clinicId ? { clinicId: authUser.clinicId } : {};
    const { searchParams } = req.nextUrl;
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 20);
    const patientId = searchParams.get("patientId");

    const where = {
      ...clinicFilter,
      ...(patientId ? { patientId } : {}),
    };

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { paymentDate: "desc" },
        include: {
          patient: { select: { firstName: true, lastName: true, recordNumber: true } },
        },
      }),
      prisma.payment.count({ where }),
    ]);

    return NextResponse.json({ payments, total, page, limit });
  } catch (error) {
    console.error("[GET /api/payments]", error);
    return NextResponse.json({ error: "Error al obtener pagos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    const body = await req.json();
    const data = CreateSchema.parse(body);

    const payment = await prisma.payment.create({
      data: {
        patientId: data.patientId,
        amount: data.amount,
        method: data.method as any,
        description: data.description ?? null,
        reference: data.reference ?? null,
        paymentDate: data.paymentDate ? new Date(data.paymentDate) : new Date(),
        clinicId: authUser?.clinicId ?? null,
      },
      include: {
        patient: { select: { firstName: true, lastName: true } },
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("[POST /api/payments]", error);
    return NextResponse.json({ error: "Error al registrar pago" }, { status: 500 });
  }
}
