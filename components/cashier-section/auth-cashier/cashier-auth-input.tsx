"use client";

type Props = {
  placeholder: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function CashierAuthInput({
  placeholder,
  type = "text",
  value,
  onChange,
}: Props) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full bg-black text-white px-4 py-3 rounded-lg outline-none"
    />
  );
}