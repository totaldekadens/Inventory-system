import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { IconX } from "@tabler/icons-react";
import { inventoryLocationContext } from "../context/InventoryLocationProvider";
import HandleLocation from "./HandleLocation";
import NewLocation from "./NewLocation";
import SearchBar from "../searchbars/SearchBar";

interface Props {
  setHandleLocations: Dispatch<SetStateAction<boolean>>;
}

const HandleLocations = ({ setHandleLocations }: Props) => {
  const { inventoryLocations, setInventoryLocations } = useContext(
    inventoryLocationContext
  );
  const [filteredLocations, setFilteredLocations] =
    useState(inventoryLocations);

  // If InventoryLocations change, update filteredLocatons
  useEffect(() => {
    setFilteredLocations(inventoryLocations);
  }, [inventoryLocations]);

  return (
    <div className="pt-10 sm:pt-0 z-20 fixed inset-0 bg-black/20 flex justify-center ">
      <div className="pt-5 sm:pt-0 pb-10  sm:px-2 sm:pb-16 shadow-lg rounded-lg absolute top-0 bottom-0 my-0 sm:my-10 md:my-20 w-full  sm:w-8/12 sm:max-w-[770px]  bg-white overflow-y-auto">
        <div className="flex sm:hidden  w-full justify-end px-5 ">
          <IconX
            className="cursor-pointer"
            width={32}
            height={32}
            onClick={() => {
              setHandleLocations(false);
            }}
          />
        </div>
        <div className="pt-5 sm:pt-0 w-full flex sm:items-center justify-center sm:rounded-lg">
          <div className="px-4 py-5 bg-white w-full">
            <div className=" w-full flex justify-between mb-4">
              <h3 className="text-xl font-medium leading-6 text-gray-900">
                Hantera lagerplatser
              </h3>
              <IconX
                className="cursor-pointer hidden sm:block"
                onClick={() => {
                  setHandleLocations(false);
                }}
              />
            </div>
            {/* Add new inventory location */}
            <div>
              <div className="py-2 text-sm mt-10  font-semibold text-gray-900 text-start max-w-[150px] w-[150px]">
                Lägg till lagerplats
              </div>
              <div className="divide-gray-200 relative bg-white divide-y">
                {" "}
                {/* border border-t-0 border-x-0 border-b-gray-300  */}
                <NewLocation />
              </div>
            </div>

            <div className="w-full my-10 bg-gray-300 rounded-lg h-[2px]" />

            <div className="py-2 text-sm  mt-10  font-semibold text-gray-900 text-start max-w-[200px] w-[200px]">
              Ändra / Ta bort lagerplats
            </div>
            {/* Search inventory location */}
            <div className=" mt-3 ">
              <div className="divide-gray-200 relative bg-[#f4f4f4] divide-y">
                <SearchBar
                  setFilteredObjectList={setFilteredLocations}
                  listOfObjects={inventoryLocations}
                />
              </div>
            </div>

            {/* Inventory list with Edit */}
            <div className="w-full mt-3 ">
              <div className="w-full flex">
                <div className="w-full flex justify-between">
                  <div className="flex">
                    <div className="py-2 text-sm pl-2 font-semibold text-gray-900 text-start max-w-[150px] w-[150px]">
                      Namn
                    </div>
                    <div className="py-2 pl-2 text-sm font-semibold text-gray-900 text-start ">
                      Beskrivning
                    </div>
                  </div>
                  <div className="py-2 text-sm font-semibold text-gray-900 ">
                    <span className=""></span>
                  </div>
                </div>
              </div>
              <div className="divide-y w-full divide-gray-300 relative bg-white">
                {filteredLocations.length > 0
                  ? filteredLocations.map((location, i) => (
                      <HandleLocation key={i} location={location} />
                    ))
                  : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandleLocations;
