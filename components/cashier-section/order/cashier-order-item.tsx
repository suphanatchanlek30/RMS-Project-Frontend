type Props = {
  item: {
    name: string;
    qty: number;
  };
};

export default function CashierOrderItem({ item }: Props) {
  return (
    <div className="bg-[var(--input-bg)] rounded-lg px-4 py-2 shadow-sm text-sm">
      <div className="flex justify-between">
        <span>{item.name}</span>
        <span>x{item.qty}</span>
      </div>
    </div>
  );
}