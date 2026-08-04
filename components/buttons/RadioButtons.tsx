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

      <RadioGroup value={value} onChange={onChange} className="ml-2 mt-2">
        <div className="flex flex-wrap items-center space-x-6 sm:space-x-10">
          {options.map((option) => (
            <div key={option.value} className="flex items-center">
              <RadioGroup.Option
                id={option.value}
                value={option.value}
                className={({ active, checked }) =>
                  classNames(
                    active &&
                      checked &&
                      "bg-[#4A7660] ring ring-[#4A7660] ring-offset-1",
                    !active &&
                      checked &&
                      "bg-[#4A7660] ring-4 ring-[#4A7660] sm:ring-2",
                    "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-2 ring-2 focus:outline-none",
                  )
                }
              />

              <label
                htmlFor={option.value}
                className="ml-3 block cursor-pointer leading-6 text-gray-900"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default RadioButtons;
