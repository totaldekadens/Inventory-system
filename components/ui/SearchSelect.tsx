import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { IconX } from "@tabler/icons-react";
import clsx from "clsx";
import { useMemo, useRef, useState } from "react";

export interface SelectOption<T> {
  key: string;
  value: T;
  label: string;
}

interface Props<T> {
  options: SelectOption<T>[];
  selectedOption: SelectOption<T> | null;
  onChange: (option: SelectOption<T> | null) => void;
  placeholder?: string;
  noOptionsText?: string;
  disabled?: boolean;
  className?: string;
}

const SearchSelect = <T,>({
  options,
  selectedOption,
  onChange,
  placeholder = "Välj...",
  noOptionsText = "Inga alternativ hittades",
  disabled = false,
  className,
}: Props<T>) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const normalizedOptions = useMemo(() => {
    const uniqueOptions = Array.from(
      new Map(options.map((option) => [option.key, option])).values(),
    );

    return uniqueOptions.sort((a, b) => a.label.localeCompare(b.label, "sv"));
  }, [options]);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("sv");

    if (!normalizedQuery) {
      return normalizedOptions;
    }

    return normalizedOptions.filter((option) =>
      option.label.toLocaleLowerCase("sv").includes(normalizedQuery),
    );
  }, [normalizedOptions, query]);

  const clearSelection = () => {
    onChange(null);
    setQuery("");

    requestAnimationFrame(() => {
      inputRef.current?.blur();
    });
  };

  return (
    <div
      className={clsx(
        "mt-2 flex w-full min-w-[220px] items-center gap-2",
        "sm:w-[220px]",
        className,
      )}
    >
      <Combobox
        as="div"
        className="w-full"
        value={selectedOption}
        by={(a, b) => a?.key === b?.key}
        onChange={(option: SelectOption<T> | null) => {
          onChange(option);
          setQuery("");
        }}
        disabled={disabled}
      >
        {({ open }) => (
          <div className="relative flex w-full items-center">
            <Combobox.Input
              ref={inputRef}
              type="text"
              title={selectedOption?.label}
              placeholder={placeholder}
              className={clsx(
                "w-full rounded-md border-0 bg-white py-3.5 pl-3 pr-[60px]",
                "text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300",
                "placeholder:text-gray-500",
                "focus:ring-2 focus:ring-inset focus:ring-indigo-600",
                "disabled:cursor-not-allowed disabled:bg-gray-100",
                "disabled:text-gray-500",
                "sm:leading-6",
              )}
              displayValue={(option: SelectOption<T> | null) =>
                option?.label ?? ""
              }
              onChange={(event) => {
                setQuery(event.target.value);

                if (selectedOption) {
                  onChange(null);
                }
              }}
            />

            {selectedOption && !disabled && (
              <button
                type="button"
                aria-label="Rensa val"
                title="Rensa val"
                className={clsx(
                  "absolute inset-y-0 right-8 flex items-center px-2",
                  "text-red-600 sm:text-gray-400",
                  "hover:text-red-600",
                  "focus:outline-none focus-visible:ring-2",
                  "focus-visible:ring-indigo-600",
                )}
                onMouseDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  clearSelection();
                }}
              >
                <IconX width={16} height={16} aria-hidden="true" />
              </button>
            )}

            <Combobox.Button
              aria-label={open ? "Stäng alternativ" : "Visa alternativ"}
              className={clsx(
                "absolute inset-y-0 right-0 flex items-center",
                "rounded-r-md px-2",
                "focus:outline-none focus-visible:ring-2",
                "focus-visible:ring-indigo-600",
              )}
            >
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>

            {open && filteredOptions.length > 0 && (
              <Combobox.Options
                className={clsx(
                  "absolute left-0 top-full z-50 mt-1",
                  "max-h-60 w-full overflow-auto rounded-md",
                  "bg-white py-1 text-base shadow-lg",
                  "ring-1 ring-black/5 focus:outline-none",
                )}
              >
                {filteredOptions.map((option) => (
                  <Combobox.Option
                    key={option.key}
                    value={option}
                    className={({ active }) =>
                      clsx(
                        "relative cursor-default select-none",
                        "py-2 pl-8 pr-4",
                        active ? "bg-indigo-600 text-white" : "text-gray-900",
                      )
                    }
                  >
                    {({ active, selected }) => (
                      <>
                        <span
                          className={clsx(
                            "block whitespace-normal break-words",
                            selected ? "font-semibold" : "font-normal",
                          )}
                        >
                          {option.label}
                        </span>

                        {selected && (
                          <span
                            className={clsx(
                              "absolute inset-y-0 left-0",
                              "flex items-center pl-1.5",
                              active ? "text-white" : "text-indigo-600",
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            )}

            {open && filteredOptions.length === 0 && (
              <div
                className={clsx(
                  "absolute left-0 top-full z-50 mt-1",
                  "w-full rounded-md bg-white px-3 py-2",
                  "text-sm text-gray-500 shadow-lg",
                  "ring-1 ring-black/5",
                )}
              >
                {noOptionsText}
              </div>
            )}
          </div>
        )}
      </Combobox>
    </div>
  );
};

export default SearchSelect;
