import { useContext, useEffect, useState } from "react";
import {
  PopulatedArticleDocument,
  articleContext,
} from "../../context/ArticleProvider";
import ArticleView from "../../article/articleView/ArticleView";
import clsx from "clsx";
import { useRemoveBackgroundScroll } from "@/lib/useRemoveBackgroundScroll";
import TableRow from "./TableRow";

interface ThProps {
  header: string;
  className?: string;
  empty?: boolean;
}

const Th = ({ header, className, empty }: ThProps) => (
  <th
    scope="col"
    className={clsx(`py-3.5 text-sm font-semibold text-gray-900 `, className)}
  >
    {empty ? <span className="sr-only">{header}</span> : header}
  </th>
);

const TableOverview = () => {
  const { currentArticles } = useContext(articleContext);
  const [open, setOpen] = useState(false);
  const [currentArticle, setCurrentArticle] =
    useState<PopulatedArticleDocument>();

  useEffect(() => {
    useRemoveBackgroundScroll(open);
  }, [open]);

  return (
    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 ">
        <table className="min-w-full  ">
          {/* Headers */}
          <thead>
            <tr>
              <Th header="Artikel" className="sm:pl-0 text-left pl-4 pr-3" />
              <Th
                header="Modell"
                className="sm:pl-0 text-left pl-4 pr-3 hidden lg:table-cell"
              />
              <Th
                header="Skick"
                className=" hidden lg:table-cell text-left px-3"
              />
              <Th header="Antal" className="px-3 hidden md:flex text-left" />
              <Th header="Lagerplats" className="pl-3 text-left " />
              <Th
                header="Remove"
                className="relative pl-3 pr-4 sm:pr-0"
                empty
              />
            </tr>
          </thead>

          {/* Content */}
          <tbody className="divide-y divide-gray-200 bg-[#FCFCFC] relative">
            {currentArticles.length < 1 ? (
              <tr className="bg-transparent p-3 h-11 flex  ">
                <td>
                  <p className="">Sökningen gav ingen träff</p>
                </td>
              </tr>
            ) : (
              currentArticles.map((article, i) => {
                return (
                  <TableRow
                    setOpen={setOpen}
                    setCurrentArticle={setCurrentArticle}
                    key={i}
                    article={article}
                  />
                );
              })
            )}
          </tbody>
        </table>
        {open && currentArticle ? (
          <ArticleView setOpen={setOpen} article={currentArticle} />
        ) : null}
      </div>
    </div>
  );
};

export default TableOverview;
