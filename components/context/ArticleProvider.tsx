import { InventoryLocationDocument } from "@/models/InventoryLocationModel";
import { VehicleDocument } from "@/models/VehicleModel";
import { Types } from "mongoose";
import React, { useEffect } from "react";
import { FC, PropsWithChildren, useState } from "react";

export interface PopulatedArticleDocument {
  _id: Types.ObjectId;
  artno: number;
  supplierArtno?: string;
  vehicleModels: VehicleDocument[];
  title: string;
  description?: string;
  qty: number;
  condition: string;
  forSale: boolean;
  price?: number;
  inventoryLocation: InventoryLocationDocument;
  images: string[];
  purchaseValue?: number;
  comment?: string;
  issue?: [
    {
      sold: boolean;
      qty: number;
      unitPrice: number;
      comment?: string;
      date: Date;
    }
  ];
  createdDate: string;
  lastUpdated?: string;
}

interface articleContextData {
  currentArticles: PopulatedArticleDocument[] | [];
  setCurrentArticles: React.Dispatch<
    React.SetStateAction<PopulatedArticleDocument[] | []>
  >;
  articles: PopulatedArticleDocument[] | [];
  setArticles: React.Dispatch<
    React.SetStateAction<PopulatedArticleDocument[] | []>
  >;
}

export const articleContext = React.createContext<articleContextData>({
  currentArticles: [],
  setCurrentArticles: () => {},
  articles: [],
  setArticles: () => {},
});

const ArticlesProvider: FC<PropsWithChildren> = (props) => {
  const [articles, setArticles] = useState<PopulatedArticleDocument[] | []>([]);
  const [currentArticles, setCurrentArticles] = useState<
    PopulatedArticleDocument[] | []
  >([]);

  return (
    <articleContext.Provider
      value={{ articles, setArticles, currentArticles, setCurrentArticles }}
    >
      {props.children}
    </articleContext.Provider>
  );
};

export default ArticlesProvider;
