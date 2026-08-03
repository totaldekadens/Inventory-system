import { useContext, useEffect, useState } from "react";
import RadioButtons from "./buttons/RadioButtons";
import { articleContext } from "./context/ArticleProvider";
import SearchBar from "./searchbars/SearchBar";
import SearchBarKombo from "./searchbars/SearchBarKombo";
import { VehicleDocument } from "@/models/VehicleModel";

type SaleFilter = "all" | "forSale" | "notForSale";

const Filter = () => {
  const { setCurrentArticles, articles, currentArticles } =
    useContext(articleContext);

  const [query, setQuery] = useState("");

  const [saleFilter, setSaleFilter] = useState<SaleFilter>("all");

  const [selectedVehicleModel, setSelectedVehicleModel] =
    useState<VehicleDocument | null>(null);

  const [selectedInventoryLocation, setSelectedInventoryLocation] = useState<
    any | null
  >(null);

  useEffect(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filteredArticles = articles.filter((article) => {
      const matchesSearch =
        normalizedQuery === "" ||
        article.artno?.toString().toLowerCase().includes(normalizedQuery) ||
        article.description?.toLowerCase().includes(normalizedQuery) ||
        article.supplierArtno?.toLowerCase().includes(normalizedQuery) ||
        article.title?.toLowerCase().includes(normalizedQuery);

      const matchesSaleFilter =
        saleFilter === "all" ||
        (saleFilter === "forSale" && article.forSale) ||
        (saleFilter === "notForSale" && !article.forSale);

      const matchesVehicleModel =
        !selectedVehicleModel ||
        article.vehicleModels?.some(
          (vehicle) => vehicle._id === selectedVehicleModel._id,
        );

      const matchesInventoryLocation =
        !selectedInventoryLocation ||
        article.inventoryLocation?._id === selectedInventoryLocation._id;

      return (
        matchesSearch &&
        matchesSaleFilter &&
        matchesVehicleModel &&
        matchesInventoryLocation
      );
    });

    setCurrentArticles(filteredArticles);
  }, [
    articles,
    query,
    saleFilter,
    selectedVehicleModel,
    selectedInventoryLocation,
    setCurrentArticles,
  ]);

  const amountOfHits = currentArticles.length;

  return (
    <>
      <div className="flex w-full sm:justify-end">
        <RadioButtons value={saleFilter} onChange={setSaleFilter} />
      </div>

      <div className="mt-4 mb-8 flex flex-col justify-between gap-4 sm:gap-0 md:flex-row">
        <SearchBar query={query} setQuery={setQuery} />

        <div className="hidden items-center justify-center whitespace-nowrap py-2 text-xs sm:flex md:px-2 md:py-0" />

        <div className="sm:flex">
          <SearchBarKombo
            property="vehicleModels"
            selectedObject={selectedVehicleModel}
            setSelectedObject={setSelectedVehicleModel}
          />

          <div className="hidden items-center justify-center whitespace-nowrap px-2 text-xs sm:flex">
            och
          </div>

          <div className="px-2 py-2 sm:hidden" />

          <SearchBarKombo
            property="inventoryLocation"
            selectedObject={selectedInventoryLocation}
            setSelectedObject={setSelectedInventoryLocation}
          />
        </div>
      </div>
      <div>
        <div className="-mt-4 mb-3 text-sm">
          {amountOfHits > 0 &&
            amountOfHits + (amountOfHits > 1 ? " träffar" : " träff")}
        </div>
      </div>
    </>
  );
};

export default Filter;
