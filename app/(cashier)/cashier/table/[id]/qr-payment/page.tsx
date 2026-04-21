import CashierQrPaymentPage from "@/components/cashier-section/qr/cashier-qr-payment";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <CashierQrPaymentPage tableId={id} />;
}