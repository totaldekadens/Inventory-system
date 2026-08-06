import { articleContext } from "@/components/context/ArticleProvider";
import { InventoryLocationDocument } from "@/models/InventoryLocationModel";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { ErrorMessage } from "../articleForm/NewArticle";
import Button from "@/components/ui/Button";
import { IconRestore } from "@tabler/icons-react";
import clsx from "clsx";
import { inventoryLocationContext } from "@/components/context/InventoryLocationProvider";
import SearchSelect from "@/components/ui/SearchSelect";
import { useRefreshArticles } from "@/lib/useRefreshArticles";

interface Props {
  selectedLocation: InventoryLocationDocument | null;
  setSelectedLocation: Dispatch<
    SetStateAction<InventoryLocationDocument | null>
  >;
}

const VIRTUAL_LOCATION_ID = "64a95847dec1488ee60d10cd";

const ArticleLocationSection = ({
  selectedLocation,
  setSelectedLocation,
}: Props) => {
  const { currentArticle, setSectionDirty } = useContext(articleContext);
  if (!currentArticle) return;
  const [error, setError] = useState<string>("");
  const { inventoryLocations } = useContext(inventoryLocationContext);
  const refreshArticles = useRefreshArticles();
  const inventoryLocationOptions = inventoryLocations
    .filter((location) => String(location._id) !== VIRTUAL_LOCATION_ID)
    .map((location) => ({
      key: String(location._id),
      value: location,
      label: location.name,
    }));

  const selectedLocationOption =
    selectedLocation /* && String(selectedLocation._id) !== VIRTUAL_LOCATION_ID */
      ? {
          key: String(selectedLocation._id),
          value: selectedLocation,
          label: selectedLocation.name,
        }
      : null;

  const handleSubmit = async () => {
    try {
      if (!selectedLocation) {
        setError("Lagerplatsen får inte vara tom");
        return;
      }

      const updatedArticle = {
        articleId: currentArticle._id,
        newLocationId: selectedLocation._id,
      };

      const response = await fetch("/api/article/move", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedArticle),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(
          "Lagerplatsen kunde inte uppdateras. Meddelande: " + result.data,
        );
        return;
      }

      setSectionDirty("location", false);
      await refreshArticles();

      alert("Lagerplatsen är uppdaterad!"); // Fix a proper pop up later. Ask if you want to continue or close window
    } catch (err) {
      console.error(err);
      setError("Ett oväntat fel inträffade.");
    }
  };

  useEffect(() => {
    setError("");
  }, [selectedLocation]);

  const locationIsNotChanged =
    currentArticle.inventoryLocation._id.toString() ===
    selectedLocation?._id.toString();

  useEffect(() => {
    setSectionDirty("location", !locationIsNotChanged);

    return () => {
      setSectionDirty("location", false);
    };
  }, [locationIsNotChanged, setSectionDirty]);

  return (
    <div>
      <div className="font-bold text-xl mt-6 mb-2">Lagerplats</div>
      {String(currentArticle.inventoryLocation?._id) == VIRTUAL_LOCATION_ID ? (
        <div>
          <div className="font-medium">
            {currentArticle.inventoryLocation.name}
          </div>

          <div className="mt-1 text-sm text-gray-600">
            Lagerplats 00 är en virtuell lagerplats för artiklar med lagersaldo
            0. När saldot blir 0 flyttas artikeln automatiskt hit. För att välja
            en annan lagerplats behöver du först lägga till artiklar i
            lagersaldot.
          </div>
        </div>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit();
          }}
        >
          <div className="w-full flex flex-wrap gap-3">
            {/* Inventory location */}
            <div className="relative">
              <SearchSelect
                options={inventoryLocationOptions}
                selectedOption={selectedLocationOption}
                onChange={(option) => {
                  setSelectedLocation(option?.value ?? null);
                  setError("");
                }}
                placeholder="Välj lagerplats"
                disabled={String(currentArticle?._id) == VIRTUAL_LOCATION_ID}
              />
              {!locationIsNotChanged && (
                <div
                  className="absolute top-full left-0 hover:underline text-indigo-800 text-sm cursor-pointer mt-2 px-1 flex gap-1 items-center"
                  onClick={() => {
                    setSelectedLocation(currentArticle.inventoryLocation);
                    setError("");
                  }}
                >
                  {<IconRestore size={16} />}
                  Återställ till lagerplats:{" "}
                  {currentArticle.inventoryLocation.name}{" "}
                </div>
              )}
            </div>
            {error && (
              <div className={clsx("mt-4")}>
                <ErrorMessage message={error} />
              </div>
            )}
          </div>

          <div>
            <div className="w-full mt-12 sm:mt-6 sm:w-auto flex flex-col sm:flex-row gap-2 justify-end">
              <div className="flex flex-col gap-2">
                <Button
                  variant="positive"
                  type="submit"
                  className="px-3 py-3 text-sm font-semibold "
                  disabled={locationIsNotChanged}
                >
                  Uppdatera lagerplats
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ArticleLocationSection;
