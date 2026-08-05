import {
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { IconX } from "@tabler/icons-react";
import clsx from "clsx";

import { articleContext } from "../context/ArticleProvider";

interface SearchBarOption {
  _id: unknown;
  name: string;
}

interface Props<T extends SearchBarOption> {
  property: "inventoryLocation" | "vehicleModels";
  selectedObject: T | null;
  setSelectedObject: Dispatch<SetStateAction<T | null>>;
  placeholder?: string;
}

const placeholders = {
  inventoryLocation: "Lagerplats...",
  vehicleModels: "Modell...",
} satisfies Record<Props<SearchBarOption>["property"], string>;

const SearchBarKombo = <T extends SearchBarOption>({
  property,
  selectedObject,
  setSelectedObject,
  placeholder,
}: Props<T>) => {
  const { currentArticles } = useContext(articleContext);

  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const options = useMemo(() => {
    const objects = currentArticles.flatMap((article) => {
      if (property === "vehicleModels") {
        return article.vehicleModels ?? [];
      }

      return article.inventoryLocation ? [article.inventoryLocation] : [];
    }) as T[];

    const uniqueObjects = Array.from(
      new Map(objects.map((object) => [String(object._id), object])).values(),
    );

    return uniqueObjects.sort((a, b) => a.name.localeCompare(b.name, "sv"));
  }, [currentArticles, property]);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("sv");

    if (!normalizedQuery) {
      return options;
    }

    return options.filter((object) =>
      object.name.toLocaleLowerCase("sv").includes(normalizedQuery),
    );
  }, [options, query]);

  const clearSelection = () => {
    setSelectedObject(null);
    setQuery("");

    /*
     * Comboboxen stängs när inputfältet tappar fokus.
     * requestAnimationFrame gör att state hinner uppdateras först.
     */
    requestAnimationFrame(() => {
      inputRef.current?.blur();
    });
  };

  return (
    <div className="mt-2 flex w-full min-w-[220px] items-center gap-2 sm:w-[220px]">
      <Combobox
        as="div"
        className="w-full"
        value={selectedObject}
        by={(a, b) => String(a?._id) === String(b?._id)}
        onChange={(object: T | null) => {
          setSelectedObject(object);
          setQuery("");
        }}
      >
        {({ open }) => (
          <div className="relative flex w-full items-center">
            <Combobox.Input
              ref={inputRef}
              type="text"
              title={selectedObject?.name}
              placeholder={placeholder ?? placeholders[property]}
              className={clsx(
                "w-full rounded-md border-0 bg-white py-3.5 pl-3",
                "text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300",
                "focus:ring-2 focus:ring-inset focus:ring-indigo-600",
                "sm:leading-6",
                "pr-[60px]",
              )}
              displayValue={(object: T | null) => object?.name ?? ""}
              onChange={(event) => {
                const newQuery = event.target.value;

                setQuery(newQuery);

                /*
                 * Börjar användaren skriva efter att ha valt ett objekt
                 * tas det tidigare valet bort.
                 */
                if (selectedObject) {
                  setSelectedObject(null);
                }
              }}
            />

            {selectedObject && (
              <button
                type="button"
                aria-label="Rensa sökfält"
                title="Rensa sökfält"
                className={clsx(
                  "absolute inset-y-0 right-8 flex items-center px-2",
                  "text-red-600 hover:text-red-600 sm:text-gray-400 ",
                  "focus:outline-none focus-visible:ring-2",
                  "focus-visible:ring-indigo-600",
                )}
                onMouseDown={(event) => {
                  /*
                   * Hindrar att Headless UI tolkar klicket som att
                   * inputfältet ska behålla eller få fokus.
                   */
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
                "rounded-r-md px-2 focus:outline-none",
                "focus-visible:ring-2 focus-visible:ring-indigo-600",
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
                {filteredOptions.map((object) => (
                  <Combobox.Option
                    key={String(object._id)}
                    value={object}
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
                            "block break-words whitespace-normal", // truncate tidigare
                            selected ? "font-semibold" : "font-normal",
                          )}
                        >
                          {object.name}
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

            {open && query.trim() !== "" && filteredOptions.length === 0 && (
              <div
                className={clsx(
                  "absolute left-0 top-full z-50 mt-1",
                  "w-full rounded-md bg-white px-3 py-2",
                  "text-sm text-gray-500 shadow-lg ring-1 ring-black/5",
                )}
              >
                Inga alternativ hittades
              </div>
            )}
          </div>
        )}
      </Combobox>
    </div>
  );
};

export default SearchBarKombo;
