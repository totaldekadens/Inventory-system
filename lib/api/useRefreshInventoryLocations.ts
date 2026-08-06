// lib/useRefreshInventoryLocations.ts

import { inventoryLocationContext } from "@/components/context/InventoryLocationProvider";
import { inventoryLocationApi } from "@/lib/api/inventoryLocations";
import { useCallback, useContext } from "react";

export const useRefreshInventoryLocations = () => {
  const { setInventoryLocations } = useContext(inventoryLocationContext);

  return useCallback(async (): Promise<void> => {
    const inventoryLocations = await inventoryLocationApi.getAll();

    setInventoryLocations(inventoryLocations);
  }, [setInventoryLocations]);
};
