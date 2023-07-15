import { Dispatch, Fragment, SetStateAction, useContext } from "react";
import { vehicleContext } from "../context/VehicleProvider";
import { MultiSelect, Select } from "@mantine/core";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";

interface Props {
  selected: {
    id: string;
    label: string;
  };
  setSelected: Dispatch<
    SetStateAction<{
      id: string;
      label: string;
    }>
  >;
  placeholder?: string;
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const SelectSimple = ({ selected, setSelected, placeholder }: Props) => {
  const scrapCauses = [
    { id: "1", label: "Använd vid reparation" },
    { id: "2", label: "Diff" },
    { id: "3", label: "Kastad (trasig)" },
    { id: "4", label: "Kastad (överflödig)" },
    { id: "5", label: "Såld" },
  ];
  return (
    <div className="flex items-center w-full gap-2 text-sm min-w-[193px] rounded-md mb-2">
      <Listbox value={selected} onChange={setSelected}>
        {({ open }) => (
          <>
            <div className="relative mt-2">
              <Listbox.Button className="relative min-w-[193px] w-full cursor-default rounded-md h-11 md:h-auto bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                <span className="block truncate">{selected.label}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {scrapCauses.map((cause) => (
                    <Listbox.Option
                      key={cause.id}
                      className={({ active }) =>
                        classNames(
                          active ? "bg-indigo-600 text-white" : "text-gray-900",
                          "relative cursor-default select-none py-2 pl-3 pr-9"
                        )
                      }
                      value={cause}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? "font-semibold" : "font-normal",
                              "block truncate"
                            )}
                          >
                            {cause.label}
                          </span>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? "text-white" : "text-indigo-600",
                                "absolute inset-y-0 right-0 flex items-center pr-4"
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </div>
  );
};

export default SelectSimple;
