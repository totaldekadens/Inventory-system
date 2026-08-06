import s from "./ArticleView.module.css";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { IconX } from "@tabler/icons-react";
import { articleContext } from "@/components/context/ArticleProvider";
import Slider from "@/components/ui/Slider";
import TableHistoryArticle from "@/components/article/articleTables/TableHistoryArticle";
import SidebarEdit from "../articleSidebar/SidebarEdit.tsx";
import SidebarRead from "../articleSidebar/SidebarRead";
import DeleteArticleField from "../articleForm/DeleteArticleField";
import ArticleQuantitySection from "../articleSidebar/ArticleQuantitySection";
import ArticleLocationSection from "../articleSidebar/ArticleLocationSection";
import { InventoryLocationDocument } from "@/models/InventoryLocationModel";
import { confirmDiscardChanges } from "../lib/confirmDiscardChanges";

interface Props {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ArticleView = ({ setOpen }: Props) => {
  const { currentArticle, isDirty, resetDirtySections } =
    useContext(articleContext);
  const [edit, setEdit] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<InventoryLocationDocument | null>(
      currentArticle?.inventoryLocation || null,
    );

  return (
    <div className="pt-10 sm:pt-16  z-50 fixed inset-0 bg-black/20 ">
      <div className="pt-10 sm:pt-16 pb-10 sm:pb-16 shadow-lg rounded-lg absolute inset-0 m-0 sm:m-10 md:m-20 bg-white overflow-y-auto">
        <div className=" absolute top-4 right-0 w-8  h-10 mx-4">
          <IconX
            className="cursor-pointer"
            width={30}
            height={30}
            onClick={() => {
              if (!confirmDiscardChanges(isDirty)) {
                return;
              }
              resetDirtySections();
              setOpen(false);
            }}
          />
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6  lg:max-w-8xl lg:px-8 pt-6 sm:pt-0 flex flex-col lg:flex-row">
          {/* Image slider */}
          <div className="w-full ">
            <Slider images={currentArticle?.images ?? []} />
            {edit && (
              <div className="hidden lg:flex gap-10 flex-col  divide-y-2 divide-gray-200 lg:max-w-xl ">
                <ArticleQuantitySection
                  selectedLocation={selectedLocation}
                  setSelectedLocation={setSelectedLocation}
                />
                <ArticleLocationSection
                  selectedLocation={selectedLocation}
                  setSelectedLocation={setSelectedLocation}
                />
              </div>
            )}
          </div>
          {/* Sidebar */}
          <>
            {edit ? (
              <SidebarEdit
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                setEdit={setEdit}
              />
            ) : (
              <SidebarRead setEdit={setEdit} className={s.sidebar} />
            )}
          </>
        </div>
        {/* Transaction history */}
        {!edit && <TableHistoryArticle />}

        {edit && <DeleteArticleField afterDelete={() => setOpen(false)} />}
      </div>
    </div>
  );
};

export default ArticleView;
