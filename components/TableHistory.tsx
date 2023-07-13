import { useContext, useState } from "react";
import { IconX } from "@tabler/icons-react";
import {
  PopulatedArticleDocument,
  articleContext,
} from "./context/ArticleProvider";
import QtyControls from "./buttons/QtyControls";
import ArticleView from "./article/articleView/ArticleView";
import clsx from "clsx";
import { Spoiler } from "@mantine/core";
import { TransactionHistoryDocument } from "@/models/TransactionHistoryModel";

interface ThProps {
  header: string;
  className?: string;
  empty?: boolean;
}

const Th = ({ header, className, empty }: ThProps) => (
  <th
    scope="col"
    className={clsx(
      `py-3.5 text-[10px] lg:text-xs font-semibold text-gray-900 whitespace-nowrap  `,
      className
    )}
  >
    {empty ? <span className="sr-only">{header}</span> : header}
  </th>
);

interface Props {
  history: TransactionHistoryDocument[];
}

const TableHistory = ({ history }: Props) => {
  const [open, setOpen] = useState(false);

  console.log(history);

  return (
    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 ">
        <table className="min-w-full  ">
          {/* Headers */}
          <thead>
            <tr>
              <Th header="Art. no" className="text-left px-3" />
              <Th header="Detaljer" className="text-left px-3" />
              <Th header="Skick" className="text-left px-4" />
              <Th header="Antal" className="text-left px-3 " />
              <Th header="Anledning" className="  text-left px-3" />
              <Th header="Pris / enhet" className="px-3  text-left" />
              <Th header="Kommentar" className="relative text-left " />
              <Th header="Datum" className="relative flex" />
            </tr>
          </thead>

          {/* Content */}
          <tbody className="divide-y divide-gray-200 bg-[#FCFCFC] relative">
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
                    <td className="whitespace-nowrap px-3 py-1 text-[10px] lg:text-xs  text-gray-500">
                      <div
                        className="text-gray-900 h-full "
                        onClick={() => {
                          setOpen(true);
                        }}
                      >
                        {article.article.artno}
                      </div>
                    </td>
                    {/* Detaljer */}
                    <td className="whitespace-nowrap py-1 px-3 text-[10px] lg:text-xs   ">
                      <div className="flex">
                        {/* Image */}
                        <div
                          className=" h-6 w-6 lg:h-8 lg:w-8 flex-shrink-0 cursor-pointer"
                          onClick={() => {
                            setOpen(true);
                          }}
                        >
                          <img
                            className=" h-6 w-6 lg:h-8 lg:w-8   rounded-sm object-cover"
                            src={path}
                            alt="Bild på artikel"
                          />
                        </div>
                        <div className="ml-4 flex flex-col justify-between">
                          <div>
                            {/* Title */}
                            <div className="relative h-5">
                              <div
                                className="text-[10px] lg:text-xs  whitespace-nowrap text-gray-900 cursor-pointer  " // absolute truncate
                                onClick={() => {
                                  setOpen(true);
                                }}
                              >
                                {article.article.title}
                              </div>
                            </div>

                            {/* Supplier part no */}

                            <div
                              className=" text-gray-500 text-[10px] lg:text-xs  flex flex-wrap cursor-pointer"
                              onClick={() => {
                                setOpen(true);
                              }}
                            >
                              {article.article.supplierArtno}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* Skick */}
                    <td className="whitespace-nowrap  px-4 py-1 text-[10px] lg:text-xs  text-gray-500">
                      <div className="text-gray-900 h-full ">
                        {article.article.condition}
                      </div>
                    </td>
                    {/* Antal */}
                    <td className="whitespace-nowrap px-3   py-1 text-[10px] lg:text-xs  text-gray-500 flex-wrap">
                      <div>
                        {article.direction}
                        {article.qty}
                      </div>
                    </td>
                    {/* Anledning */}
                    <td className="whitespace-nowrap   px-3 py-1 text-[10px] lg:text-xs  text-gray-500">
                      <div className="text-gray-900 h-full ">
                        {article.cause}
                      </div>
                    </td>
                    {/* Pris/enhet */}
                    <td className="whitespace-nowrap   px-3 py-1 text-[10px] lg:text-xs  text-gray-500">
                      <div>
                        {article.pricePerUnit
                          ? article.pricePerUnit + " kr"
                          : ""}{" "}
                      </div>
                    </td>
                    {/* Kommentar */}
                    <td className=" py-1 px-3 text-[10px] lg:text-xs  flex max-w-[180px] min-w-[180px] text-gray-500 flex-wrap">
                      <Spoiler
                        styles={{ control: { color: "#264133" } }}
                        color="#264133"
                        key={i}
                        maxHeight={18}
                        showLabel={`Visa hela kommentaren`}
                        hideLabel="Dölj"
                      >
                        <div className="flex">{article.comment}</div>
                      </Spoiler>
                    </td>
                    {/* Datum */}
                    <td className="relative whitespace-nowrap text-left text-[10px] lg:text-xs pr-3 ">
                      <div>{article.createdDate}</div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableHistory;
