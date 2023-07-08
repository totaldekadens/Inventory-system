import {
  IconCurrencyKroneSwedish,
  IconPackages,
  IconServer2,
} from "@tabler/icons-react";
import { useContext } from "react";
import { inventoryLocationContext } from "./context/InventoryLocationProvider";

const Stats = () => {
  const { inventoryLocations } = useContext(inventoryLocationContext);
  // Total amount of articles
  /*   let totalAmount = currentArticles
    ? currentArticles.reduce((sum, item) => sum + item.qty, 0)
    : null; */

  /*   let totalSum = currentArticles?.reduce(
    (sum, item) => sum + (item.price ? item.price : 0) * item.qty,
    0
  ); */
  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 mt-20">
      <div className="flex-1 w-full sm:w-auto text-gray-800  justify-center flex items-center flex-col p-7 gap-4">
        <IconPackages width={38} height={38} className="text-[#264133]" />{" "}
        <p>Du har lagt in totalt:</p>
        <p className="font-semibold text-xl ">
          {/* totalAmount ? totalAmount : */} 5 produkter
        </p>
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

        <p className="font-semibold text-xl ">{/* {totalSum} */} 499 kr</p>
      </div>
    </div>
  );
};

export default Stats;
