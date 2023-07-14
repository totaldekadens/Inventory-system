import { IconEdit } from "@tabler/icons-react";
import { PopulatedArticleDocument } from "../../context/ArticleProvider";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import clsx from "clsx";

interface ItemInfoProps {
  name: string;
  value: string | number;
  className?: string;
}

const ItemInfo = ({ name, value }: ItemInfoProps) => (
  <div>
    <div className=" font-medium text-gray-900 mt-4 lg:mt-8  ">{name}</div>
    <div className="text-gray-900/80">{value}</div>
  </div>
);

const ItemInfoSmall = ({ name, value, className }: ItemInfoProps) => (
  <div className={clsx(`grid grid-cols-2`, className)}>
    <p className=" tracking-tight text-gray-900/80">{name}</p>
    <p> {value} </p>
  </div>
);

interface Props {
  article: PopulatedArticleDocument;
  className?: string;
  setEdit: Dispatch<SetStateAction<boolean>>;
}
const SidebarRead = ({ article, className, setEdit }: Props) => {
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
        <ItemInfo name="Skick" value={article.condition} />
        <ItemInfo name="Plats" value={article.inventoryLocation.name} />
        <ItemInfo name="Antal" value={article.qty} />
      </div>
      <ItemInfo
        name="Beskrivning"
        value={article.description ? article.description : "Ingen beskrivning"}
      />

      <div className="mt-4 lg:row-span-3 lg:mt-8">
        <div className="w-full flex justify-between">
          <div className=" font-medium text-gray-900 mt-2 ">
            Mer information
          </div>
        </div>
        <ItemInfoSmall name="Art.no" value={article.artno} />
        <ItemInfoSmall
          name="Lev. art. no: "
          value={article.supplierArtno ? article.supplierArtno : "-"}
        />
        <div className=" grid grid-cols-2">
          <p className=" tracking-tight text-gray-900/80">
            {article.vehicleModels?.length > 1
              ? "Fordonsmodeller: "
              : "Fordonsmodell: "}
          </p>
          <div>
            {article.vehicleModels?.map((model, i) => (
              <p key={i} className=" ">
                {model.name}
              </p>
            ))}
          </div>
        </div>
        <ItemInfoSmall
          name="Försäljningspris:"
          value={article.price ? article.price + " kr" : "-"}
        />
        <ItemInfoSmall
          name="Inköpspris:"
          value={article.purchaseValue ? article.purchaseValue + " kr" : "-"}
        />
        <ItemInfoSmall
          name="Senast uppdaterad:"
          value={
            article.lastUpdated ? article.lastUpdated : article.createdDate
          }
        />
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
