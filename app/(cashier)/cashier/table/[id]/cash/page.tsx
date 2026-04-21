import CashierCashPage from "@/components/cashier-section/table/cashier-cash-page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <CashierCashPage tableId={id} />;
}
