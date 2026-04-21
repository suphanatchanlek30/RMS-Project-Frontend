// components/public-section/menu-detail/option-checkbox.tsx
"use client";

interface OptionInputFieldProps {
  id: string;
  label: string;
  priceAddon?: number;
  checked: boolean;
  onChange: (id: string, checked: boolean) => void;
}

export function OptionInputField({
  id,
  label,
  priceAddon,
  checked,
  onChange,
}: OptionInputFieldProps) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-3 py-2"
    >
      <div className="relative flex-shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(id, e.target.checked)}
          className="peer sr-only"
        />
        <div
          className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
            checked
              ? "border-(--button-bg) bg-(--button-bg)"
              : "border-gray-300 bg-white"
          }`}
        >
          {checked && (
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
        </div>
      </div>
      <span className="flex-1 text-sm text-gray-700">{label}</span>
      {priceAddon !== undefined && (
        <span className="text-sm text-gray-500">+ ฿{priceAddon.toFixed(2)}</span>
      )}
    </label>
  );
}
