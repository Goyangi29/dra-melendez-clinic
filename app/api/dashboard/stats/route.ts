import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    const authUser = await getAuthUser();
    const clinicFilter = authUser?.clinicId ? { clinicId: authUser.clinicId } : {};

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalPatients,
      newPatientsThisMonth,
      newPatientsLastMonth,
      appointmentsToday,
      appointmentsPending,
      paymentsThisMonth,
      paymentsLastMonth,
      recentPatients,
      upcomingAppointments,
    ] = await Promise.all([
      // Total pacientes
      prisma.patient.count({ where: { ...clinicFilter, isActive: true } }),

      // Nuevos este mes
      prisma.patient.count({
        where: { ...clinicFilter, isActive: true, createdAt: { gte: startOfMonth } },
      }),

      // Nuevos mes pasado
      prisma.patient.count({
        where: { ...clinicFilter, isActive: true, createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
      }),

      // Citas hoy
      prisma.appointment.count({
        where: { ...clinicFilter, startTime: { gte: today, lt: tomorrow } },
      }),

      // Citas pendientes confirmadas
      prisma.appointment.count({
        where: { ...clinicFilter, status: { in: ["PENDING", "CONFIRMED"] }, startTime: { gte: now } },
      }),

      // Ingresos este mes (todos los pagos registrados)
      prisma.payment.aggregate({
        where: { ...clinicFilter, paymentDate: { gte: startOfMonth } },
        _sum: { amount: true },
      }),

      // Ingresos mes pasado
      prisma.payment.aggregate({
        where: { ...clinicFilter, paymentDate: { gte: startOfLastMonth, lte: endOfLastMonth } },
        _sum: { amount: true },
      }),

      // Últimos 5 pacientes
      prisma.patient.findMany({
        where: { ...clinicFilter, isActive: true },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, firstName: true, lastName: true, createdAt: true, recordNumber: true },
      }),

      // Próximas citas
      prisma.appointment.findMany({
        where: { ...clinicFilter, status: { in: ["PENDING", "CONFIRMED"] }, startTime: { gte: now } },
        orderBy: { startTime: "asc" },
        take: 5,
        select: {
          id: true,
          startTime: true,
          status: true,
          treatment: true,
          patient: { select: { firstName: true, lastName: true } },
        },
      }),
    ]);

    const revenueThisMonth = paymentsThisMonth._sum.amount ?? 0;
    const revenueLastMonth = paymentsLastMonth._sum.amount ?? 0;

    const patientsGrowth = newPatientsLastMonth > 0
      ? (((newPatientsThisMonth - newPatientsLastMonth) / newPatientsLastMonth) * 100).toFixed(1)
      : newPatientsThisMonth > 0 ? "100" : "0";

    const revenueGrowth = revenueLastMonth > 0
      ? (((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100).toFixed(1)
      : revenueThisMonth > 0 ? "100" : "0";

    return NextResponse.json({
      totalPatients,
      newPatientsThisMonth,
      patientsGrowth,
      appointmentsToday,
      appointmentsPending,
      revenueThisMonth,
      revenueGrowth,
      recentPatients,
      upcomingAppointments,
    });
  } catch (error) {
    console.error("[GET /api/dashboard/stats]", error);
    return NextResponse.json({ error: "Error al obtener estadísticas" }, { status: 500 });
  }
}
