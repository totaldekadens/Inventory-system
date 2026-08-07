import clsx from "clsx";
import { Spoiler } from "@mantine/core";
import { TransactionHistoryDocument } from "@/models/TransactionHistoryModel";
import Accordion from "../../ui/Accordion";
import { useContext, useEffect, useState } from "react";
import { articleContext } from "@/components/context/ArticleProvider";
import { transactionHistoryApi } from "@/lib/api/transactionHistory";
import { formatDate } from "@/lib/formatDate";

interface ThProps {
  header: string;
  className?: string;
  empty?: boolean;
}

const Th = ({ header, className, empty }: ThProps) => (
  <div
    className={clsx(
      `py-3.5  text-sm  text-left flex flex-1  font-semibold text-gray-900 whitespace-nowrap  `,
      className,
    )}
  >
    {empty ? <span className="sr-only">{header}</span> : header}
  </div>
);

const TableItem = ({ header, className }: ThProps) => (
  <div
    className={clsx(
      `whitespace-nowrap text-left py-2 text-sm  flex flex-1 `,
      className,
    )}
  >
    {header}
  </div>
);

const TableHistoryArticle = () => {
  const { currentArticle } = useContext(articleContext);
  const [history, setHistory] = useState<TransactionHistoryDocument[]>([]);

  // Fetches transaction history for this specific article
  useEffect(() => {
    const getHistory = async () => {
      if (!currentArticle) return;

      try {
        const history = await transactionHistoryApi.getByArticleNumber(
          currentArticle.artno,
        );

        setHistory(history);
      } catch (error) {
        console.error("Get transaction history error:", error);
      }
    };
    getHistory();
  }, []);
  return (
    <>
      <div className="-my-2 overflow-x-auto mt-2 mx-auto max-w-3xl px-4 sm:px-6  lg:max-w-8xl lg:px-8 ">
        <div className="inline-block min-w-full py-2 align-middle ">
          <Accordion
            title="Transaktionshistorik"
            content={
              <div
                className="min-w-full  w-full overflow-x-auto flex"
                style={{ flexFlow: "column" }}
              >
                {/* Headers */}
                <div className="w-full flex" style={{ flexFlow: "row" }}>
                  <Th header="Datum" className="min-w-[160px]" />
                  <Th header="Antal" className="min-w-[70px]" />
                  <Th header="Anledning" className="min-w-[190px]" />
                  <Th header="Pris / enhet" className="min-w-[110px]" />
                  <Th header="Skick" className="min-w-[190px]" />
                  <Th header="Kommentar" className="min-w-[190px]" />
                </div>

                {/* Content */}
                <div
                  className=" max-h-[300px] overflow-y-auto overflow-x-auto  bg-[#FCFCFC] relative "
                  style={{ flexFlow: "row" }}
                >
                  {history.length < 1 ? (
                    <div className="bg-transparent p-3 h-11 flex  ">
                      <div>
                        <p className="">Finns ingen historik</p>
                      </div>
                    </div>
                  ) : (
                    history.map((article, i) => {
                      const lastIndex = history.length - 1;
                      return (
                        <div
                          key={i}
                          style={{ flexFlow: "row" }}
                          className={clsx(
                            lastIndex == i ? `border-b-0` : `border-b`,
                            ` border border-x-0 border-t-0 flex border-gray-200 `,
                          )}
                        >
                          {/* Datum */}
                          <TableItem
                            header={formatDate(article.createdDate)}
                            className="min-w-[160px] pl-2"
                          />
                          {/* Antal */}
                          <TableItem
                            className="text-gray-500 min-w-[70px]"
                            header={`${!article.direction ? "" : article.direction + article.qty}`}
                          />
                          {/* Anledning */}
                          <TableItem
                            className="min-w-[190px]"
                            header={article.cause ? article.cause : ""}
                          />
                          {/* Pris/enhet */}
                          <TableItem
                            className="text-gray-500 min-w-[110px]"
                            header={
                              article.pricePerUnit
                                ? article.pricePerUnit + " kr"
                                : ""
                            }
                          />
                          {/* Skick */}
                          <TableItem
                            className="min-w-[190px]"
                            header={article.article.condition}
                          />

                          {/* Kommentar */}
                          <div className="text-sm h-full flex items-center flex-1 min-w-[190px] text-gray-500 flex-wrap">
                            <Spoiler
                              styles={{
                                control: {
                                  color: "#264133",
                                },
                              }}
                              color="#264133"
                              key={i}
                              maxHeight={33}
                              showLabel={`...`}
                              hideLabel="Dölj"
                            >
                              <div className="flex items-center h-full mt-3">
                                {article.comment}
                              </div>
                            </Spoiler>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            }
          />
        </div>
      </div>
    </>
  );
};

export default TableHistoryArticle;
