import type { ComponentType } from "react";
import { LayoutDashboard, ShieldCheck, Users, UserRoundPlus, ListChecks, LogOut, X, Table2, BookType, UtensilsCrossed, ChartColumnBig, CreditCard, Receipt } from "lucide-react";

export type AdminTab =
  | "overview"
  | "roles"
  | "employees"
  | "create"
  | "detail"
  | "tables"
  | "categories"
  | "menus"
  | "reports"
  | "payments"
  | "receipts";

const TAB_ITEMS: Array<{ id: AdminTab; label: string; icon: ComponentType<{ className?: string }> }> = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "roles", label: "Roles", icon: ShieldCheck },
  { id: "employees", label: "Employees", icon: Users },
  { id: "create", label: "Create Employee", icon: UserRoundPlus },
  { id: "detail", label: "Manage By ID", icon: ListChecks },
  { id: "tables", label: "Tables", icon: Table2 },
  { id: "categories", label: "Categories", icon: BookType },
  { id: "menus", label: "Menus", icon: UtensilsCrossed },
  { id: "reports", label: "Reports", icon: ChartColumnBig },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "receipts", label: "Receipts", icon: Receipt },
];

interface AdminSidebarProps {
  isOpen: boolean;
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onClose: () => void;
  onLogout: () => void;
}

export function AdminSidebar({ isOpen, activeTab, onTabChange, onClose, onLogout }: AdminSidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-black/8 bg-[#fcfcfc] p-4 transition-transform duration-300 lg:static lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#f89110]">RMS POS</p>
          <h1 className="text-xl font-black text-[#171717]">Dreams Admin</h1>
        </div>
        <button className="rounded-lg p-2 hover:bg-black/5 lg:hidden" onClick={onClose}>
          <X className="h-5 w-5 text-black" />
        </button>
      </div>

      <div className="mb-6 rounded-2xl bg-[#171717] p-4 text-white">
        <p className="text-xs uppercase tracking-[0.2em] text-white/55">Main</p>
        <p className="mt-2 text-sm font-medium">Control staff, roles and store access</p>
      </div>

      <nav className="space-y-2">
        {TAB_ITEMS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id);
                onClose();
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-all ${
                isActive
                  ? "bg-[#fff1e8] text-[#c2410c] shadow-[0_8px_20px_rgba(194,65,12,0.12)]"
                  : "text-black/70 hover:bg-black/5 hover:text-black"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <button
        onClick={onLogout}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-900 transition hover:bg-red-50"
      >
        <LogOut className="h-4 w-4" />
        ออกจากระบบ
      </button>
    </aside>
  );
}
