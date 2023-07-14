import { useEffect, useState } from "react";
import clsx from "clsx";
import { Spoiler } from "@mantine/core";
import { TransactionHistoryDocument } from "@/models/TransactionHistoryModel";
import { useRemoveBackgroundScroll } from "@/lib/useRemoveBackgroundScroll";
import ArticleViewHistory from "../article/articleView/ArticleViewHistory";

interface ThProps {
  header: string;
  className?: string;
  empty?: boolean;
}

const Th = ({ header, className, empty }: ThProps) => (
  <th
    scope="col"
    className={clsx(
      `py-3.5 px-3 text-xs text-left font-semibold text-gray-900 whitespace-nowrap  `,
      className
    )}
  >
    {empty ? <span className="sr-only">{header}</span> : header}
  </th>
);

const TableItem = ({ header, className }: ThProps) => (
  <td className={clsx(`whitespace-nowrap px-3 py-1  text-xs`, className)}>
    {header}
  </td>
);

interface Props {
  history: TransactionHistoryDocument[];
}

const TableHistory = ({ history }: Props) => {
  const [open, setOpen] = useState(false);
  const [currentArticle, setCurrentArticle] =
    useState<TransactionHistoryDocument>();
  useEffect(() => {
    useRemoveBackgroundScroll(open);
  }, [open]);

  return (
    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 mt-12 ">
      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 ">
        <table className="min-w-full">
          {/* Headers */}
          <thead>
            <tr>
              <Th header="Art. no" />
              <Th header="Detaljer" />
              <Th header="Antal" />
              <Th header="Anledning" />
              <Th header="Pris / enhet" />
              <Th header="Skick" />
              <Th header="Kommentar" />
              <Th header="Datum" />
            </tr>
          </thead>

          {/* Content */}
          <tbody className="divide-y divide-gray-200 bg-[#FCFCFC] relative ">
            {history.length < 1 ? (
              <tr className="bg-transparent p-3 h-11 flex  ">
                <td>
                  <p className="">Sökningen gav ingen träff</p>
                </td>
              </tr>
            ) : (
              history.map((article, i) => {
                const path = `https://res.cloudinary.com/dkzh2lxon/image/upload/v1688383484/inventory/${article.article.images[0]}`;

                return (
                  <tr key={i} className="">
                    {/* Art. no */}
                    <TableItem header={article.article.artno.toString()} />
                    {/* Detaljer */}
                    <td className="whitespace-nowrap py-1 px-3  text-xs   ">
                      <div className="flex items-center ">
                        {/* Image */}
                        <div
                          className=" h-8 w-8 flex-shrink-0 flex items-center cursor-pointer"
                          onClick={() => {
                            setOpen(true);
                          }}
                        >
                          <img
                            className=" h-8 w-8  rounded-sm object-cover"
                            src={path}
                            alt="Bild på artikel"
                          />
                        </div>
                        <div className="ml-4 flex flex-col justify-between">
                          <div>
                            {/* Title */}
                            <div className="relative h-5">
                              <div
                                className=" text-xs  whitespace-nowrap text-gray-900 cursor-pointer"
                                onClick={() => {
                                  setOpen(true);
                                  setCurrentArticle(article);
                                }}
                              >
                                {article.article.title}
                              </div>
                            </div>

                            {/* Supplier part no */}
                            <div
                              className=" text-gray-500  text-xs  flex flex-wrap cursor-pointer"
                              onClick={() => {
                                setOpen(true);
                                setCurrentArticle(article);
                              }}
                            >
                              {article.article.supplierArtno}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* Antal */}
                    <TableItem
                      className="text-gray-500"
                      header={article.direction + article.qty}
                    />
                    {/* Anledning */}
                    <TableItem header={article.cause ? article.cause : ""} />
                    {/* Pris/enhet */}
                    <TableItem
                      className="text-gray-500"
                      header={
                        article.pricePerUnit ? article.pricePerUnit + " kr" : ""
                      }
                    />
                    {/* Skick */}
                    <TableItem header={article.article.condition} />
                    {/* Kommentar */}
                    <td className=" py-1 px-3  text-xs  items-center h-full flex min-w-[180px] text-gray-500 flex-wrap">
                      <Spoiler
                        styles={{ control: { color: "#264133" } }}
                        color="#264133"
                        key={i}
                        maxHeight={30}
                        showLabel={`...`}
                        hideLabel="Dölj"
                      >
                        <div className="flex items-center h-full mt-3">
                          {article.comment}
                        </div>
                      </Spoiler>
                    </td>
                    {/* Datum */}
                    <TableItem header={article.createdDate} />
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {open && currentArticle ? (
        <ArticleViewHistory setOpen={setOpen} object={currentArticle} />
      ) : null}
    </div>
  );
};

export default TableHistory;
