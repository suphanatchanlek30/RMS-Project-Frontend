import CashierCheckBillPage from "@/components/cashier-section/table/cashier-checkbill-page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <CashierCheckBillPage tableId={id} />;
}
