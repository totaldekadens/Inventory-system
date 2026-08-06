import { vehicleContext } from "@/components/context/VehicleProvider";
import { vehicleApi } from "@/lib/api/vehicles";
import { useCallback, useContext } from "react";

export const useRefreshVehicles = () => {
  const { setVehicles } = useContext(vehicleContext);
  console.log("Komemr jag hit????? ");
  return useCallback(async (): Promise<void> => {
    const vehicles = await vehicleApi.getAll();

    setVehicles(vehicles);
  }, [setVehicles]);
};
