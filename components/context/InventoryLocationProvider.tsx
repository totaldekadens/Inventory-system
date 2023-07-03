import { InventoryLocationDocument } from "@/models/InventoryLocationModel";
import React, { useEffect } from "react";
import { FC, PropsWithChildren, useState } from "react";

interface inventoryLocationContextData {
  inventoryLocations: InventoryLocationDocument[] | null;
  setInventoryLocations: React.Dispatch<
    React.SetStateAction<InventoryLocationDocument[] | null>
  >;
}

export const inventoryLocationContext =
  React.createContext<inventoryLocationContextData>({
    inventoryLocations: [],
    setInventoryLocations: () => {},
  });

const InventoryLocationProvider: FC<PropsWithChildren> = (props) => {
  const [inventoryLocations, setInventoryLocations] = useState<
    InventoryLocationDocument[] | null
  >([]);

  return (
    <inventoryLocationContext.Provider
      value={{ inventoryLocations, setInventoryLocations }}
    >
      {props.children}
    </inventoryLocationContext.Provider>
  );
};

export default InventoryLocationProvider;
