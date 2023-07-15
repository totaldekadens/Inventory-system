import { IconMinus, IconPlus } from "@tabler/icons-react";
import {
  PopulatedArticleDocument,
  articleContext,
} from "../context/ArticleProvider";
import { useContext, useEffect, useState } from "react";
import ScrapCause from "../ScrapCause";

interface Props {
  articleObject: PopulatedArticleDocument;
}

// Todo: There are som small bugs. Go back and fix later.

const QtyControls = ({ articleObject }: Props) => {
  const [originQty, setOriginQty] = useState(articleObject.qty);
  const [close, setClose] = useState(false);
  const { currentArticles } = useContext(articleContext);
  const [updatedArticle, setUpdatedArticle] =
    useState<PopulatedArticleDocument>(articleObject);

  let articlesCopy = [...currentArticles];

  const addQty = async (article: PopulatedArticleDocument) => {
    try {
      setClose(false);
      let foundIndex = articlesCopy.findIndex(
        (artCopy) => artCopy._id === article._id
      );
      if (foundIndex >= 0) {
        articlesCopy[foundIndex].qty++;
        const updated: any = { ...articlesCopy[foundIndex] };
        setUpdatedArticle(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteQty = async (article: PopulatedArticleDocument) => {
    try {
      setClose(false);
      let foundIndex = articlesCopy.findIndex(
        (artCopy) => artCopy._id === article._id
      );
      if (foundIndex >= 0) {
        if (articlesCopy[foundIndex].qty > 0) {
          articlesCopy[foundIndex].qty--;
          const updated: any = { ...articlesCopy[foundIndex] };
          setUpdatedArticle(updated);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative flex items-center gap-2 justify-center">
      <div
        onClick={() => deleteQty(articleObject)}
        className="rounded-full cursor-pointer p-1 flex items-center justify-center border "
      >
        <IconMinus width={16} height={16} />{" "}
      </div>
      {articleObject.qty} st{" "}
      <div className="rounded-full cursor-pointer p-1 flex items-center justify-center border">
        <IconPlus
          onClick={() => addQty(articleObject)}
          width={16}
          height={16}
        />
      </div>
      {/* Special with quantity if it changes */}
      {articleObject.qty != originQty && !close ? (
        <ScrapCause
          newQty={articleObject.qty}
          oldQty={originQty}
          article={articleObject}
          setUpdatedArticle={setUpdatedArticle}
          setClose={setClose}
        />
      ) : null}
    </div>
  );
};

export default QtyControls;
