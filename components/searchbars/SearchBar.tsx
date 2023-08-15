import clsx from "clsx";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Props {
  setFilteredObjectList: Dispatch<SetStateAction<any[] | []>>;
  listOfObjects: any[] | [];
  articles?: boolean;
}

const SearchBar = ({
  setFilteredObjectList,
  listOfObjects,
  articles,
}: Props) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const updateList = async () => {
      if (listOfObjects) {
        // If list of articles
        if (articles) {
          const filterList = listOfObjects.filter(
            (object) =>
              object.artno
                .toString()
                .toUpperCase()
                .includes(query.toUpperCase()) ||
              (object.description &&
                object.description
                  .toUpperCase()
                  .includes(query.toUpperCase())) ||
              (object.supplierArtno &&
                object.supplierArtno
                  .toUpperCase()
                  .includes(query.toUpperCase())) ||
              object.title.toUpperCase().includes(query.toUpperCase())
          );
          setFilteredObjectList(filterList);

          // If list of Vehicle models or Inventory locations
        } else {
          const filterList = listOfObjects.filter((object) =>
            object.name.toUpperCase().includes(query.toUpperCase())
          );
          setFilteredObjectList(filterList);
        }
      }
    };
    updateList();
  }, [query]);

  return (
    <div className="w-full">
      <div className="w-full">
        <input
          type="search"
          name="search"
          id="search"
          className={clsx(
            articles
              ? `py-1.5 placeholder:text-gray-500`
              : `py-1.5 placeholder:text-gray-400 h-11`,
            `block w-full rounded-md border-0  text-gray-900 ring-1  ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 md:h-auto`
          )}
          placeholder="Sök.."
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;
