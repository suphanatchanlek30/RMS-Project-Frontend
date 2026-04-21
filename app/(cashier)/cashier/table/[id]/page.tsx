import { CashierTableMenu } from "@/components/cashier-section/table";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <CashierTableMenu tableId={id} />;
}