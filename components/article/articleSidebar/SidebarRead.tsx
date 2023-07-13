import { IconEdit } from "@tabler/icons-react";
import { PopulatedArticleDocument } from "../../context/ArticleProvider";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Props {
  article: PopulatedArticleDocument;
  className?: string;
  setEdit: Dispatch<SetStateAction<boolean>>;
}
const SidebarRead = ({ article, className, setEdit }: Props) => {
  useEffect(() => {
    const getHistory = async () => {
      const response = await fetch("/api/transactionhistory/" + article.artno);
      const result = await response.json();
      console.log(result);
    };
    getHistory();
  });
  return (
    <aside className={className} style={{ maxWidth: "600px" }}>
      <div className="flex justify-between mb-4">
        <div>
          <h1 className="text-xl font-medium text-gray-900">{article.title}</h1>
          <p className="text-lg font-medium tracking-tight text-gray-900/70 ">
            {article.supplierArtno}
          </p>
        </div>

        <IconEdit onClick={() => setEdit(true)} className="cursor-pointer" />
      </div>
      <div className="flex justify-between flex-wrap">
        <div>
          <div className=" font-medium text-gray-900 mt-4 lg:mt-8  ">Skick</div>
          <div className="text-gray-900/80">{article.condition}</div>
        </div>
        <div>
          <div className=" font-medium text-gray-900 mt-4 lg:mt-8  ">Plats</div>
          <div className="text-gray-900/80">
            {article.inventoryLocation.name}
          </div>
        </div>
        <div>
          <div className=" font-medium text-gray-900 mt-4 lg:mt-8">Antal</div>
          <div className="text-gray-900/80">{article.qty} st</div>
        </div>
      </div>

      <div>
        <div className=" font-medium text-gray-900 mt-4 lg:mt-8">
          Beskrivning
        </div>
        <div className="text-gray-900/80">
          {article.description ? article.description : "Ingen beskrivning"}
        </div>
      </div>

      <div className="mt-4 lg:row-span-3 lg:mt-8">
        <div className="w-full flex justify-between">
          <div className=" font-medium text-gray-900 mt-2 ">
            Mer information
          </div>
        </div>
        <div className=" grid grid-cols-2">
          <p className=" tracking-tight text-gray-900/80">Art. no:</p>
          <p>{article.artno}</p>
        </div>
        <div className=" grid grid-cols-2">
          <p className=" tracking-tight text-gray-900/80">Lev. art. no: </p>
          <p> {article.supplierArtno ? article.supplierArtno : "-"}</p>
        </div>
        <div className=" grid grid-cols-2">
          <p className=" tracking-tight text-gray-900/80">Fordonsmodell: </p>
          {article.vehicleModels?.map((model, i) => (
            <p key={i} className=" ">
              {model.name}
              {article.vehicleModels && article.vehicleModels.length - 1 == i
                ? ""
                : ", "}
            </p>
          ))}
        </div>
        <div className=" grid grid-cols-2">
          <p className=" tracking-tight text-gray-900/80">Försäljningspris:</p>
          <p>{article.price ? article.price + " kr" : "-"}</p>
        </div>
        <div className=" grid grid-cols-2">
          <p className=" tracking-tight text-gray-900/80">Inköpspris: </p>
          <p> {article.purchaseValue ? article.purchaseValue + " kr" : "-"} </p>
        </div>

        <div className=" grid grid-cols-2">
          <p className=" tracking-tight text-gray-900/80">
            Senast uppdaterad:{" "}
          </p>
          <p>
            {" "}
            {article.lastUpdated ? article.lastUpdated : article.createdDate}
          </p>
        </div>

        {/* For sale */}
        <div>
          <div className=" font-medium text-gray-900 mt-4 lg:mt-8">Säljas?</div>
          <div className="text-gray-900/80">
            {article.forSale ? "Ja" : "Nej"}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarRead;
