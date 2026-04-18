import { DetailOrder } from '@/components/chef-section/detail-order';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <DetailOrder orderId={id} />;
}