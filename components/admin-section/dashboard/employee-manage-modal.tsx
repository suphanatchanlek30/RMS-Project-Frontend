import type { FormEvent } from "react";
import { X } from "lucide-react";
import type { EmployeeItem, RoleItem, UpdateEmployeePayload } from "@/services/admin.service";

interface EmployeeManageModalProps {
  isOpen: boolean;
  selectedEmployee: EmployeeItem | null;
  updatePayload: UpdateEmployeePayload;
  nextEmployeeStatus: boolean;
  roles: RoleItem[];
  onClose: () => void;
  onUpdatePayloadChange: (payload: UpdateEmployeePayload) => void;
  onSubmitUpdate: (event: FormEvent<HTMLFormElement>) => void;
  onToggleStatus: () => void;
}

export function EmployeeManageModal({
  isOpen,
  selectedEmployee,
  updatePayload,
  nextEmployeeStatus,
  roles,
  onClose,
  onUpdatePayloadChange,
  onSubmitUpdate,
  onToggleStatus,
}: EmployeeManageModalProps) {
  if (!isOpen || !selectedEmployee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-2xl rounded-3xl border border-black/8 bg-white p-5 shadow-[0_30px_80px_rgba(0,0,0,0.22)]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#c2410c]/80">Manage Employee ID #{selectedEmployee.employeeId}</p>
            <h3 className="text-lg font-semibold text-[#171717]">แก้ไขข้อมูลพนักงาน</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-black/5">
            <X className="h-5 w-5 text-black" />
          </button>
        </div>

        <form onSubmit={onSubmitUpdate} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-black/70">Employee Name</label>
            <input
              value={updatePayload.employeeName ?? ""}
              onChange={(event) =>
                onUpdatePayloadChange({
                  ...updatePayload,
                  employeeName: event.target.value,
                })
              }
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-black outline-none focus:border-red-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-black/70">Phone Number</label>
            <input
              value={updatePayload.phoneNumber ?? ""}
              onChange={(event) =>
                onUpdatePayloadChange({
                  ...updatePayload,
                  phoneNumber: event.target.value,
                })
              }
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-black outline-none focus:border-red-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-xs text-black/70">Role</label>
            <select
              value={updatePayload.roleId ?? selectedEmployee.roleId}
              onChange={(event) =>
                onUpdatePayloadChange({
                  ...updatePayload,
                  roleId: Number(event.target.value),
                })
              }
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-black outline-none focus:border-red-400"
            >
              {roles.map((role) => (
                <option key={role.roleId} value={role.roleId}>
                  {role.roleName}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-2 pt-2">
            <button type="submit" className="rounded-xl bg-[#171717] px-4 py-2 text-sm font-semibold text-white hover:bg-black">
              บันทึกข้อมูล
            </button>
            <button
              type="button"
              onClick={onToggleStatus}
              className="rounded-xl border border-red-200 bg-[#fff1e8] px-4 py-2 text-sm font-semibold text-[#c2410c] hover:bg-[#ffe6d5]"
            >
              เปลี่ยนสถานะเป็น {nextEmployeeStatus ? "Active" : "Inactive"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
