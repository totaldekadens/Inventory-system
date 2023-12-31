import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import { articleContext } from "../context/ArticleProvider";
import { IconX } from "@tabler/icons-react";
import { VehicleDocument } from "@/models/VehicleModel";
import { useRemoveDuplicates } from "@/lib/useRemoveDuplicates";
import clsx from "clsx";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

interface Props {
  property: "inventoryLocation" | "vehicleModels";
}

const SearchBarKombo = ({ property }: Props) => {
  const { currentArticles, setCurrentArticles, articles } =
    useContext(articleContext);

  const [query, setQuery] = useState("");

  const [selectedObject, setSelectedObject] = useState<any | null>(null);
  const selectedObjectRef = useRef<any | null>(null);
  selectedObjectRef.current = selectedObject;

  const objectList: any[] = [];
  currentArticles.forEach((article) => {
    if (property) {
    }

    if (Array.isArray(article[property])) {
      article.vehicleModels.forEach((model: any) => {
        objectList.push(model);
      });
    } else {
      objectList.push(article[property]);
    }
  });

  // Remove duplicates
  const uniqueObjects = useRemoveDuplicates(objectList);

  // Sort keys from A - Ö
  const ascendingObjects = uniqueObjects.sort((a, b) =>
    a.name > b.name ? 1 : -1
  );

  const filteredList =
    query === ""
      ? ascendingObjects
      : ascendingObjects!.filter((object) => {
          return object.name.toLowerCase().includes(query.toLowerCase());
        });

  // Make this better
  useEffect(() => {
    if (selectedObject) {
      if (currentArticles && currentArticles.length > 1) {
        if (property == "vehicleModels") {
          const updateArticlesByProperty = articles.filter((article) =>
            article[property].some(
              (object) => object._id == selectedObject?._id
            )
          );
          setCurrentArticles(updateArticlesByProperty);
        } else {
          const updateArticlesByProperty = currentArticles.filter(
            (article) => article.inventoryLocation._id == selectedObject?._id
          );
          setCurrentArticles(updateArticlesByProperty);
        }
      } else if (articles) {
        const updateArticlesByProperty = articles.filter((article) =>
          article.vehicleModels.some(
            (vehicle) => vehicle._id == selectedObject?._id
          )
        );
        setCurrentArticles(updateArticlesByProperty);
      }
    } else {
      setCurrentArticles(articles);
    }
  }, [selectedObject]);

  return (
    <div
      className={clsx(
        property == "inventoryLocation"
          ? ` sm:min-w-[145px] sm:w-[145px]`
          : `sm:w-[220px] min-w-[220px] `,
        `flex w-full items-center gap-2 `
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
            type="search"
            placeholder={clsx(
              property == "inventoryLocation" ? `Lagerplats..` : `Modell..`
            )}
            className="w-full flex items-center rounded-md border-0 bg-white py-3.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(model: VehicleDocument) => model?.name}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>

          {!filteredList
            ? null
            : filteredList.length > 0 && (
                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {filteredList.map((object, i) => (
                    <Combobox.Option
                      key={i}
                      value={object}
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
                            {object.name}
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
      {selectedObject ? (
        <IconX
          xlinkTitle="Rensa sökfält"
          aria-label="Rensa sökfält"
          className="cursor-pointer hover:text-red-600"
          onClick={() => {
            setSelectedObject(null);
          }}
          width={16}
          height={16}
        />
      ) : null}
    </div>
  );
};

export default SearchBarKombo;
