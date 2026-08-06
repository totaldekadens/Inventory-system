import { Dispatch, SetStateAction, useContext, useState } from "react";
import { InventoryLocationDocument } from "@/models/InventoryLocationModel";
import ArticleQuantitySection from "./ArticleQuantitySection";
import ArticleInfoSection from "./ArticleInfoSection";
import ArticleLocationSection from "./ArticleLocationSection";
import Button from "@/components/ui/Button";
import { IconArrowLeft } from "@tabler/icons-react";
import { articleContext } from "@/components/context/ArticleProvider";
import { confirmDiscardChanges } from "../lib/confirmDiscardChanges";

interface Props {
  selectedLocation: InventoryLocationDocument | null;
  setSelectedLocation: Dispatch<
    SetStateAction<InventoryLocationDocument | null>
  >;
  setEdit: Dispatch<SetStateAction<boolean>>;
}

const SidebarEdit = ({
  selectedLocation,
  setSelectedLocation,
  setEdit,
}: Props) => {
  const { isDirty, resetDirtySections } = useContext(articleContext);
  return (
    <aside
      className="flex flex-col col-span-1 md:px-6 lg:pl-10 mx-auto max-w-8xl py-6 w-full h-full"
      style={{ maxWidth: "600px" }}
    >
      <div className="flex justify-end">
        <div>
          <Button
            className="flex gap-2 items-center"
            onClick={() => {
              if (!confirmDiscardChanges(isDirty)) {
                return;
              }

              resetDirtySections();

              setEdit(false);
            }}
            variant="modest"
          >
            <IconArrowLeft />
            Tillbaka till visning
          </Button>
        </div>
      </div>

      <div className="flex justify-between w-full mb-4 ">
        <div className="w-full flex flex-col gap-10 divide-y-2 divide-gray-200">
          <ArticleInfoSection />
          <div className="gap-10 flex flex-col  divide-y-2 divide-gray-200  lg:hidden">
            <ArticleQuantitySection
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
            />
            <ArticleLocationSection
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
            />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarEdit;
