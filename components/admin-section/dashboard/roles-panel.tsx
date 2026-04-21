import type { RoleItem } from "@/services/admin.service";

interface RolesPanelProps {
  roles: RoleItem[];
}

export function RolesPanel({ roles }: RolesPanelProps) {
  return (
    <section className="rounded-3xl border border-black/8 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#171717]">Roles</h3>
          <p className="text-sm text-black/55">รายการสิทธิ์ทั้งหมดจากระบบ</p>
        </div>
        <span className="rounded-full bg-[#f3f4f6] px-3 py-1 text-xs font-semibold text-black/70">{roles.length} items</span>
      </div>

      <div className="space-y-3">
        {roles.map((role) => (
          <article key={role.roleId} className="flex items-center justify-between rounded-2xl bg-[#fafafa] px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-[#171717]">{role.roleName}</p>
              <p className="text-xs text-black/45">Role ID #{role.roleId}</p>
            </div>
            <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-800">ACTIVE</span>
          </article>
        ))}
      </div>
    </section>
  );
}
