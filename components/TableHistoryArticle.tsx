import clsx from "clsx";
import { Spoiler } from "@mantine/core";
import { TransactionHistoryDocument } from "@/models/TransactionHistoryModel";
import Accordion from "./Accordion";

interface ThProps {
  header: string;
  className?: string;
  empty?: boolean;
}

const Th = ({ header, className, empty }: ThProps) => (
  <th
    scope="col"
    className={clsx(
      `py-3.5  text-sm px-3 text-left font-semibold text-gray-900 whitespace-nowrap  `,
      className
    )}
  >
    {empty ? <span className="sr-only">{header}</span> : header}
  </th>
);

interface Props {
  history: TransactionHistoryDocument[];
}

const TableHistoryArticle = ({ history }: Props) => {
  return (
    <>
      <div className="-my-2 overflow-x-auto mt-2 mx-auto max-w-3xl px-4 sm:px-6  lg:max-w-8xl lg:px-8 ">
        <div className="inline-block min-w-full py-2 align-middle ">
          <Accordion
            title="Transaktionshistorik"
            content={
              <table className="min-w-full ">
                {/* Headers */}
                <thead>
                  <tr>
                    <Th header="Datum" />
                    <Th header="Antal" />
                    <Th header="Anledning" />
                    <Th header="Pris / enhet" />
                    <Th header="Skick" />
                    <Th header="Kommentar" />
                  </tr>
                </thead>

                {/* Content */}
                <tbody className="divide-y divide-gray-200 h-[200px] max-h-[200px] overflow-y-auto bg-[#FCFCFC] relative">
                  {history.length < 1 ? (
                    <tr className="bg-transparent p-3 h-11 flex  ">
                      <td>
                        <p className="">Sökningen gav ingen träff</p>
                      </td>
                    </tr>
                  ) : (
                    history.map((article, i) => {
                      return (
                        <tr key={i} className="">
                          {/* Datum */}
                          <td className="relative whitespace-nowrap text-left px-3 text-sm pr-3 ">
                            <div>{article.createdDate}</div>
                          </td>
                          {/* Antal */}
                          <td className="whitespace-nowrap px-3   py-1  text-sm  text-gray-500 flex-wrap">
                            <div>
                              {article.direction}
                              {article.qty}
                            </div>
                          </td>
                          {/* Anledning */}
                          <td className="whitespace-nowrap   px-3 py-1  text-sm  text-gray-500">
                            <div className="text-gray-900 h-full ">
                              {article.cause}
                            </div>
                          </td>
                          {/* Pris/enhet */}
                          <td className="whitespace-nowrap   px-3 py-1  text-sm  text-gray-500">
                            <div>
                              {article.pricePerUnit
                                ? article.pricePerUnit + " kr"
                                : ""}{" "}
                            </div>
                          </td>
                          {/* Skick */}
                          <td className="whitespace-nowrap  px-4 py-1  text-sm  text-gray-500">
                            <div className="text-gray-900 h-full ">
                              {article.article.condition}
                            </div>
                          </td>

                          {/* Kommentar */}
                          <td className=" py-1 px-3  text-sm items-center h-full flex max-w-[180px] min-w-[180px] text-gray-500 flex-wrap">
                            <Spoiler
                              styles={{ control: { color: "#264133" } }}
                              color="#264133"
                              key={i}
                              maxHeight={20}
                              showLabel={`...`}
                              hideLabel="Dölj"
                            >
                              <div className="flex items-center h-full">
                                {article.comment}
                              </div>
                            </Spoiler>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            }
          />
        </div>
      </div>
    </>
  );
};

export default TableHistoryArticle;
