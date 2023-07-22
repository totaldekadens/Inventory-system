import { Dispatch, SetStateAction, useState } from "react";
import { IconX } from "@tabler/icons-react";
import Slider from "@/components/Slider";
import { TransactionHistoryDocument } from "@/models/TransactionHistoryModel";
import HoverInfo from "@/components/HoverInfo";

interface Props {
  object: TransactionHistoryDocument;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ArticleViewHistory = ({ object, setOpen }: Props) => {
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
          {/* Image slider */}
          <div className="w-full ">
            <Slider images={object.article.images} />
          </div>
          {/* Sidebar */}
          <aside
            className={
              "flex flex-col col-span-1 mx-auto max-w-8xl md:px-6 py-6 w-full h-full"
            }
            style={{ maxWidth: "600px" }}
          >
            <div className="flex justify-between mb-4 items-start">
              <div>
                <h1 className="text-xl font-medium text-gray-900">
                  {object.article.title}
                </h1>
                <p className="text-lg font-medium tracking-tight text-gray-900/70 ">
                  {object.article.supplierArtno}
                </p>
              </div>
            </div>

            <div className="p-4 border border-red-400 rounded-md">
              <div>Observera!</div>
              <div>
                Informationen på denna sida är kopierad vid
                transaktionstillfälle. Detta för att behålla den faktiska
                informationen som utgavs vid den tidpunkten.
              </div>
            </div>

            <div className="flex justify-between flex-wrap">
              <div>
                <div className=" font-medium text-gray-900 mt-4 lg:mt-8">
                  Anledning
                </div>
                <div className="text-gray-900/80">
                  {object.cause ? object.cause : ""}
                </div>
              </div>

              <div>
                <div className=" font-medium text-gray-900 mt-4 lg:mt-8">
                  Transaktionsdatum
                </div>
                <div className="text-gray-900/80">{object.createdDate}</div>
              </div>
            </div>

            <div className="flex justify-between flex-wrap">
              <div>
                <div className=" font-medium text-gray-900 mt-4 lg:mt-8  ">
                  Skick
                </div>
                <div className="text-gray-900/80">
                  {object.article.condition}
                </div>
              </div>
              <div>
                <div className=" font-medium text-gray-900 mt-4 lg:mt-8">
                  Antal
                </div>
                <div className="text-gray-900/80">
                  {object.direction + object.qty} st
                </div>
              </div>
            </div>

            <div>
              <div className=" font-medium text-gray-900 mt-4 lg:mt-8">
                Beskrivning
              </div>
              <div className="text-gray-900/80">
                {object.article.description
                  ? object.article.description
                  : "Ingen beskrivning"}
              </div>
            </div>

            <div className="mt-4 lg:row-span-3 lg:mt-8">
              <div className="w-full flex justify-between">
                <div className=" font-medium text-gray-900 mt-2 ">
                  Mer information
                </div>
              </div>
              <div className=" grid grid-cols-2">
                <p className=" tracking-tight text-gray-900/80">Art. no:</p>
                <p>{object.article.artno}</p>
              </div>
              <div className=" grid grid-cols-2">
                <p className=" tracking-tight text-gray-900/80">
                  Lev. art. no:{" "}
                </p>
                <p>
                  {" "}
                  {object.article.supplierArtno
                    ? object.article.supplierArtno
                    : "-"}
                </p>
              </div>
              <div className=" grid grid-cols-2">
                <p className=" tracking-tight text-gray-900/80">Inköpspris: </p>
                <p>
                  {" "}
                  {object.article.purchaseValue
                    ? object.article.purchaseValue + " kr / enhet"
                    : "-"}{" "}
                </p>
              </div>

              {object.cause == "Såld" && object.pricePerUnit ? (
                <>
                  <div className=" grid grid-cols-2">
                    <p className=" tracking-tight text-gray-900/80">
                      Såld för:
                    </p>
                    <p>
                      {object.pricePerUnit
                        ? object.pricePerUnit + " kr / enhet"
                        : "-"}
                    </p>
                  </div>

                  <div className=" grid grid-cols-2 mt-4">
                    <p className=" tracking-tight text-gray-900/80">
                      Totalsumma:
                    </p>
                    <p>{object.pricePerUnit * Math.abs(object.qty)} kr</p>
                  </div>

                  {object.cause == "Såld" &&
                  object.pricePerUnit &&
                  object.article.purchaseValue ? (
                    <div className=" grid grid-cols-2">
                      <p className=" tracking-tight text-gray-900/80">
                        {object.pricePerUnit * Math.abs(object.qty) -
                          object.article.purchaseValue * Math.abs(object.qty) >
                        0
                          ? "Vinst:"
                          : "Förlust:"}
                      </p>
                      <p>
                        {object.pricePerUnit * Math.abs(object.qty) -
                          object.article.purchaseValue *
                            Math.abs(object.qty)}{" "}
                        kr
                      </p>
                    </div>
                  ) : null}
                </>
              ) : null}
              <div>
                <div className=" font-medium text-gray-900 mt-4 lg:mt-8">
                  Kommentar
                </div>
                <div className="text-gray-900/80">{object.comment}</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ArticleViewHistory;
