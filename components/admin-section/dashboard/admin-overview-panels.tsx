import { BadgeDollarSign, ShieldCheck, TrendingUp, Users } from "lucide-react";
import type { DashboardSummary } from "@/services/admin.service";

interface AdminOverviewPanelsProps {
  totalEmployees: number;
  totalRoles: number;
  activeEmployees: number;
  inactiveEmployees: number;
  dashboardSummary?: DashboardSummary;
}

export function AdminOverviewPanels({
  totalEmployees,
  totalRoles,
  activeEmployees,
  inactiveEmployees,
  dashboardSummary,
}: AdminOverviewPanelsProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr_1fr]">
      <section className="rounded-3xl border border-black/8 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
        <p className="text-sm font-medium text-[#c55b16]">Weekly Admin Snapshot</p>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-4xl font-black tracking-tight text-[#171717]">
              {dashboardSummary ? dashboardSummary.todaySales.toLocaleString("en-US") : totalEmployees}
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm text-emerald-700">
              <TrendingUp className="h-4 w-4" />
              {dashboardSummary ? `${dashboardSummary.todayOrders} orders today` : `${activeEmployees} active employees in system`}
            </p>
          </div>
          <div className="rounded-2xl bg-[#fff4e8] p-4 text-[#c55b16]">
            <BadgeDollarSign className="h-10 w-10" />
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-[#f89110] p-5 text-white shadow-[0_12px_30px_rgba(248,145,16,0.22)]">
        <div className="flex items-center justify-between">
          <Users className="h-8 w-8" />
          <span className="text-xs font-medium text-white/80">Tables</span>
        </div>
        <p className="mt-8 text-3xl font-black">{dashboardSummary?.occupiedTables ?? totalEmployees}</p>
        <p className="mt-1 text-sm text-white/90">
          {dashboardSummary ? `${dashboardSummary.availableTables} available tables` : "Total staff records"}
        </p>
      </section>

      <section className="rounded-3xl bg-[#132f4d] p-5 text-white shadow-[0_12px_30px_rgba(19,47,77,0.22)]">
        <div className="flex items-center justify-between">
          <ShieldCheck className="h-8 w-8" />
          <span className="text-xs font-medium text-white/80">Top Menu</span>
        </div>
        <p className="mt-8 text-3xl font-black">{dashboardSummary?.topMenu?.totalSold ?? totalRoles}</p>
        <p className="mt-1 text-sm text-white/85">
          {dashboardSummary?.topMenu?.menuName ?? `${inactiveEmployees} inactive employees`}
        </p>
      </section>
    </div>
  );
}
