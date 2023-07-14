import s from "./ArticleView.module.css";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { IconX } from "@tabler/icons-react";
import { PopulatedArticleDocument } from "@/components/context/ArticleProvider";
import ArticleSidebar from "../articleSidebar/ArticleSidebar";
import Slider from "@/components/Slider";
import TableHistoryArticle from "@/components/TableHistoryArticle";

interface Props {
  article: PopulatedArticleDocument;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ArticleView = ({ article, setOpen }: Props) => {
  const [history, setHistory] = useState([]);
  useEffect(() => {
    const getHistory = async () => {
      const response = await fetch("/api/transactionhistory/" + article.artno);
      const result = await response.json();
      console.log(result);
      if (result.success) {
        setHistory(result.data);
      }
    };
    getHistory();
  }, []);
  return (
    <div className="pt-10 sm:pt-16  z-20 fixed inset-0 bg-black/20 ">
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
          <div className="w-full ">
            <Slider article={article} />
          </div>
          <ArticleSidebar article={article} className={s.sidebar} />
        </div>
        {/* Transaction history */}
        <TableHistoryArticle history={history} />
      </div>
    </div>
  );
};

export default ArticleView;
