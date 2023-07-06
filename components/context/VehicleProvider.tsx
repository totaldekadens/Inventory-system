import { VehicleDocument } from "@/models/VehicleModel";
import React, { useEffect } from "react";
import { FC, PropsWithChildren, useState } from "react";

interface vehicleContextData {
  vehicles: VehicleDocument[] | null;
  setVehicles: React.Dispatch<React.SetStateAction<VehicleDocument[] | null>>;
}

export const vehicleContext = React.createContext<vehicleContextData>({
  vehicles: [],
  setVehicles: () => {},
});

const VehicleProvider: FC<PropsWithChildren> = (props) => {
  const [vehicles, setVehicles] = useState<VehicleDocument[] | null>([]);

  return (
    <vehicleContext.Provider value={{ vehicles, setVehicles }}>
      {props.children}
    </vehicleContext.Provider>
  );
};

export default VehicleProvider;
