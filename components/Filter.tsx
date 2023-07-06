import { useContext } from "react";
import { inventoryLocationContext } from "./context/InventoryLocationProvider";
import SearchBar from "./searchbars/SearchBar";
import SearchBarKombo from "./searchbars/SearchBarKombo";

const Filter = () => {
  const { inventoryLocations } = useContext(inventoryLocationContext);

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between mt-4 mb-8">
      <SearchBar />
      <div className="text-xs px-2 hidden sm:flex w-full sm:w-20 whitespace-nowrap justify-center  items-center">
        och / eller
      </div>
      <SearchBarKombo />
    </div>
  );
};

export default Filter;
