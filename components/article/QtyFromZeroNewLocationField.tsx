import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import SearchSelect from "../ui/SearchSelect";
import { inventoryLocationContext } from "../context/InventoryLocationProvider";
import { InventoryLocationDocument } from "@/models/InventoryLocationModel";
import { PopulatedArticleDocument } from "../context/ArticleProvider";
import { transactionHistoryApi } from "@/lib/api/transactionHistory";

interface Props {
  selectedLocation: InventoryLocationDocument | null;
  setSelectedLocation: Dispatch<
    SetStateAction<InventoryLocationDocument | null>
  >;
  setError: Dispatch<SetStateAction<string>>;
  article: PopulatedArticleDocument;
}

const VIRTUAL_LOCATION_ID = "64a95847dec1488ee60d10cd";

const QtyFromZeroNewLocation = ({
  selectedLocation,
  setSelectedLocation,
  article,
  setError,
}: Props) => {
  const [previousLocation, setPeviousLocation] =
    useState<InventoryLocationDocument | null>(null);

  const { inventoryLocations } = useContext(inventoryLocationContext);

  const inventoryLocationOptions = inventoryLocations
    .filter((location) => String(location._id) !== VIRTUAL_LOCATION_ID)
    .map((location) => ({
      key: String(location._id),
      value: location,
      label: location.name,
    }));

  const selectedLocationOption =
    selectedLocation && String(selectedLocation._id) !== VIRTUAL_LOCATION_ID
      ? {
          key: String(selectedLocation._id),
          value: selectedLocation,
          label: selectedLocation.name,
        }
      : null;

  useEffect(() => {
    const fetchPreviousInventoryLocation = async () => {
      try {
        const articleHistory = await transactionHistoryApi.getByArticleNumber(
          article.artno,
        );

        const filteredHistory = articleHistory.filter(
          (item) =>
            !item.direction &&
            item.toLocation?._id.toString() === VIRTUAL_LOCATION_ID &&
            item.fromLocation?._id.toString() !== VIRTUAL_LOCATION_ID,
        );
        if (filteredHistory.length === 0) return;

        const latestUsedAndRealInventoryLocation =
          filteredHistory[0].fromLocation; // redan sorterad i backend

        if (latestUsedAndRealInventoryLocation) {
          setPeviousLocation(latestUsedAndRealInventoryLocation);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchPreviousInventoryLocation();
  }, [article]);

  return (
    <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-3">
      <p className="font-semibold">Välj ny lagerplats</p>

      <p className="mt-1 text-gray-700 whitespace-normal">
        Artikeln ligger på den virtuella lagerplatsen 00. När saldot höjs
        behöver artikeln placeras på en riktig lagerplats.
      </p>
      {previousLocation && (
        <p className="mt-2 text-gray-700 ">
          Artikeln låg senast på:{" "}
          <span className="font-bold">{previousLocation.name}</span>
        </p>
      )}

      <SearchSelect
        options={inventoryLocationOptions}
        selectedOption={selectedLocationOption}
        onChange={(option) => {
          setSelectedLocation(option?.value ?? null);
          setError("");
        }}
        placeholder="Välj lagerplats"
      />
    </div>
  );
};

export default QtyFromZeroNewLocation;
