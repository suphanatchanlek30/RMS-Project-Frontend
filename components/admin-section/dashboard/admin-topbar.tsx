import { Bell, CalendarDays, Menu, RefreshCw, Search, Settings } from "lucide-react";

interface AdminTopbarProps {
  title: string;
  isRefreshing: boolean;
  onOpenSidebar: () => void;
  onRefresh: () => void;
}

export function AdminTopbar({ title, isRefreshing, onOpenSidebar, onRefresh }: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-black/8 bg-[#fcfcfc]/95 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button className="rounded-lg p-2 hover:bg-black/5 lg:hidden" onClick={onOpenSidebar}>
            <Menu className="h-5 w-5 text-black" />
          </button>
          <div className="hidden rounded-2xl border border-black/8 bg-white px-3 py-2 md:flex md:min-w-65 md:items-center md:gap-2">
            <Search className="h-4 w-4 text-black/40" />
            <input
              readOnly
              value="Search admin data"
              className="w-full bg-transparent text-sm text-black/45 outline-none"
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-red-700/70">Dashboard</p>
            <h2 className="truncate text-lg font-semibold text-black">{title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-2xl border border-black/8 bg-white px-3 py-2 text-xs text-black/65 md:flex">
            <CalendarDays className="h-4 w-4" />
            <span>Today</span>
          </div>
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 rounded-xl border border-black/8 bg-white px-3 py-2 text-xs font-medium text-black hover:bg-black/5"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button className="rounded-xl border border-black/8 bg-white p-2 hover:bg-black/5">
            <Bell className="h-4 w-4 text-black/70" />
          </button>
          <button className="rounded-xl border border-black/8 bg-white p-2 hover:bg-black/5">
            <Settings className="h-4 w-4 text-black/70" />
          </button>
          <div className="flex items-center gap-2 rounded-2xl border border-black/8 bg-white px-2 py-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#171717] text-xs font-bold text-white">A</div>
          </div>
        </div>
      </div>
    </header>
  );
}
