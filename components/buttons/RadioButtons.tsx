import { RadioGroup } from "@headlessui/react";

export type SaleFilter = "all" | "forSale" | "notForSale";

interface Props {
  value: SaleFilter;
  onChange: React.Dispatch<React.SetStateAction<SaleFilter>>;
}

const options: {
  id: SaleFilter;
  title: string;
}[] = [
  { id: "all", title: "Alla" },
  { id: "forSale", title: "Endast till salu" },
  { id: "notForSale", title: "Endast för eget bruk" },
];

function classNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const RadioButtons = ({ value, onChange }: Props) => {
  return (
    <div className="mb-3 flex flex-col justify-center sm:flex-row sm:items-center">
      <h3 className="mb-2 mr-4 text-sm font-semibold text-gray-900 sm:mb-0">
        Visa:
      </h3>

      <RadioGroup value={value} onChange={onChange} className="ml-2">
        <div className="flex flex-wrap items-center space-x-6 sm:space-x-10">
          {options.map((option) => (
            <div key={option.id} className="flex items-center">
              <RadioGroup.Option
                id={option.id}
                value={option.id}
                className={({ active, checked }) =>
                  classNames(
                    active &&
                      checked &&
                      "bg-[#4A7660] ring ring-[#4A7660] ring-offset-1",
                    !active &&
                      checked &&
                      "bg-[#4A7660] ring-4 ring-[#4A7660] sm:ring-2",
                    "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-1.5 ring-2 focus:outline-none",
                  )
                }
              />

              <label
                htmlFor={option.id}
                className="ml-3 block cursor-pointer text-sm leading-6 text-gray-900"
              >
                {option.title}
              </label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default RadioButtons;
