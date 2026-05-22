import { Sidebar } from "@/components/layout/sidebar";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let clinicName = "Mi Clínica";
  let userName = "";
  let userRole = "ADMIN";

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const dbUser = await prisma.user.findUnique({
        where: { supabaseId: user.id },
        include: { clinic: { select: { name: true } } },
      });
      if (dbUser) {
        userName = dbUser.name;
        userRole = dbUser.role;
        if (dbUser.clinic) clinicName = dbUser.clinic.name;
      }
    }
  } catch (err) {
    // Don't crash the layout if DB is unavailable — render with defaults
    console.error("[DashboardLayout] DB error:", err);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <Sidebar clinicName={clinicName} userName={userName} userRole={userRole} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
