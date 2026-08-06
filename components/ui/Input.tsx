import clsx from "clsx";
import { forwardRef, InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  label?: string;
  suffix?: ReactNode;
  error?: string;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      name,
      type = "text",
      label,
      suffix,
      error,
      required,
      disabled,
      className,
      containerClassName,
      ...inputProps
    },
    ref,
  ) => {
    const inputId = id ?? name;
    const errorId = inputId ? `${inputId}-error` : undefined;

    const inputClass = clsx(
      "relative mt-2 block h-11 w-full rounded-md border-0",
      "bg-dark-50/20 px-3 py-3 text-base text-gray-900",
      "ring-1 ring-inset ring-gray-300",
      "placeholder:text-gray-500",
      "focus:z-10 focus:ring-2 focus:ring-inset focus:ring-light-300",
      "disabled:cursor-not-allowed disabled:opacity-60",
      "sm:leading-6 md:h-auto",
      suffix && "pr-[120px]",
      error && "ring-red-600 focus:ring-red-600",
      className,
    );

    return (
      <div className={containerClassName}>
        {label && (
          <label htmlFor={inputId} className="font-bold">
            {label}
            {required && (
              <span aria-hidden="true" className="ml-1">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            required={required}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className={inputClass}
            {...inputProps}
          />

          {suffix && (
            <div
              className="pointer-events-none absolute z-10 inset-y-0 right-0 flex items-center pr-2"
              aria-hidden="true"
            >
              <span className="inline-flex items-center rounded border border-gray-200 px-2 py-1 font-sans text-xs text-gray-600">
                {suffix}
              </span>
            </div>
          )}
        </div>

        {error && (
          <p id={errorId} className="mt-2 text-sm text-red-700">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
