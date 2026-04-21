type Props = {
  item: {
    name: string;
    qty: number;
    meta?: string;
  };
};

export default function CashierOrderItem({ item }: Props) {
  return (
    <div className="w-full bg-(--bg) rounded-lg px-4 py-2 shadow-sm text-sm">
      <div className="flex justify-between gap-4">
        <div>
          <span>{item.name}</span>
          {item.meta ? <div className="mt-1 text-xs text-black/45">{item.meta}</div> : null}
        </div>
        <span className="whitespace-nowrap">x{item.qty}</span>
      </div>
    </div>
  );
}