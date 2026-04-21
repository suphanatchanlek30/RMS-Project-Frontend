import { CashierQrPage } from "@/components/cashier-section/qr";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <CashierQrPage tableId={id} />;
}