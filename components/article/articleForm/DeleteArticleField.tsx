import { articleContext } from "@/components/context/ArticleProvider";
import Button from "@/components/ui/Button";
import { articleApi } from "@/lib/api/articles";
import { useRefreshArticles } from "@/lib/useRefreshArticles";
import { IconAlertTriangle } from "@tabler/icons-react";
import { ErrorMessage } from "formik";
import { useContext, useState } from "react";

interface Props {
  afterDelete?: () => void;
}

const DeleteArticleField = ({ afterDelete }: Props) => {
  const { currentArticle } = useContext(articleContext);
  if (!currentArticle) return;
  const [error, setError] = useState("");
  const refreshArticles = useRefreshArticles();
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
        {error && <ErrorMessage message={error} />}
        <Button
          variant="danger"
          className=" px-3 py-3  font-semibold"
          onClick={async () => {
            const isConfirmed = confirm(
              `Är du säker på att du vill radera "${currentArticle.title}"?

Artikeln är kopplad till lagerplatsen "${currentArticle.inventoryLocation.name}".

All information om artikeln kommer att raderas permanent och kan inte återställas. Om du ångrar dig i efterhand behöver du skapa artikeln på nytt.`,
            );
            // Todo: Update this one later
            if (isConfirmed) {
              try {
                await articleApi.delete(String(currentArticle._id));

                await refreshArticles();
                setError("");
                afterDelete && afterDelete();
              } catch (error) {
                console.error(error);
                setError(
                  error instanceof Error
                    ? error.message
                    : "Artikeln kunde inte tas bort.",
                );
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
