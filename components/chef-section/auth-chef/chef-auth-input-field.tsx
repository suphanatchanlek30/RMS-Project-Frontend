// components/chef-section/auth-chef/chef-auth-input-field.tsx

import type { ChefAuthInputFieldProps } from "./auth-chef.types";

export function ChefAuthInputField({
  id,
  name,
  type,
  autoComplete,
  label,
  placeholder,
  className,
}: ChefAuthInputFieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="text-sm font-semibold leading-tight text-(--color-text)"
      >
        {label}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-xl border border-[#d8dadd] bg-(--bg) px-4 text-sm text-(--color-text) placeholder:text-[#a1a6ad] outline-none transition-[border-color,box-shadow,background-color] duration-200 ease-in focus:border-(--primary) focus:ring-4 focus:ring-(--primary-soft)"
      />
    </div>
  );
}
