import { RadioGroup } from "@headlessui/react";

interface Props {
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string | any>>;
  options: {
    value: string;
    label: string;
  }[];
  label?: string;
}

function classNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const RadioButtons = ({ value, onChange, options, label }: Props) => {
  return (
    <div className="mb-3 flex flex-col">
      {label && (
        <span className="whitespace-nowrap text-gray-900">{label}</span>
      )}

      <RadioGroup value={value} onChange={onChange} className="mt-2">
        <div className="flex flex-wrap gap-2 sm:gap-4">
          {options.map((option) => (
            <RadioGroup.Option
              key={option.value}
              value={option.value}
              className="flex cursor-pointer items-center rounded-md px-3 py-2 transition [-webkit-tap-highlight-color:transparent]"
            >
              {({ active, checked }) => (
                <>
                  <span
                    className={classNames(
                      "flex h-5 w-5 items-center justify-center rounded-full border",
                      checked
                        ? "border-[#4A7660] bg-[#4A7660]"
                        : "border-gray-400",
                    )}
                  >
                    {checked && (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </span>

                  <span className="ml-3 text-gray-900">{option.label}</span>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default RadioButtons;
