import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { IconX } from "@tabler/icons-react";
import HandleVehicleModel from "./HandleVehicleModel";
import NewVehicleModel from "./NewVehicleModel";
import { vehicleContext } from "../context/VehicleProvider";
import SearchBar from "../searchbars/SearchBar";

interface Props {
  setHandleVehicleModels: Dispatch<SetStateAction<boolean>>;
}

const HandleVehicleModels = ({ setHandleVehicleModels }: Props) => {
  const { vehicles, setVehicles } = useContext(vehicleContext);
  const [filteredVehicles, setFilteredVehicles] = useState(vehicles);

  // If InventoryLocations change, update filteredLocatons
  useEffect(() => {
    setFilteredVehicles(vehicles);
  }, [vehicles]);

  return (
    <div className="pt-5 sm:pt-0 pb-10  sm:px-2 sm:pb-16 rounded-lg w-full  overflow-y-auto">
      <div className="flex sm:hidden  w-full justify-end px-5 ">
        <IconX
          className="cursor-pointer"
          width={32}
          height={32}
          onClick={() => {
            setHandleVehicleModels(false);
          }}
        />
      </div>
      <div className="pt-5 sm:pt-0 w-full flex sm:items-center justify-center sm:rounded-lg">
        <div className="px-4 py-5 bg-white w-full">
          <div className=" w-full flex justify-between mb-4">
            <h3 className="text-3xl font-normal leading-6 text-gray-900">
              Hantera modeller
            </h3>
            <IconX
              className="cursor-pointer hidden sm:block"
              onClick={() => {
                setHandleVehicleModels(false);
              }}
            />
          </div>
          {/* Add new inventory location */}
          <div>
            <div className="py-2 text-sm mt-10  font-semibold text-gray-900 text-start max-w-[150px] w-[150px]">
              Lägg till modell
            </div>
            <div className="divide-gray-200 relative bg-white divide-y">
              <NewVehicleModel />
            </div>
          </div>
          {/* Divider line */}
          <div className="w-full my-10 bg-gray-300 rounded-lg h-[2px]" />

          <div className="py-2 text-sm  mt-10  font-semibold text-gray-900 text-start max-w-[200px] w-[200px]">
            Ändra / Ta bort modell
          </div>
          {/* Search inventory location */}
          <div className=" mt-3 ">
            <div className="divide-gray-200 relative bg-[#f4f4f4] divide-y">
              <SearchBar
                setFilteredObjectList={setFilteredVehicles}
                listOfObjects={vehicles}
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
                </div>
                <div className="py-2 text-sm font-semibold text-gray-900 ">
                  <span className=""></span>
                </div>
              </div>
            </div>
            <div className="divide-y w-full divide-gray-300 relative bg-white">
              {filteredVehicles.length > 0
                ? filteredVehicles.map((model, i) => (
                    <HandleVehicleModel key={i} model={model} />
                  ))
                : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandleVehicleModels;
