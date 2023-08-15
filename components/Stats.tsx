import {
  IconCurrencyKroneSwedish,
  IconPackages,
  IconServer2,
} from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";
import { inventoryLocationContext } from "./context/InventoryLocationProvider";
import { articleContext } from "./context/ArticleProvider";

const Stats = () => {
  const { inventoryLocations } = useContext(inventoryLocationContext);
  const { currentArticles } = useContext(articleContext);

  // Gets total qty of articles in stock. Couldn't do reduce right away.
  const getQty = currentArticles.map((article) => Number(article.qty));
  const totalQty = getQty.reduce((sum, item) => sum + item, 0);

  // Gets total sales price of articles in stock. Couldn't do reduce right away.
  const filterSales = currentArticles.filter((article) => article.price);
  const newArray = filterSales.map((article) => ({
    qty: article.qty,
    price: article.price ? article.price : 0,
  }));
  const getTotalSales = newArray.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <>
      <div className="flex flex-col  items-center w-full text-custom-50 mt-10  sm:gap-0 relative">
        {currentArticles.length > 0 ? (
          <div className="w-full flex flex-col gap-8">
            <div className="flex justify-between flex-col gap-8 sm:gap-0 sm:flex-row w-full">
              <div
                style={{ mixBlendMode: "difference", color: "white" }}
                className="  justify-center flex items-center flex-col p-0 gap-2 "
              >
                <IconPackages
                  width={60}
                  height={60}
                  strokeWidth={1}
                  className="text-custom-50 drop-shadow-text"
                />{" "}
                <p className="whitespace-nowrap drop-shadow-text">
                  Du har lagt in totalt:
                </p>
                <p className="font-semibold text-lg drop-shadow-text">
                  {totalQty} produkter
                </p>
              </div>
              <div className="justify-center flex items-center flex-col p-0 gap-2">
                <IconCurrencyKroneSwedish
                  strokeWidth={1}
                  width={60}
                  height={60}
                  className="text-custom-50 drop-shadow-text"
                />
                <p className="whitespace-nowrap drop-shadow-text">
                  Ditt totala försäljningsvärde:
                </p>

                <p className="font-semibold text-lg drop-shadow-text ">
                  {getTotalSales} kr
                </p>
              </div>
            </div>
            <div className="flex justify-center w-full md:absolute md:-bottom-32">
              <div className="flex-1 w-full sm:w-auto justify-center flex items-center flex-col p-0 gap-2">
                <IconServer2
                  strokeWidth={1}
                  width={60}
                  height={60}
                  className="text-custom-50 drop-shadow-text"
                />
                <p className="whitespace-nowrap drop-shadow-text">
                  Du har totalt:
                </p>

                <p className="font-semibold text-lg whitespace-nowrap drop-shadow-text">
                  {inventoryLocations?.length} st lagerplatser
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <style></style>
    </>
  );
};

export default Stats;
