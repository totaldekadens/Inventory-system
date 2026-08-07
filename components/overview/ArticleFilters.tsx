import { useContext, useEffect, useState } from "react";
import RadioButtons from "../ui/RadioButtons";
import { articleContext } from "../context/ArticleProvider";
import SearchBar from "../ui/SearchBar";
import SearchBarKombo from "../ui/SearchBarKombo";
import SelectSimple from "../ui/SelectSimple";
import {
  SaleFilter,
  saleOptions,
  StockFilter,
  stockOptions,
} from "@/lib/config";
import { formatDate } from "@/lib/formatDate";

const ArticleFilters = () => {
  const { setCurrentArticles, articles, currentArticles } =
    useContext(articleContext);

  const [query, setQuery] = useState("");

  const [saleFilter, setSaleFilter] = useState<SaleFilter>("all");

  const [selectedVehicleModel, setSelectedVehicleModel] = useState<any | null>(
    null,
  );

  const [selectedInventoryLocation, setSelectedInventoryLocation] = useState<
    any | null
  >(null);

  const [stockFilter, setStockFilter] = useState<StockFilter>("inStock");

  useEffect(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filteredArticles = articles.filter((article) => {
      const matchesSearch =
        normalizedQuery === "" ||
        article.artno?.toString().toLowerCase().includes(normalizedQuery) ||
        article.description?.toLowerCase().includes(normalizedQuery) ||
        article.supplierArtno?.toLowerCase().includes(normalizedQuery) ||
        article.comment?.toLowerCase().includes(normalizedQuery) ||
        article.title?.toLowerCase().includes(normalizedQuery);
      formatDate(article.createdDate).toLowerCase().includes(normalizedQuery) ||
        formatDate(article.lastUpdated)
          .toLowerCase()
          .includes(normalizedQuery) ||
        article.qty.toString().toLowerCase().includes(normalizedQuery) ||
        article.price?.toString().toLowerCase().includes(normalizedQuery) ||
        article.purchaseValue
          ?.toString()
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesSaleFilter =
        saleFilter === "all" ||
        (saleFilter === "forSale" && article.forSale) ||
        (saleFilter === "notForSale" && !article.forSale);

      const matchesVehicleModel =
        !selectedVehicleModel ||
        article.vehicleModels?.some(
          (vehicle) => vehicle._id === selectedVehicleModel._id,
        );

      const matchesStockFilter =
        stockFilter === "all" ||
        (stockFilter === "inStock" && (article.qty ?? 0) > 0) ||
        (stockFilter === "outOfStock" && (article.qty ?? 0) <= 0);

      const matchesInventoryLocation =
        !selectedInventoryLocation ||
        article.inventoryLocation?._id === selectedInventoryLocation._id;

      return (
        matchesSearch &&
        matchesSaleFilter &&
        matchesVehicleModel &&
        matchesInventoryLocation &&
        matchesStockFilter
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
    stockFilter,
  ]);

  const amountOfHits = currentArticles.length;

  return (
    <div className="mb-8 border-b-2">
      <div>
        <div className="w-full text-xl mb-2 font-semibold">Sök</div>
        <div className="mb-8 flex flex-col justify-between gap-4 sm:gap-0 md:flex-row">
          <SearchBar
            query={query}
            setQuery={setQuery}
            placeholder="Sök artikel..."
          />

          <div className="hidden items-center justify-center whitespace-nowrap py-2 text-xs sm:flex md:px-2 md:py-0" />

          <div className="flex flex-col sm:flex-row gap-4">
            <SearchBarKombo
              property="vehicleModels"
              selectedObject={selectedVehicleModel}
              setSelectedObject={setSelectedVehicleModel}
            />

            <SearchBarKombo
              property="inventoryLocation"
              selectedObject={selectedInventoryLocation}
              setSelectedObject={setSelectedInventoryLocation}
            />
          </div>
        </div>
      </div>
      <div className="w-full text-xl mb-2 font-semibold ">Filtrera</div>
      <div className="flex w-full gap-4 justify-between flex-wrap mb-4">
        <RadioButtons
          value={saleFilter}
          onChange={setSaleFilter}
          options={saleOptions}
          label="Visa:"
        />
        <SelectSimple
          label="Lagerstatus:"
          value={stockFilter}
          onChange={setStockFilter}
          options={stockOptions}
        />
      </div>

      <div>
        <div className="mt-6 mb-3 text-sm flex justify-end sm:justify-start">
          {amountOfHits > 0 &&
            amountOfHits + (amountOfHits > 1 ? " träffar" : " träff")}
        </div>
      </div>
    </div>
  );
};

export default ArticleFilters;
