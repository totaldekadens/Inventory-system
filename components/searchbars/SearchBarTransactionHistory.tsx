import { TransactionHistoryDocument } from "@/models/TransactionHistoryModel";
import { IconChevronsDownLeft } from "@tabler/icons-react";
import clsx from "clsx";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Props {
  setFilteredObjectList: Dispatch<
    SetStateAction<TransactionHistoryDocument[] | []>
  >;
  listOfObjects: TransactionHistoryDocument[] | [];
  history: TransactionHistoryDocument[] | [];
}

const SearchBar = ({
  setFilteredObjectList,
  listOfObjects,
  history,
}: Props) => {
  const [query, setQuery] = useState("");
  const [query2, setQuery2] = useState("");

  useEffect(() => {
    const updateList = async () => {
      if (listOfObjects) {
        const filterList = listOfObjects.filter(
          (object) =>
            object.article.artno
              .toString()
              .toUpperCase()
              .includes(query.toUpperCase()) ||
            (object.article.description &&
              object.article.description
                .toUpperCase()
                .includes(query.toUpperCase())) ||
            (object.article.supplierArtno &&
              object.article.supplierArtno
                .toUpperCase()
                .includes(query.toUpperCase())) ||
            object.article.title.toUpperCase().includes(query.toUpperCase()) ||
            object.comment?.toUpperCase().includes(query.toUpperCase()) ||
            object.cause?.toUpperCase().includes(query.toUpperCase()) ||
            object.createdDate.toUpperCase().includes(query.toUpperCase())
        );

        if (query) {
          setFilteredObjectList(filterList);
        } else if (!query && !query2) {
          setFilteredObjectList(history);
        } else {
          setFilteredObjectList(listOfObjects);
        }
      }
    };
    updateList();
  }, [query]);

  useEffect(() => {
    const updateList = async () => {
      if (listOfObjects) {
        // If list of articles
        const filterList = listOfObjects.filter((object) =>
          object.article.artno
            .toString()
            .toUpperCase()
            .includes(query2.toUpperCase())
        );
        if (query2) {
          setFilteredObjectList(filterList);
        } else if (!query && !query2) {
          setFilteredObjectList(history);
        } else {
          setFilteredObjectList(listOfObjects);
        }
      }
    };
    updateList();
  }, [query2]);

  return (
    <div className="w-full flex gap-2">
      <div className="w-full">
        <input
          type="search"
          name="search"
          id="search"
          className={clsx(
            `py-3.5 placeholder:text-gray-500 block w-full rounded-md border-0  text-gray-900 ring-1  ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 md:h-auto`
          )}
          placeholder="Sök.."
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
      </div>
      <div className="w-md">
        <input
          type="search"
          name="search"
          id="search"
          className={clsx(
            `py-3.5 placeholder:text-gray-500 block w-full rounded-md border-0  text-gray-900 ring-1  ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 md:h-auto`
          )}
          placeholder="Art. no.."
          onChange={(event) => setQuery2(event.currentTarget.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;
