"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { adminService, type CreateEmployeePayload, type EmployeeItem, type EmployeeQueryParams, type RoleItem, type UpdateEmployeePayload } from "@/services/admin.service";
import { AdminSidebar, type AdminTab } from "./dashboard/admin-sidebar";
import { AdminTopbar } from "./dashboard/admin-topbar";
import { EmployeesTable } from "./dashboard/employees-table";
import { EmployeeManageModal } from "./dashboard/employee-manage-modal";
import { AdminOverviewPanels } from "./dashboard/admin-overview-panels";
import { RolesPanel } from "./dashboard/roles-panel";
import { EmployeesSummaryPanel } from "./dashboard/employees-summary-panel";

const initialCreatePayload: CreateEmployeePayload = {
  employeeName: "",
  roleId: 2,
  phoneNumber: "",
  email: "",
  hireDate: "",
  password: "",
};

const initialUpdatePayload: UpdateEmployeePayload = {
  employeeName: "",
  phoneNumber: "",
  roleId: 2,
};

const tabTitleMap: Record<AdminTab, string> = {
  overview: "Admin Overview",
  roles: "Roles",
  employees: "Employees",
  create: "Create Employee",
  detail: "Manage By ID",
};

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBootLoading, setIsBootLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [totalEmployees, setTotalEmployees] = useState(0);

  const [apiMessage, setApiMessage] = useState("");
  const [apiError, setApiError] = useState("");

  const [employeeQuery, setEmployeeQuery] = useState<EmployeeQueryParams>({
    page: 1,
    limit: 10,
    search: "",
  });

  const [createPayload, setCreatePayload] = useState<CreateEmployeePayload>(initialCreatePayload);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeItem | null>(null);
  const [updatePayload, setUpdatePayload] = useState<UpdateEmployeePayload>(initialUpdatePayload);
  const [nextEmployeeStatus, setNextEmployeeStatus] = useState<boolean>(true);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const clearAlerts = () => {
    setApiMessage("");
    setApiError("");
  };

  const requireAdminToken = () => {
    if (typeof window === "undefined") return true;

    const token = localStorage.getItem("adminToken");
    if (!token) {
      window.location.href = "/auth";
      return false;
    }

    return true;
  };

  const loadRoles = async () => {
    const roleResult = await adminService.getRoles();
    if (!roleResult.success) {
      setApiError(roleResult.message);
      return [] as RoleItem[];
    }

    setRoles(roleResult.data);
    return roleResult.data;
  };

  const loadEmployees = async (params: EmployeeQueryParams) => {
    const employeeResult = await adminService.getEmployees(params);
    if (!employeeResult.success) {
      setApiError(employeeResult.message);
      return;
    }

    setEmployees(employeeResult.data.items);
    setTotalEmployees(employeeResult.data.pagination.total);
  };

  const bootstrap = async () => {
    if (!requireAdminToken()) return;

    setIsBootLoading(true);
    clearAlerts();

    const loadedRoles = await loadRoles();
    await loadEmployees(employeeQuery);

    if (loadedRoles.length > 0) {
      setCreatePayload((prev) => ({ ...prev, roleId: loadedRoles[0].roleId }));
      setUpdatePayload((prev) => ({ ...prev, roleId: loadedRoles[0].roleId }));
    }

    setIsBootLoading(false);
  };

  useEffect(() => {
    void bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    clearAlerts();
    await Promise.all([loadRoles(), loadEmployees(employeeQuery)]);
    setApiMessage("รีเฟรชข้อมูลสำเร็จ");
    setIsRefreshing(false);
  };

  const handleSearchSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearAlerts();
    const nextQuery = { ...employeeQuery, page: 1 };
    setEmployeeQuery(nextQuery);
    await loadEmployees(nextQuery);
  };

  const handleCreateEmployee = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearAlerts();

    const result = await adminService.createEmployee(createPayload);
    if (!result.success) {
      setApiError(result.message);
      return;
    }

    setApiMessage(result.message);
    setCreatePayload((prev) => ({ ...initialCreatePayload, roleId: prev.roleId }));
    await loadEmployees(employeeQuery);
    setActiveTab("employees");
  };

  const applySelectedEmployee = (employee: EmployeeItem) => {
    setSelectedEmployee(employee);
    setSelectedEmployeeId(String(employee.employeeId));
    setUpdatePayload({
      employeeName: employee.employeeName,
      phoneNumber: employee.phoneNumber,
      roleId: employee.roleId,
    });
    setNextEmployeeStatus(!employee.employeeStatus);
  };

  const loadEmployeeById = async (employeeId: number) => {
    clearAlerts();

    const result = await adminService.getEmployeeById(employeeId);
    if (!result.success || !result.data) {
      setApiError(result.message);
      return;
    }

    applySelectedEmployee(result.data);
    setApiMessage(result.message);
  };

  const handleGetEmployeeById = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const numericId = Number(selectedEmployeeId);
    if (!numericId) {
      setApiError("กรุณากรอก employeeId ให้ถูกต้อง");
      return;
    }

    await loadEmployeeById(numericId);
    setIsManageModalOpen(true);
  };

  const handleOpenManageModalByRow = async (employeeId: number) => {
    await loadEmployeeById(employeeId);
    setIsManageModalOpen(true);
  };

  const handleUpdateEmployee = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearAlerts();

    if (!selectedEmployee) {
      setApiError("กรุณาเลือกพนักงานก่อนอัปเดต");
      return;
    }

    const result = await adminService.updateEmployeeById(selectedEmployee.employeeId, updatePayload);
    if (!result.success || !result.data) {
      setApiError(result.message);
      return;
    }

    applySelectedEmployee(result.data);
    setApiMessage(result.message);
    await loadEmployees(employeeQuery);
  };

  const handleUpdateEmployeeStatus = async () => {
    clearAlerts();

    if (!selectedEmployee) {
      setApiError("กรุณาเลือกพนักงานก่อนเปลี่ยนสถานะ");
      return;
    }

    const result = await adminService.updateEmployeeStatusById(selectedEmployee.employeeId, {
      employeeStatus: nextEmployeeStatus,
    });

    if (!result.success || !result.data) {
      setApiError(result.message);
      return;
    }

    await loadEmployeeById(selectedEmployee.employeeId);
    setApiMessage(result.message);
    await loadEmployees(employeeQuery);
  };

  const handleLogout = async () => {
    await adminService.logout();
    window.location.href = "/auth";
  };

  const totalPages = useMemo(() => {
    const limit = employeeQuery.limit ?? 10;
    return Math.max(1, Math.ceil(totalEmployees / limit));
  }, [employeeQuery.limit, totalEmployees]);

  const activeEmployees = useMemo(() => employees.filter((employee) => employee.employeeStatus).length, [employees]);
  const inactiveEmployees = useMemo(() => employees.filter((employee) => !employee.employeeStatus).length, [employees]);

  if (isBootLoading) {
    return (
      <main className="min-h-dvh bg-[#f7f7f7] text-black flex items-center justify-center">
        <p className="text-base font-medium">กาลังโหลด dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-[#f7f7f7] text-black">
      <div className="grid min-h-dvh w-full lg:grid-cols-[288px_minmax(0,1fr)]">
        <AdminSidebar
          isOpen={isSidebarOpen}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onClose={() => setIsSidebarOpen(false)}
          onLogout={handleLogout}
        />

        <div className="min-w-0">
          <AdminTopbar
            title={tabTitleMap[activeTab]}
            isRefreshing={isRefreshing}
            onOpenSidebar={() => setIsSidebarOpen(true)}
            onRefresh={handleRefresh}
          />

          <section className="px-4 py-5 sm:px-6 lg:px-7 xl:px-8">
            {apiMessage ? (
              <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">{apiMessage}</p>
            ) : null}
            {apiError ? (
              <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">{apiError}</p>
            ) : null}

            {activeTab === "overview" ? (
              <div className="space-y-5">
                <section className="rounded-3xl border border-black/8 bg-white px-5 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
                  <h3 className="text-xl font-bold text-[#1b1b1b]">Hi Admin, here&apos;s what&apos;s happening in your store today.</h3>
                  <p className="mt-1 text-sm text-black/55">ภาพรวมสิทธิ์การใช้งานและรายชื่อพนักงานทั้งหมดในระบบ</p>
                </section>

                <AdminOverviewPanels
                  totalEmployees={totalEmployees}
                  totalRoles={roles.length}
                  activeEmployees={activeEmployees}
                  inactiveEmployees={inactiveEmployees}
                />

                <div className="grid gap-5 xl:grid-cols-[0.95fr_1.35fr]">
                  <RolesPanel roles={roles} />
                  <EmployeesSummaryPanel employees={employees} onManage={handleOpenManageModalByRow} />
                </div>
              </div>
            ) : null}

            {activeTab === "roles" ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {roles.map((role) => (
                  <article key={role.roleId} className="rounded-2xl border border-black/10 bg-white p-4">
                    <p className="text-xs text-black/60">Role ID</p>
                    <p className="mt-1 text-lg font-semibold text-red-900">{role.roleId}</p>
                    <p className="mt-3 text-xs text-black/60">Role Name</p>
                    <p className="mt-1 text-base font-medium">{role.roleName}</p>
                  </article>
                ))}
              </div>
            ) : null}

            {activeTab === "employees" ? (
              <div className="space-y-4">
                <form onSubmit={handleSearchSubmit} className="grid gap-3 rounded-3xl border border-black/8 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)] md:grid-cols-5">
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs text-black/70">Search</label>
                    <input
                      value={employeeQuery.search ?? ""}
                      onChange={(event) => setEmployeeQuery((prev) => ({ ...prev, search: event.target.value }))}
                      placeholder="ค้นหาชื่อ/อีเมล"
                      className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-red-400"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-black/70">Role</label>
                    <select
                      value={employeeQuery.roleId ?? ""}
                      onChange={(event) =>
                        setEmployeeQuery((prev) => ({
                          ...prev,
                          roleId: event.target.value ? Number(event.target.value) : undefined,
                        }))
                      }
                      className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-red-400"
                    >
                      <option value="">ทั้งหมด</option>
                      {roles.map((role) => (
                        <option key={role.roleId} value={role.roleId}>
                          {role.roleName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-black/70">Status</label>
                    <select
                      value={employeeQuery.status ?? ""}
                      onChange={(event) =>
                        setEmployeeQuery((prev) => ({
                          ...prev,
                          status: event.target.value ? (event.target.value as "active" | "inactive") : undefined,
                        }))
                      }
                      className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-red-400"
                    >
                      <option value="">ทั้งหมด</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button type="submit" className="w-full rounded-xl bg-red-800 px-3 py-2 text-sm font-semibold text-white hover:bg-red-900">
                      ค้นหา
                    </button>
                  </div>
                </form>

                <EmployeesTable employees={employees} onManage={handleOpenManageModalByRow} />

                <div className="flex items-center justify-between rounded-2xl border border-black/8 bg-white px-4 py-3 text-sm shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
                  <p>
                    Page {employeeQuery.page ?? 1} / {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      disabled={(employeeQuery.page ?? 1) <= 1}
                      onClick={async () => {
                        const nextQuery = { ...employeeQuery, page: Math.max(1, (employeeQuery.page ?? 1) - 1) };
                        setEmployeeQuery(nextQuery);
                        await loadEmployees(nextQuery);
                      }}
                      className="rounded-lg border border-black/15 px-3 py-1 disabled:opacity-40"
                    >
                      Prev
                    </button>
                    <button
                      disabled={(employeeQuery.page ?? 1) >= totalPages}
                      onClick={async () => {
                        const nextQuery = { ...employeeQuery, page: Math.min(totalPages, (employeeQuery.page ?? 1) + 1) };
                        setEmployeeQuery(nextQuery);
                        await loadEmployees(nextQuery);
                      }}
                      className="rounded-lg border border-black/15 px-3 py-1 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === "create" ? (
              <form onSubmit={handleCreateEmployee} className="grid gap-4 rounded-3xl border border-black/8 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-black/70">Employee Name</label>
                  <input
                    value={createPayload.employeeName}
                    onChange={(event) => setCreatePayload((prev) => ({ ...prev, employeeName: event.target.value }))}
                    required
                    className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-red-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-black/70">Role</label>
                  <select
                    value={createPayload.roleId}
                    onChange={(event) => setCreatePayload((prev) => ({ ...prev, roleId: Number(event.target.value) }))}
                    className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-red-400"
                  >
                    {roles.map((role) => (
                      <option key={role.roleId} value={role.roleId}>
                        {role.roleName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs text-black/70">Phone Number</label>
                  <input
                    value={createPayload.phoneNumber}
                    onChange={(event) => setCreatePayload((prev) => ({ ...prev, phoneNumber: event.target.value }))}
                    required
                    className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-red-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-black/70">Email</label>
                  <input
                    type="email"
                    value={createPayload.email}
                    onChange={(event) => setCreatePayload((prev) => ({ ...prev, email: event.target.value }))}
                    required
                    className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-red-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-black/70">Hire Date</label>
                  <input
                    type="date"
                    value={createPayload.hireDate}
                    onChange={(event) => setCreatePayload((prev) => ({ ...prev, hireDate: event.target.value }))}
                    required
                    className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-red-400"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-black/70">Password</label>
                  <input
                    type="password"
                    value={createPayload.password}
                    onChange={(event) => setCreatePayload((prev) => ({ ...prev, password: event.target.value }))}
                    required
                    className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-red-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <button type="submit" className="w-full rounded-xl bg-red-800 px-4 py-2 text-sm font-semibold text-white hover:bg-red-900">
                    สร้างพนักงาน
                  </button>
                </div>
              </form>
            ) : null}

            {activeTab === "detail" ? (
              <div className="rounded-3xl border border-black/8 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
                <form onSubmit={handleGetEmployeeById} className="grid gap-3 sm:grid-cols-[1fr_auto]">
                  <input
                    value={selectedEmployeeId}
                    onChange={(event) => setSelectedEmployeeId(event.target.value)}
                    className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-red-400"
                    placeholder="กรอก employeeId เพื่อจัดการ"
                  />
                  <button type="submit" className="rounded-xl bg-red-800 px-4 py-2 text-sm font-semibold text-white hover:bg-red-900">
                    เปิด Popup
                  </button>
                </form>
              </div>
            ) : null}
          </section>
        </div>
      </div>

      <EmployeeManageModal
        isOpen={isManageModalOpen}
        selectedEmployee={selectedEmployee}
        updatePayload={updatePayload}
        nextEmployeeStatus={nextEmployeeStatus}
        roles={roles}
        onClose={() => setIsManageModalOpen(false)}
        onUpdatePayloadChange={setUpdatePayload}
        onSubmitUpdate={handleUpdateEmployee}
        onToggleStatus={handleUpdateEmployeeStatus}
      />
    </main>
  );
}
