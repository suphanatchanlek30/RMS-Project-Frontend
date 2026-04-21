import type { EmployeeItem } from "@/services/admin.service";

interface EmployeesSummaryPanelProps {
  employees: EmployeeItem[];
  onManage: (employeeId: number) => void;
}

export function EmployeesSummaryPanel({ employees, onManage }: EmployeesSummaryPanelProps) {
  return (
    <section className="rounded-3xl border border-black/8 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#171717]">Recent Employees</h3>
          <p className="text-sm text-black/55">คลิก Manage เพื่อเปิด popup จัดการ</p>
        </div>
      </div>

      <div className="space-y-3">
        {employees.slice(0, 6).map((employee) => (
          <article key={employee.employeeId} className="flex items-center justify-between rounded-2xl bg-[#fafafa] px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-[#171717]">{employee.employeeName}</p>
              <p className="text-xs text-black/45">{employee.roleName} · {employee.email}</p>
            </div>
            <button
              onClick={() => onManage(employee.employeeId)}
              className="rounded-xl bg-[#171717] px-3 py-2 text-xs font-semibold text-white hover:bg-black"
            >
              Manage
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
