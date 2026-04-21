// components/chef-section/auth-chef/chef-auth-input-field.tsx

import type { ChefAuthInputFieldProps } from "./auth-chef.types";

export function ChefAuthInputField({
  id,
  name,
  type,
  autoComplete,
  label,
  placeholder,
  value,
  disabled = false,
  onChange,
  className,
}: ChefAuthInputFieldProps) {
  const isPassword = type === "password";

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="sr-only"
      >
        {label}
      </label>

      <div className="relative mt-2">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#616467]">
          {isPassword ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M7 11V8a5 5 0 0 1 10 0v3" />
              <rect x="4" y="11" width="16" height="10" rx="2" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20a8 8 0 0 1 16 0" />
            </svg>
          )}
        </span>

        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={onChange}
          className="h-11 w-full rounded-lg border border-white/5 bg-black/85 pl-9 pr-3 text-sm text-white placeholder:text-[#7a7d80] outline-none transition-[border-color,box-shadow,background-color] duration-200 ease-in focus:border-(--primary) focus:ring-4 focus:ring-(--primary-soft) disabled:cursor-not-allowed disabled:opacity-70"
        />
      </div>
    </div>
  );
}
