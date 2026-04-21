"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  adminService,
  type AdminTableItem,
  type CategoryItem,
  type CreateCategoryPayload,
  type CreateEmployeePayload,
  type CreateMenuPayload,
  type CreateTablePayload,
  type DashboardSummary,
  type EmployeeItem,
  type EmployeeQueryParams,
  type MenuItem,
  type PaymentItem,
  type ReceiptItem,
  type RoleItem,
  type SalesReportItem,
  type TopMenuReportItem,
  type UpdateEmployeePayload,
} from "@/services/admin.service";
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

const initialTablePayload: CreateTablePayload = {
  tableNumber: "",
  capacity: 4,
  tableStatus: "AVAILABLE",
};

const initialCategoryPayload: CreateCategoryPayload = {
  categoryName: "",
  description: "",
  categoryStatus: true,
};

const initialMenuPayload: CreateMenuPayload = {
  menuName: "",
  price: 0,
  categoryId: 0,
  description: "",
  imageUrl: "",
  menuStatus: true,
};

const tabTitleMap: Record<AdminTab, string> = {
  overview: "Admin Overview",
  roles: "Roles",
  employees: "Employees",
  create: "Create Employee",
  detail: "Manage By ID",
  tables: "Tables",
  categories: "Categories",
  menus: "Menus",
  reports: "Reports",
  payments: "Payments",
  receipts: "Receipts",
};

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBootLoading, setIsBootLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | undefined>(undefined);

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

  const [tables, setTables] = useState<AdminTableItem[]>([]);
  const [tablePayload, setTablePayload] = useState<CreateTablePayload>(initialTablePayload);

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [categoryPayload, setCategoryPayload] = useState<CreateCategoryPayload>(initialCategoryPayload);

  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [menuPayload, setMenuPayload] = useState<CreateMenuPayload>(initialMenuPayload);

  const [salesReport, setSalesReport] = useState<SalesReportItem[]>([]);
  const [topMenuReport, setTopMenuReport] = useState<TopMenuReportItem[]>([]);

  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [paymentLookupId, setPaymentLookupId] = useState("");
  const [paymentDetail, setPaymentDetail] = useState<PaymentItem | null>(null);

  const [receipts, setReceipts] = useState<ReceiptItem[]>([]);
  const [receiptLookupId, setReceiptLookupId] = useState("");
  const [receiptDetail, setReceiptDetail] = useState<ReceiptItem | null>(null);

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

  const loadDashboardSummary = async () => {
    const summaryResult = await adminService.getDashboardSummary();
    if (!summaryResult.success || !summaryResult.data) {
      setApiError(summaryResult.message);
      return;
    }

    setDashboardSummary(summaryResult.data);
  };

  const loadTables = async () => {
    const result = await adminService.getTables();
    if (!result.success) {
      setApiError(result.message);
      return;
    }
    setTables(Array.isArray(result.data) ? result.data : []);
  };

  const loadCategories = async () => {
    const result = await adminService.getCategories();
    if (!result.success) {
      setApiError(result.message);
      return;
    }
    const categoryList = Array.isArray(result.data) ? result.data : [];
    setCategories(categoryList);
    if (categoryList.length > 0) {
      setMenuPayload((prev) => ({
        ...prev,
        categoryId: prev.categoryId || categoryList[0].categoryId,
      }));
    }
  };

  const loadMenus = async () => {
    const result = await adminService.getMenus();
    if (!result.success) {
      setApiError(result.message);
      return;
    }
    setMenus(Array.isArray(result.data) ? result.data : []);
  };

  const loadReports = async (dateFrom?: string, dateTo?: string) => {
    // Default: current month
    const now = new Date();
    const firstDay = dateFrom ?? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
    const lastDay = dateTo ?? now.toISOString().split("T")[0];

    const [salesResult, topMenuResult] = await Promise.all([
      adminService.getSalesReport({ dateFrom: firstDay, dateTo: lastDay, groupBy: "day" }),
      adminService.getTopMenusReport({ dateFrom: firstDay, dateTo: lastDay, limit: 10 }),
    ]);

    if (salesResult.success) {
      setSalesReport(Array.isArray(salesResult.data) ? salesResult.data : []);
    } else {
      setApiError(salesResult.message);
    }

    if (topMenuResult.success) {
      setTopMenuReport(Array.isArray(topMenuResult.data) ? topMenuResult.data : []);
    } else {
      setApiError(topMenuResult.message);
    }
  };

  const loadPayments = async () => {
    const result = await adminService.getPayments({ page: 1, limit: 20 });
    if (!result.success) {
      setApiError(result.message);
      return;
    }
    setPayments(Array.isArray(result.data) ? result.data : []);
  };

  const loadReceipts = async () => {
    const result = await adminService.getReceipts({ page: 1, limit: 20 });
    if (!result.success) {
      setApiError(result.message);
      return;
    }
    setReceipts(Array.isArray(result.data) ? result.data : []);
  };

  const bootstrap = async () => {
    if (!requireAdminToken()) return;

    setIsBootLoading(true);
    clearAlerts();

    const loadedRoles = await loadRoles();
    await Promise.all([loadEmployees(employeeQuery), loadDashboardSummary()]);

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

  useEffect(() => {
    if (activeTab === "tables" && tables.length === 0) {
      void loadTables();
    }
    if (activeTab === "categories" && categories.length === 0) {
      void loadCategories();
    }
    if (activeTab === "menus" && menus.length === 0) {
      void loadMenus();
      if (categories.length === 0) {
        void loadCategories();
      }
    }
    if (activeTab === "reports" && salesReport.length === 0 && topMenuReport.length === 0) {
      void loadReports();
    }
    if (activeTab === "payments" && payments.length === 0) {
      void loadPayments();
    }
    if (activeTab === "receipts" && receipts.length === 0) {
      void loadReceipts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    clearAlerts();
    await Promise.all([loadRoles(), loadEmployees(employeeQuery), loadDashboardSummary()]);

    if (activeTab === "tables") await loadTables();
    if (activeTab === "categories") await loadCategories();
    if (activeTab === "menus") {
      await Promise.all([loadMenus(), loadCategories()]);
    }
    if (activeTab === "reports") await loadReports();
    if (activeTab === "payments") await loadPayments();
    if (activeTab === "receipts") await loadReceipts();

    setApiMessage("รีเฟรชข้อมูลสำเร็จ");
    setIsRefreshing(false);
  };

  const handleCreateTable = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearAlerts();

    const result = await adminService.createTable(tablePayload);
    if (!result.success) {
      setApiError(result.message);
      return;
    }

    setApiMessage(result.message);
    setTablePayload(initialTablePayload);
    await loadTables();
  };

  const handleToggleTableStatus = async (table: AdminTableItem) => {
    clearAlerts();

    const nextStatus = table.tableStatus === "AVAILABLE" ? "UNAVAILABLE" : "AVAILABLE";
    const result = await adminService.updateTableById(table.tableId, { tableStatus: nextStatus });

    if (!result.success) {
      setApiError(result.message);
      return;
    }

    setApiMessage(result.message);
    await loadTables();
  };

  const handleCreateCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearAlerts();

    const result = await adminService.createCategory(categoryPayload);
    if (!result.success) {
      setApiError(result.message);
      return;
    }

    setApiMessage(result.message);
    setCategoryPayload(initialCategoryPayload);
    await loadCategories();
  };

  const handleToggleCategoryStatus = async (categoryItem: CategoryItem) => {
    clearAlerts();

    const result = await adminService.updateCategoryById(categoryItem.categoryId, {
      categoryStatus: !Boolean(categoryItem.categoryStatus),
    });

    if (!result.success) {
      setApiError(result.message);
      return;
    }

    setApiMessage(result.message);
    await loadCategories();
  };

  const handleCreateMenu = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearAlerts();

    const result = await adminService.createMenu(menuPayload);
    if (!result.success) {
      setApiError(result.message);
      return;
    }

    setApiMessage(result.message);
    setMenuPayload((prev) => ({ ...initialMenuPayload, categoryId: prev.categoryId }));
    await loadMenus();
  };

  const handleToggleMenuStatus = async (menuItem: MenuItem) => {
    clearAlerts();

    // Use the dedicated PATCH /menus/:id/status endpoint
    const result = await adminService.updateMenuStatus(menuItem.menuId, !Boolean(menuItem.menuStatus));

    if (!result.success) {
      setApiError(result.message);
      return;
    }

    setApiMessage(result.message);
    await loadMenus();
  };

  const handleLookupPayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearAlerts();

    const paymentId = Number(paymentLookupId);
    if (!paymentId) {
      setApiError("กรุณากรอก paymentId ให้ถูกต้อง");
      return;
    }

    const result = await adminService.getPaymentById(paymentId);
    if (!result.success || !result.data) {
      setApiError(result.message);
      return;
    }

    setPaymentDetail(result.data);
    setApiMessage(result.message);
  };

  const handleLookupReceipt = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearAlerts();

    const numId = Number(receiptLookupId);
    if (!numId) {
      setApiError("กรุณากรอก Payment ID หรือ Receipt ID ให้ถูกต้อง");
      return;
    }

    // Try by Payment ID first (preferred endpoint), then fall back to Receipt ID
    const byPayment = await adminService.getReceiptByPaymentId(numId);
    if (byPayment.success && byPayment.data) {
      setReceiptDetail(byPayment.data);
      setApiMessage(byPayment.message);
      return;
    }

    const byReceipt = await adminService.getReceiptById(numId);
    if (!byReceipt.success || !byReceipt.data) {
      setApiError(byReceipt.message || byPayment.message);
      return;
    }

    setReceiptDetail(byReceipt.data);
    setApiMessage(byReceipt.message);
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
    setIsManageModalOpen(false);
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
    setIsManageModalOpen(false);
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
                  dashboardSummary={dashboardSummary}
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

            {activeTab === "tables" ? (
              <div className="space-y-4">
                <form onSubmit={handleCreateTable} className="grid gap-3 rounded-3xl border border-black/8 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)] md:grid-cols-4">
                  <div>
                    <label className="mb-1 block text-xs text-black/70">Table Number</label>
                    <input
                      value={tablePayload.tableNumber}
                      onChange={(event) => setTablePayload((prev) => ({ ...prev, tableNumber: event.target.value }))}
                      required
                      className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-red-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-black/70">Capacity</label>
                    <input
                      type="number"
                      min={1}
                      value={tablePayload.capacity}
                      onChange={(event) => setTablePayload((prev) => ({ ...prev, capacity: Number(event.target.value) }))}
                      required
                      className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-red-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-black/70">Status</label>
                    <select
                      value={tablePayload.tableStatus}
                      onChange={(event) => setTablePayload((prev) => ({ ...prev, tableStatus: event.target.value }))}
                      className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-red-400"
                    >
                      <option value="AVAILABLE">AVAILABLE</option>
                      <option value="UNAVAILABLE">UNAVAILABLE</option>
                      <option value="RESERVED">RESERVED</option>
                      <option value="OCCUPIED">OCCUPIED</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button type="submit" className="w-full rounded-xl bg-red-800 px-3 py-2 text-sm font-semibold text-white hover:bg-red-900">
                      เพิ่มโต๊ะ
                    </button>
                  </div>
                </form>

                <div className="overflow-x-auto rounded-3xl border border-black/8 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
                  <table className="min-w-full text-sm">
                    <thead className="bg-[#fcf4f1] text-left text-black/70">
                      <tr>
                        <th className="px-4 py-3">Table</th>
                        <th className="px-4 py-3">Capacity</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tables.map((table) => (
                        <tr key={table.tableId} className="border-t border-black/8">
                          <td className="px-4 py-3 font-semibold">{table.tableNumber}</td>
                          <td className="px-4 py-3">{table.capacity}</td>
                          <td className="px-4 py-3">{table.tableStatus}</td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => void handleToggleTableStatus(table)}
                              className="rounded-lg border border-black/15 px-3 py-1 text-xs font-semibold hover:bg-black/5"
                            >
                              Toggle
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}

            {activeTab === "categories" ? (
              <div className="space-y-4">
                <form onSubmit={handleCreateCategory} className="grid gap-3 rounded-3xl border border-black/8 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)] md:grid-cols-4">
                  <div>
                    <label className="mb-1 block text-xs text-black/70">Category Name</label>
                    <input
                      value={categoryPayload.categoryName}
                      onChange={(event) => setCategoryPayload((prev) => ({ ...prev, categoryName: event.target.value }))}
                      required
                      className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-red-400"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs text-black/70">Description</label>
                    <input
                      value={categoryPayload.description ?? ""}
                      onChange={(event) => setCategoryPayload((prev) => ({ ...prev, description: event.target.value }))}
                      className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-red-400"
                    />
                  </div>
                  <div className="flex items-end">
                    <button type="submit" className="w-full rounded-xl bg-red-800 px-3 py-2 text-sm font-semibold text-white hover:bg-red-900">
                      เพิ่มหมวดหมู่
                    </button>
                  </div>
                </form>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {categories.map((categoryItem) => (
                    <article key={categoryItem.categoryId} className="rounded-2xl border border-black/10 bg-white p-4">
                      <p className="text-xs text-black/60">#{categoryItem.categoryId}</p>
                      <h4 className="mt-2 text-base font-semibold">{categoryItem.categoryName}</h4>
                      <p className="mt-1 text-xs text-black/60">{categoryItem.description || "-"}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className={`rounded-full px-2 py-1 text-xs ${categoryItem.categoryStatus ? "bg-emerald-100 text-emerald-700" : "bg-zinc-200 text-zinc-700"}`}>
                          {categoryItem.categoryStatus ? "Active" : "Inactive"}
                        </span>
                        <button
                          onClick={() => void handleToggleCategoryStatus(categoryItem)}
                          className="rounded-lg border border-black/15 px-3 py-1 text-xs font-semibold hover:bg-black/5"
                        >
                          Toggle
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}

            {activeTab === "menus" ? (
              <div className="space-y-4">
                <form onSubmit={handleCreateMenu} className="grid gap-3 rounded-3xl border border-black/8 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)] md:grid-cols-6">
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs text-black/70">Menu Name</label>
                    <input
                      value={menuPayload.menuName}
                      onChange={(event) => setMenuPayload((prev) => ({ ...prev, menuName: event.target.value }))}
                      required
                      className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-red-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-black/70">Price</label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={menuPayload.price}
                      onChange={(event) => setMenuPayload((prev) => ({ ...prev, price: Number(event.target.value) }))}
                      required
                      className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-red-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-black/70">Category</label>
                    <select
                      value={menuPayload.categoryId}
                      onChange={(event) => setMenuPayload((prev) => ({ ...prev, categoryId: Number(event.target.value) }))}
                      className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-red-400"
                    >
                      {categories.map((categoryItem) => (
                        <option key={categoryItem.categoryId} value={categoryItem.categoryId}>
                          {categoryItem.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs text-black/70">Image URL</label>
                    <input
                      value={menuPayload.imageUrl ?? ""}
                      onChange={(event) => setMenuPayload((prev) => ({ ...prev, imageUrl: event.target.value }))}
                      className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-red-400"
                    />
                  </div>
                  <div className="md:col-span-5">
                    <label className="mb-1 block text-xs text-black/70">Description</label>
                    <input
                      value={menuPayload.description ?? ""}
                      onChange={(event) => setMenuPayload((prev) => ({ ...prev, description: event.target.value }))}
                      className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-red-400"
                    />
                  </div>
                  <div className="flex items-end">
                    <button type="submit" className="w-full rounded-xl bg-red-800 px-3 py-2 text-sm font-semibold text-white hover:bg-red-900">
                      เพิ่มเมนู
                    </button>
                  </div>
                </form>

                <div className="overflow-x-auto rounded-3xl border border-black/8 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
                  <table className="min-w-full text-sm">
                    <thead className="bg-[#fcf4f1] text-left text-black/70">
                      <tr>
                        <th className="px-4 py-3">Menu</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menus.map((menuItem) => (
                        <tr key={menuItem.menuId} className="border-t border-black/8">
                          <td className="px-4 py-3 font-medium">{menuItem.menuName}</td>
                          <td className="px-4 py-3">{menuItem.categoryName ?? menuItem.categoryId}</td>
                          <td className="px-4 py-3">{menuItem.price.toFixed(2)}</td>
                          <td className="px-4 py-3">{menuItem.menuStatus ? "Active" : "Inactive"}</td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => void handleToggleMenuStatus(menuItem)}
                              className="rounded-lg border border-black/15 px-3 py-1 text-xs font-semibold hover:bg-black/5"
                            >
                              Toggle
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}

            {activeTab === "reports" ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <section className="rounded-3xl border border-black/8 bg-white p-4">
                    <h3 className="text-base font-semibold">Sales Report (เดือนนี้)</h3>
                    {salesReport.length === 0 ? (
                      <p className="mt-3 text-sm text-black/40">ไม่มีข้อมูล</p>
                    ) : (
                      <div className="mt-3 space-y-2 max-h-80 overflow-y-auto">
                        {salesReport.map((row) => (
                          <div key={row.date} className="flex items-center justify-between rounded-xl bg-black/3 px-3 py-2 text-sm">
                            <div>
                              <span>{row.date}</span>
                              <span className="ml-2 text-xs text-black/50">{row.totalOrders} orders</span>
                            </div>
                            <span className="font-semibold">{row.totalSales.toLocaleString()} ฿</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  <section className="rounded-3xl border border-black/8 bg-white p-4">
                    <h3 className="text-base font-semibold">Top Menus (เดือนนี้)</h3>
                    {topMenuReport.length === 0 ? (
                      <p className="mt-3 text-sm text-black/40">ไม่มีข้อมูล</p>
                    ) : (
                      <div className="mt-3 space-y-2">
                        {topMenuReport.map((row, idx) => (
                          <div key={row.menuId} className="flex items-center justify-between rounded-xl bg-black/3 px-3 py-2 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="w-5 text-xs font-bold text-black/40">#{idx + 1}</span>
                              <span>{row.menuName}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-semibold">{row.totalQuantity ?? row.totalSold ?? 0} ชิ้น</span>
                              {row.totalAmount != null && (
                                <span className="ml-2 text-xs text-black/50">{row.totalAmount.toLocaleString()} ฿</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </div>
              </div>
            ) : null}

            {activeTab === "payments" ? (
              <div className="space-y-4">
                <form onSubmit={handleLookupPayment} className="grid gap-3 rounded-3xl border border-black/8 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)] sm:grid-cols-[1fr_auto]">
                  <input
                    value={paymentLookupId}
                    onChange={(event) => setPaymentLookupId(event.target.value)}
                    placeholder="ค้นหา paymentId"
                    className="rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-red-400"
                  />
                  <button type="submit" className="rounded-xl bg-red-800 px-4 py-2 text-sm font-semibold text-white hover:bg-red-900">
                    ค้นหา
                  </button>
                </form>

                {paymentDetail ? (
                  <article className="rounded-2xl border border-black/10 bg-white p-4 text-sm">
                    <p className="text-xs text-black/55">Payment Detail</p>
                    <p className="mt-1 font-semibold">#{paymentDetail.paymentId}</p>
                    <p className="mt-1">Session: {paymentDetail.sessionId}</p>
                    <p>Total: {(paymentDetail.totalAmount ?? paymentDetail.paidAmount ?? 0).toFixed(2)} ฿</p>
                    <p>Status: {paymentDetail.paymentStatus ?? "-"}</p>
                  </article>
                ) : null}

                <div className="overflow-x-auto rounded-3xl border border-black/8 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
                  <table className="min-w-full text-sm">
                    <thead className="bg-[#fcf4f1] text-left text-black/70">
                      <tr>
                        <th className="px-4 py-3">Payment ID</th>
                        <th className="px-4 py-3">Session</th>
                        <th className="px-4 py-3">Method</th>
                        <th className="px-4 py-3">Paid</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.paymentId} className="border-t border-black/8">
                          <td className="px-4 py-3">{payment.paymentId}</td>
                          <td className="px-4 py-3">{payment.sessionId}</td>
                          <td className="px-4 py-3">{payment.paymentMethodName ?? "-"}</td>
                          <td className="px-4 py-3">{(payment.totalAmount ?? payment.paidAmount ?? 0).toFixed(2)} ฿</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}

            {activeTab === "receipts" ? (
              <div className="space-y-4">
                <form onSubmit={handleLookupReceipt} className="grid gap-3 rounded-3xl border border-black/8 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)] sm:grid-cols-[1fr_auto]">
                  <input
                    value={receiptLookupId}
                    onChange={(event) => setReceiptLookupId(event.target.value)}
                    placeholder="ค้นหา Payment ID / Receipt ID"
                    className="rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-red-400"
                  />
                  <button type="submit" className="rounded-xl bg-red-800 px-4 py-2 text-sm font-semibold text-white hover:bg-red-900">
                    ค้นหา
                  </button>
                </form>

                {receiptDetail ? (
                  <article className="rounded-2xl border border-black/10 bg-white p-4 text-sm">
                    <p className="text-xs text-black/55">Receipt Detail</p>
                    <p className="mt-1 font-semibold">{receiptDetail.receiptNumber}</p>
                    <p className="mt-1">Receipt ID: {receiptDetail.receiptId}</p>
                    <p>Payment: {receiptDetail.paymentId}</p>
                    <p>Total: {receiptDetail.totalAmount.toFixed(2)} ฿</p>
                  </article>
                ) : null}

                <div className="overflow-x-auto rounded-3xl border border-black/8 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
                  <table className="min-w-full text-sm">
                    <thead className="bg-[#fcf4f1] text-left text-black/70">
                      <tr>
                        <th className="px-4 py-3">Receipt ID</th>
                        <th className="px-4 py-3">Receipt No.</th>
                        <th className="px-4 py-3">Payment ID</th>
                        <th className="px-4 py-3">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receipts.map((receipt) => (
                        <tr key={receipt.receiptId} className="border-t border-black/8">
                          <td className="px-4 py-3">{receipt.receiptId}</td>
                          <td className="px-4 py-3">{receipt.receiptNumber}</td>
                          <td className="px-4 py-3">{receipt.paymentId}</td>
                          <td className="px-4 py-3">{receipt.totalAmount.toFixed(2)} ฿</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </div>

      {/* Employee Manage Modal */}
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
