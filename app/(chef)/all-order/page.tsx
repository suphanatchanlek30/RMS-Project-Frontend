import { AllOrder } from '@/components/chef-section/all-order';
import { OrderItemProps } from '@/components/chef-section/all-order/OrderCard';

// This acts as the entry page, you would fetch data here (e.g. from an API or database).
// For now, we seed it with the mock data.
export default function AllOrderPage() {
  const mockOrders: OrderItemProps[] = [
    ...Array.from({ length: 9 }).map((_, i) => ({
      id: `T${String(i + 1).padStart(2, '0')}`,
      status: (i < 3 ? 'new' : i < 6 ? 'preparing' : 'completed') as 'new' | 'preparing' | 'completed',
      items: [
        { name: 'กะเพรา (หมูสับ / ไก่ / หมูกรอบ / ทะเล) ราดข้าว', qty: 1 },
        { name: 'กะเพรา (หมูสับ / ไก่ / หมูกรอบ / ทะเล) ราดข้าว', qty: 1 },
        { name: 'น้ำเปล่า (แช่เย็น / น้ำแข็งเปล่า)', qty: 2 },
      ],
    })),
  ];

  return <AllOrder orders={mockOrders} />;
}
