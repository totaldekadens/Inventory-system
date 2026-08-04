import { useContext, useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import { articleContext } from "../context/ArticleProvider";
import { IconX } from "@tabler/icons-react";
import { useRemoveDuplicates } from "@/lib/useRemoveDuplicates";
import clsx from "clsx";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

interface Props {
  property: "inventoryLocation" | "vehicleModels";
  selectedObject: any | null;
  setSelectedObject: React.Dispatch<React.SetStateAction<any | null>>;
  placeholder?: string;
}

const SearchBarKombo = ({
  property,
  selectedObject,
  setSelectedObject,
  placeholder,
}: Props) => {
  const { currentArticles } = useContext(articleContext);

  const [query, setQuery] = useState("");

  const objectList: any[] = [];

  currentArticles.forEach((article) => {
    const value = article[property];

    if (Array.isArray(value)) {
      value.forEach((object) => {
        objectList.push(object);
      });
    } else if (value) {
      objectList.push(value);
    }
  });

  // Remove duplicates
  const uniqueObjects = useRemoveDuplicates(objectList);

  // Sort keys from A - Ö
  const ascendingObjects = [...uniqueObjects].sort((a, b) =>
    a.name.localeCompare(b.name, "sv"),
  );

  const filteredList =
    query === ""
      ? ascendingObjects
      : ascendingObjects!.filter((object) => {
          return object.name?.toLowerCase().includes(query.toLowerCase());
        });

  const placeholders = {
    inventoryLocation: "Sök eller välj lagerplats...",
    vehicleModels: "Sök eller välj modell...",
  };

  return (
    <div
      className={clsx(
        property == "inventoryLocation"
          ? ` sm:min-w-[200px] sm:w-[200px]`
          : `sm:w-[220px] min-w-[220px] `,
        `flex w-full items-center gap-2 mt-2`,
      )}
    >
      <Combobox
        className="w-full"
        as="div"
        value={selectedObject}
        onChange={setSelectedObject}
      >
        <div className="relative w-full sm:w-auto flex items-center">
          <Combobox.Input
            type="text"
            placeholder={placeholder ?? placeholders[property]}
            className="w-full flex items-center rounded-md border-0 bg-white py-3.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(object: { name?: string } | null) =>
              object?.name ?? ""
            }
          />
          {selectedObject && (
            <Combobox.Button
              aria-label="Rensa sökfält"
              title="Rensa sökfält"
              className="shrink-0 text-red-600 hover:text-red-600 absolute inset-y-0 right-8 flex items-center rounded-r-md px-2 focus:outline-none "
              onClick={() => {
                setSelectedObject(null);
                setQuery("");
              }}
            >
              <IconX width={16} height={16} aria-hidden="true" />
            </Combobox.Button>
          )}
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>

          {!filteredList
            ? null
            : filteredList.length > 0 && (
                <Combobox.Options className="absolute left-0 top-full z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {filteredList.map((object) => (
                    <Combobox.Option
                      key={object._id}
                      value={object}
                      className={({ active }) =>
                        classNames(
                          "relative cursor-default select-none py-2 pl-8 pr-4",
                          active ? "bg-indigo-600 text-white" : "text-gray-900",
                        )
                      }
                    >
                      {({ active, selected }) => (
                        <>
                          <span
                            className={classNames(
                              "block truncate",
                              selected && "font-semibold",
                            )}
                          >
                            {object.name}
                          </span>

                          {selected && (
                            <span
                              className={classNames(
                                "absolute inset-y-0 left-0 flex items-center pl-1.5",
                                active ? "text-white" : "text-indigo-600",
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
    </div>
  );
};

export default SearchBarKombo;
