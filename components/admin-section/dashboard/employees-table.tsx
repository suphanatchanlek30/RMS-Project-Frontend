import { PencilLine } from "lucide-react";
import type { EmployeeItem } from "@/services/admin.service";

interface EmployeesTableProps {
  employees: EmployeeItem[];
  onManage: (employeeId: number) => void;
}

export function EmployeesTable({ employees, onManage }: EmployeesTableProps) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-black/8 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
      <table className="min-w-full text-sm text-black">
        <thead className="bg-[#fcf4f1] text-left text-black/70">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-center">Manage</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.employeeId} className="border-t border-black/8 hover:bg-[#fcfcfc]">
              <td className="px-4 py-3">{employee.employeeId}</td>
              <td className="px-4 py-3">{employee.employeeName}</td>
              <td className="px-4 py-3">{employee.roleName}</td>
              <td className="px-4 py-3">{employee.phoneNumber}</td>
              <td className="px-4 py-3">{employee.email}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    employee.employeeStatus ? "bg-emerald-100 text-emerald-800" : "bg-zinc-200 text-zinc-700"
                  }`}
                >
                  {employee.employeeStatus ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => onManage(employee.employeeId)}
                  className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-[#fff1e8] p-2 text-[#c2410c] hover:bg-[#ffe6d5]"
                  aria-label={`Manage employee ${employee.employeeId}`}
                >
                  <PencilLine className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
