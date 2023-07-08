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
    <div className="flex flex-col sm:flex-row items-center gap-6 mt-20">
      {currentArticles.length > 0 ? (
        <>
          <div className="flex-1 w-full sm:w-auto text-gray-800  justify-center flex items-center flex-col p-7 gap-4">
            <IconPackages width={38} height={38} className="text-[#264133]" />{" "}
            <p>Du har lagt in totalt:</p>
            <p className="font-semibold text-xl ">{totalQty} produkter</p>
          </div>
          <div className="flex-1 w-full sm:w-auto  text-gray-800   justify-center flex items-center flex-col p-7 gap-4">
            <IconServer2 width={38} height={38} className="text-[#264133]" />
            <p>Du har totalt:</p>

            <p className="font-semibold text-xl ">
              {inventoryLocations?.length} st lagerplatser
            </p>
          </div>
          <div className="flex-1 w-full sm:w-auto  text-gray-800  justify-center flex items-center flex-col p-7 gap-4">
            <IconCurrencyKroneSwedish
              width={38}
              height={38}
              className="text-[#264133]"
            />
            <p>Du har ett försäljningsvärde på totalt:</p>

            <p className="font-semibold text-xl ">{getTotalSales} kr</p>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Stats;
