import { useContext, useEffect, useRef, useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import { articleContext } from "../context/ArticleProvider";
import { IconX } from "@tabler/icons-react";
import { VehicleDocument } from "@/models/VehicleModel";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const SearchBarKomboModels = () => {
  const { currentArticles, setCurrentArticles, articles } =
    useContext(articleContext);
  const [query, setQuery] = useState("");

  const [selectedModel, setSelectedModel] = useState<VehicleDocument | null>(
    null
  );
  const selectedModelRef = useRef<VehicleDocument | null>(null);
  selectedModelRef.current = selectedModel;

  const modelList: VehicleDocument[] = [];
  currentArticles.forEach((article) => {
    article.vehicleModels.forEach((model) => {
      modelList.push(model);
    });
  });

  // Remove duplicates
  const uniqueModels: VehicleDocument[] = modelList.reduce(
    (accumulator: VehicleDocument[], current) => {
      if (
        !accumulator.find((item: VehicleDocument) => item._id === current._id)
      ) {
        accumulator.push(current);
      }
      return accumulator;
    },
    []
  );

  // Sort keys from A - Ö
  const ascendingModels = uniqueModels.sort((a, b) => (a > b ? 1 : -1));

  const filteredModel =
    query === ""
      ? ascendingModels
      : ascendingModels!.filter((model) => {
          return model.name.toLowerCase().includes(query.toLowerCase());
        });

  // Make this better
  useEffect(() => {
    if (selectedModel) {
      if (currentArticles && currentArticles.length > 1) {
        const updateArticlesByLocation = articles.filter((article) =>
          article.vehicleModels.some(
            (vehicle) => vehicle._id == selectedModel?._id
          )
        );
        setCurrentArticles(updateArticlesByLocation);
      } else if (articles) {
        const updateArticlesByLocation = articles.filter((article) =>
          article.vehicleModels.some(
            (vehicle) => vehicle._id == selectedModel?._id
          )
        );
        setCurrentArticles(updateArticlesByLocation);
      }
    } else {
      setCurrentArticles(articles);
    }
  }, [selectedModel]);

  return (
    <div className="flex w-full sm:w-[220px] min-w-[220px] items-center gap-2 ">
      <Combobox
        className="w-full"
        as="div"
        value={selectedModel}
        onChange={setSelectedModel}
      >
        <div className="relative w-full sm:w-auto flex items-center">
          <Combobox.Input
            type="search"
            placeholder="Modell.."
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

          {!filteredModel
            ? null
            : filteredModel.length > 0 && (
                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {filteredModel.map((model, i) => (
                    <Combobox.Option
                      key={i}
                      value={model}
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
                            {model.name}
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
      {selectedModel ? (
        <IconX
          xlinkTitle="Rensa sökfält"
          aria-label="Rensa sökfält"
          className="cursor-pointer hover:text-red-600"
          onClick={() => {
            setSelectedModel(null);
          }}
          width={16}
          height={16}
        />
      ) : null}
    </div>
  );
};

export default SearchBarKomboModels;
