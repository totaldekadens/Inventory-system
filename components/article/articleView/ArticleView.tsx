import s from "./ArticleView.module.css";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { IconAlertTriangle, IconX } from "@tabler/icons-react";
import {
  articleContext,
  PopulatedArticleDocument,
} from "@/components/context/ArticleProvider";
import Slider from "@/components/ui/Slider";
import { TransactionHistoryDocument } from "@/models/TransactionHistoryModel";
import TableHistoryArticle from "@/components/article/articleTables/TableHistoryArticle";
import SidebarEdit from "../articleSidebar/SidebarEdit.tsx";
import SidebarRead from "../articleSidebar/SidebarRead";
import Button from "@/components/ui/Button";

interface Props {
  article: PopulatedArticleDocument;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ArticleView = ({ article, setOpen }: Props) => {
  const { setCurrentArticles } = useContext(articleContext);
  const [history, setHistory] = useState<TransactionHistoryDocument[]>([]);
  const [edit, setEdit] = useState(false);
  // Fetches transaction history for this specific article
  useEffect(() => {
    const getHistory = async () => {
      try {
        const response = await fetch(
          "/api/transactionhistory/" + article.artno,
        );
        const result = await response.json();
        if (result.success) {
          // Sort keys from Ö - A
          const descendingHistory: TransactionHistoryDocument[] =
            result.data.sort((a: any, b: any) =>
              a.createdDate < b.createdDate ? 1 : -1,
            );
          setHistory(descendingHistory);
        }
      } catch (err) {
        console.error(err);
      }
    };
    getHistory();
  }, []);
  return (
    <div className="pt-10 sm:pt-16  z-50 fixed inset-0 bg-black/20 ">
      <div className="pt-10 sm:pt-16 pb-10 sm:pb-16 shadow-lg rounded-lg absolute inset-0 m-0 sm:m-10 md:m-20 bg-white overflow-y-auto">
        <div className=" absolute top-4 right-0 w-8  h-10 mx-4">
          <IconX
            className="cursor-pointer"
            width={30}
            height={30}
            onClick={() => {
              setOpen(false);
            }}
          />
        </div>
        <div className="mx-auto max-w-3xl px-4 sm:px-6  lg:max-w-8xl lg:px-8 pt-6 sm:pt-0 flex flex-col lg:flex-row">
          {/* Image slider */}
          <div className="w-full ">
            <Slider images={article.images} />
          </div>
          {/* Sidebar */}
          <>
            {edit ? (
              <SidebarEdit article={article} setEdit={setEdit} />
            ) : (
              <SidebarRead
                article={article}
                setEdit={setEdit}
                className={s.sidebar}
              />
            )}
          </>
        </div>
        {/* Transaction history */}
        {!edit && <TableHistoryArticle history={history} />}

        {edit && (
          <div className="flex flex-col gap-2 mx-4 sm:mx-6 lg:mx-8 rounded-lg border border-red-200 bg-red-50 p-5 mt-16">
            <div className="font-bold flex gap-2 items-center">
              <IconAlertTriangle size={22} />
              Radera artikel
            </div>
            <div>
              Artikeln och all tillhörande information kommer att raderas
              permanent och kan inte återställas.
            </div>
            <div>
              <Button
                title="Radera artikel"
                variant="danger"
                className=" px-3 py-3  font-semibold"
                onClick={async () => {
                  const test = confirm(
                    `Är du säker på att du vill radera "${article.title}"?

Artikeln är kopplad till lagerplatsen "${article.inventoryLocation.name}".

All information om artikeln kommer att raderas permanent och kan inte återställas. Om du ångrar dig i efterhand behöver du skapa artikeln på nytt.`,
                  );
                  // Todo: Update this one later
                  if (test) {
                    try {
                      await fetch(`api/article/${article._id}`, {
                        method: "DELETE",
                      });
                      const response = await fetch("/api/article/");
                      const result = await response.json();
                      if (result.success) {
                        setCurrentArticles(result.data);
                        setOpen(false);
                      }
                    } catch (err) {
                      console.error(err);
                    }
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleView;
