import {
  articleContext,
  PopulatedArticleDocument,
} from "@/components/context/ArticleProvider";
import Button from "@/components/ui/Button";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useContext } from "react";

interface Props {
  afterDelete?: () => void;
}

const DeleteArticleField = ({ afterDelete }: Props) => {
  const { setCurrentArticles, currentArticle } = useContext(articleContext);
  if (!currentArticle) return;
  return (
    <div className="flex flex-col gap-2 mx-4 sm:mx-6 lg:mx-8 rounded-lg border border-red-200 bg-red-50 p-5 mt-16">
      <div className="font-bold flex gap-2 items-center">
        <IconAlertTriangle size={22} />
        Radera artikel
      </div>
      <div>
        Artikeln och all tillhörande information kommer att raderas permanent
        och kan inte återställas.
      </div>
      <div>
        <Button
          variant="danger"
          className=" px-3 py-3  font-semibold"
          onClick={async () => {
            const test = confirm(
              `Är du säker på att du vill radera "${currentArticle.title}"?

Artikeln är kopplad till lagerplatsen "${currentArticle.inventoryLocation.name}".

All information om artikeln kommer att raderas permanent och kan inte återställas. Om du ångrar dig i efterhand behöver du skapa artikeln på nytt.`,
            );
            // Todo: Update this one later
            if (test) {
              try {
                await fetch(`api/article/${currentArticle._id}`, {
                  method: "DELETE",
                });
                const response = await fetch("/api/article/");
                const result = await response.json();
                if (result.success) {
                  setCurrentArticles(result.data);
                  afterDelete && afterDelete();
                }
              } catch (err) {
                console.error(err);
              }
            }
          }}
        >
          Radera artikel
        </Button>
      </div>
    </div>
  );
};

export default DeleteArticleField;
