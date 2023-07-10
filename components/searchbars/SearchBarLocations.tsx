import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { inventoryLocationContext } from "../context/InventoryLocationProvider";
import { InventoryLocationDocument } from "@/models/InventoryLocationModel";

interface Props {
  setFilteredLocations: Dispatch<
    SetStateAction<InventoryLocationDocument[] | []>
  >;
}

const SearchBarLocations = ({ setFilteredLocations }: Props) => {
  const { inventoryLocations, setInventoryLocations } = useContext(
    inventoryLocationContext
  );
  const [query, setQuery] = useState("");

  // Filtering articles depending on search input.
  useEffect(() => {
    const updateInventoryLocations = async () => {
      if (inventoryLocations) {
        const filterLocations = inventoryLocations.filter((location) =>
          location.name.toUpperCase().includes(query.toUpperCase())
        );
        setFilteredLocations(filterLocations);
      }
    };
    updateInventoryLocations();
  }, [query]);

  return (
    <div className="w-full">
      <div className="w-full">
        <input
          type="search"
          name="search"
          id="search"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 h-11 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 md:h-auto"
          placeholder="Sök.."
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
      </div>
    </div>
  );
};

export default SearchBarLocations;
