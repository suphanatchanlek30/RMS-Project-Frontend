import { CashierOrderDetails } from "@/components/cashier-section/order";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <CashierOrderDetails tableId={id} />;
}