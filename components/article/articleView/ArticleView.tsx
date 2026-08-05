import s from "./ArticleView.module.css";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { IconX } from "@tabler/icons-react";
import { PopulatedArticleDocument } from "@/components/context/ArticleProvider";
import Slider from "@/components/ui/Slider";
import { TransactionHistoryDocument } from "@/models/TransactionHistoryModel";
import TableHistoryArticle from "@/components/article/articleTables/TableHistoryArticle";
import SidebarEdit from "../articleSidebar/SidebarEdit.tsx";
import SidebarRead from "../articleSidebar/SidebarRead";
import DeleteArticleField from "../articleForm/DeleteArticleField";

interface Props {
  article: PopulatedArticleDocument;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ArticleView = ({ article, setOpen }: Props) => {
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
          <DeleteArticleField
            article={article}
            afterDelete={() => setOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ArticleView;
