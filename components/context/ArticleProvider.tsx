import { InventoryLocationDocument } from "@/models/InventoryLocationModel";
import { VehicleDocument } from "@/models/VehicleModel";
import { Types } from "mongoose";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { FC, PropsWithChildren, useState } from "react";

type DirtySection = "quantity" | "location" | "info";
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
  createdDate: Date;
  lastUpdated: Date;
}

interface articleContextData {
  currentArticles: PopulatedArticleDocument[] | [];
  setCurrentArticles: Dispatch<SetStateAction<PopulatedArticleDocument[] | []>>;
  articles: PopulatedArticleDocument[] | [];
  setArticles: Dispatch<SetStateAction<PopulatedArticleDocument[] | []>>;
  currentArticle: PopulatedArticleDocument | undefined;
  setCurrentArticle: Dispatch<
    SetStateAction<PopulatedArticleDocument | undefined>
  >;
  dirtySections: Record<DirtySection, boolean>;

  setSectionDirty: (section: DirtySection, dirty: boolean) => void;

  isDirty: boolean;

  resetDirtySections: () => void;
}

export const articleContext = React.createContext<articleContextData>({
  currentArticles: [],
  setCurrentArticles: () => {},
  articles: [],
  setArticles: () => {},
  currentArticle: undefined,
  setCurrentArticle: () => {},
  dirtySections: {
    quantity: false,
    location: false,
    info: false,
  },

  setSectionDirty: () => {},
  isDirty: false,
  resetDirtySections: () => {},
});

const ArticlesProvider: FC<PropsWithChildren> = (props) => {
  const [articles, setArticles] = useState<PopulatedArticleDocument[] | []>([]);
  const [currentArticles, setCurrentArticles] = useState<
    PopulatedArticleDocument[] | []
  >([]);
  const [currentArticle, setCurrentArticle] =
    useState<PopulatedArticleDocument>();

  const initialDirtySections: Record<DirtySection, boolean> = {
    quantity: false,
    location: false,
    info: false,
  };

  const [dirtySections, setDirtySections] = useState(initialDirtySections);

  const setSectionDirty = (section: DirtySection, dirty: boolean): void => {
    setDirtySections((previous) => {
      if (previous[section] === dirty) {
        return previous;
      }

      return {
        ...previous,
        [section]: dirty,
      };
    });
  };

  const isDirty = Object.values(dirtySections).some(Boolean);

  const resetDirtySections = (): void => {
    setDirtySections(initialDirtySections);
  };

  console.log("Hur ofta körs denna?");

  return (
    <articleContext.Provider
      value={{
        articles,
        setArticles,
        currentArticles,
        setCurrentArticles,
        currentArticle,
        setCurrentArticle,
        dirtySections,
        setSectionDirty,
        isDirty,
        resetDirtySections,
      }}
    >
      {props.children}
    </articleContext.Provider>
  );
};

export default ArticlesProvider;
