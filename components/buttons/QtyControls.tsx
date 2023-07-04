import { IconMinus, IconPlus } from "@tabler/icons-react";
import {
  PopulatedArticleDocument,
  articleContext,
} from "../context/ArticleProvider";
import { FC, useContext } from "react";

interface Props {
  articleObject: PopulatedArticleDocument;
}

const QtyControls = ({ articleObject }: Props) => {
  const { currentArticles, setCurrentArticles } = useContext(articleContext);
  let articlesCopy = [...currentArticles];

  const addQty = async (article: PopulatedArticleDocument) => {
    try {
      let foundIndex = articlesCopy.findIndex(
        (artCopy) => artCopy._id === article._id
      );
      if (foundIndex >= 0) {
        articlesCopy[foundIndex].qty++;

        const updatedArticle: any = { ...articlesCopy[foundIndex] };
        updatedArticle.inventoryLocation = updatedArticle.inventoryLocation._id;

        const request = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedArticle),
        };

        const response = await fetch("/api/article", request);
        const result = await response.json();
        if (!result.success) {
          throw Error(result.data);
        }
      }
      setCurrentArticles(articlesCopy);
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

          const updatedArticle: any = { ...articlesCopy[foundIndex] };
          updatedArticle.inventoryLocation =
            updatedArticle.inventoryLocation._id;

          const request = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedArticle),
          };

          const response = await fetch("/api/article", request);
          const result = await response.json();
          if (!result.success) {
            throw Error(result.data);
          }
        }
      }
      setCurrentArticles(articlesCopy);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div
        onClick={() => deleteQty(articleObject)}
        className="rounded-full cursor-pointer p-1 flex items-center justify-center border"
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
    </>
  );
};

export default QtyControls;
