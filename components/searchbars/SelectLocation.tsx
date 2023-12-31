import { Dispatch, SetStateAction, useContext, useRef, useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import { InventoryLocationDocument } from "@/models/InventoryLocationModel";
import { inventoryLocationContext } from "../context/InventoryLocationProvider";
import { IconX } from "@tabler/icons-react";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

interface Props {
  selectedLocation: InventoryLocationDocument | null;
  setSelectedLocation: Dispatch<
    SetStateAction<InventoryLocationDocument | null>
  >;
  placeholder?: string;
}

const SelectLocation = ({
  selectedLocation,
  setSelectedLocation,
  placeholder,
}: Props) => {
  const { inventoryLocations } = useContext(inventoryLocationContext);

  const [query, setQuery] = useState("");

  const filteredLocation =
    query === ""
      ? inventoryLocations
      : inventoryLocations!.filter((location) => {
          return location.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <div className="flex items-center gap-2">
      <Combobox
        as="div"
        value={selectedLocation}
        onChange={setSelectedLocation}
      >
        <div className="relative flex items-center">
          <Combobox.Input
            type="search"
            placeholder={placeholder ? placeholder : "Välj lagerplats*"}
            className="w-full flex items-center rounded-md border-0 h-11 bg-white py-1.5 pl-3 pr-10 text-gray-900  ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(location: InventoryLocationDocument) =>
              location?.name
            }
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>

          {!filteredLocation
            ? null
            : filteredLocation.length > 0 && (
                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {filteredLocation.map((location, i) => (
                    <Combobox.Option
                      key={i}
                      value={location}
                      className={({ active }) =>
                        classNames(
                          "relative cursor-default select-none py-2 pl-8 pr-4",
                          active ? "bg-indigo-600 text-white" : "text-gray-900"
                        )
                      }
                    >
                      {({ active, selected }) => (
                        <>
                          <span
                            className={classNames(
                              "block truncate",
                              selected && "font-semibold"
                            )}
                          >
                            {location.name}
                          </span>

                          {selected && (
                            <span
                              className={classNames(
                                "absolute inset-y-0 left-0 flex items-center pl-1.5",
                                active ? "text-white" : "text-indigo-600"
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          )}
                        </>
                      )}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              )}
        </div>
      </Combobox>
      {selectedLocation ? (
        <IconX
          xlinkTitle="Rensa sökfält"
          aria-label="Rensa sökfält"
          className="cursor-pointer hover:text-red-600"
          onClick={() => {
            setSelectedLocation(null);
          }}
          width={16}
          height={16}
        />
      ) : null}
    </div>
  );
};

export default SelectLocation;
