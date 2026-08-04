import { IconMinus, IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { PopulatedArticleDocument } from "../context/ArticleProvider";
import ScrapCause from "../ScrapCause";

interface Props {
  articleObject: PopulatedArticleDocument;
}

const QtyControls = ({ articleObject }: Props) => {
  const [originalQty, setOriginalQty] = useState(articleObject.qty);

  const [updatedArticle, setUpdatedArticle] =
    useState<PopulatedArticleDocument>(articleObject);

  const [showQuantityDialog, setShowQuantityDialog] = useState(false);

  useEffect(() => {
    setOriginalQty(articleObject.qty);
    setUpdatedArticle(articleObject);
    setShowQuantityDialog(false);
  }, [articleObject]);

  const addQty = () => {
    setUpdatedArticle((previousArticle) => ({
      ...previousArticle,
      qty: previousArticle.qty + 1,
    }));

    setShowQuantityDialog(true);
  };

  const removeQty = () => {
    if (updatedArticle.qty <= 0) {
      return;
    }

    setUpdatedArticle((previousArticle) => ({
      ...previousArticle,
      qty: previousArticle.qty - 1,
    }));

    setShowQuantityDialog(true);
  };

  return (
    <div className="relative flex items-center justify-center gap-2">
      <button
        type="button"
        aria-label="Minska antal"
        disabled={updatedArticle.qty === 0}
        onClick={removeQty}
        className="flex h-[26px] w-[26px] items-center justify-center rounded-full border p-1 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <IconMinus width={16} height={16} aria-hidden="true" />
      </button>

      <span>{updatedArticle.qty} st</span>

      <button
        type="button"
        aria-label="Öka antal"
        onClick={addQty}
        className="flex h-[26px] w-[26px] items-center justify-center rounded-full border p-1"
      >
        <IconPlus width={16} height={16} aria-hidden="true" />
      </button>

      {showQuantityDialog && updatedArticle.qty !== originalQty && (
        <ScrapCause
          newQty={updatedArticle.qty}
          oldQty={originalQty}
          article={updatedArticle}
          setUpdatedArticle={setUpdatedArticle}
          setClose={(close) => setShowQuantityDialog(!close)}
        />
      )}
    </div>
  );
};

export default QtyControls;
