import { IconMinus, IconPlus } from "@tabler/icons-react";
import {
  PopulatedArticleDocument,
  articleContext,
} from "../context/ArticleProvider";
import { useContext, useState } from "react";
import SelectSimple from "../searchbars/SelectSimple";
import ScrapCause from "../ScrapCause";

interface Props {
  articleObject: PopulatedArticleDocument;
}

const QtyControls = ({ articleObject }: Props) => {
  const [originQty, setOriginQty] = useState(articleObject.qty);
  const { currentArticles } = useContext(articleContext);
  const [updatedArticle, setUpdatedArticle] =
    useState<PopulatedArticleDocument>(articleObject);

  let articlesCopy = [...currentArticles];

  const addQty = async (article: PopulatedArticleDocument) => {
    try {
      let foundIndex = articlesCopy.findIndex(
        (artCopy) => artCopy._id === article._id
      );
      if (foundIndex >= 0) {
        articlesCopy[foundIndex].qty++;

        const updated: any = { ...articlesCopy[foundIndex] };
        /*   updated.inventoryLocation = updated.inventoryLocation._id; */
        setUpdatedArticle(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteQty = async (article: PopulatedArticleDocument) => {
    try {
      let foundIndex = articlesCopy.findIndex(
        (artCopy) => artCopy._id === article._id
      );
      if (foundIndex >= 0) {
        if (articlesCopy[foundIndex].qty > 0) {
          articlesCopy[foundIndex].qty--;

          const updated: any = { ...articlesCopy[foundIndex] };
          updated.inventoryLocation = updated.inventoryLocation._id;
          setUpdatedArticle(updated);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div
        onClick={() => deleteQty(articleObject)}
        className="rounded-full cursor-pointer p-1 flex items-center justify-center border "
      >
        <IconMinus width={16} height={16} />{" "}
      </div>
      {updatedArticle?.qty ? updatedArticle?.qty : articleObject.qty} st{" "}
      <div className="rounded-full cursor-pointer p-1 flex items-center justify-center border">
        <IconPlus
          onClick={() => addQty(articleObject)}
          width={16}
          height={16}
        />
      </div>
      {/* Special with quantity if it changes */}
      {articleObject.qty != originQty ? (
        <ScrapCause
          newQty={articleObject.qty}
          oldQty={originQty}
          article={articleObject}
          setUpdatedArticle={setUpdatedArticle}
        />
      ) : null}
    </>
  );
};

export default QtyControls;
