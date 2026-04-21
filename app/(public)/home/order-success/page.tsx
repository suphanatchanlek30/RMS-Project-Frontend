// app/(public-session)/order-success/page.tsx
import { OrderSuccessView } from "@/components/public-section/order-success/order-success-view";

export default function OrderSuccessPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-8">
      <OrderSuccessView />
    </main>
  );
}
