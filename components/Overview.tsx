import { useContext, useRef, useState } from "react";
import SearchBar from "./searchbars/SearchBar";
import SearchBarKombo from "./searchbars/SearchBarKombo";
import {
  IconCurrencyKroneSwedish,
  IconPackages,
  IconPlus,
  IconServer2,
  IconX,
} from "@tabler/icons-react";
import {
  PopulatedArticleDocument,
  articleContext,
} from "./context/ArticleProvider";
import Link from "next/link";
import QtyControls from "./buttons/QtyControls";
import ArticleView from "./article/articleView/ArticleView";
import { inventoryLocationContext } from "./context/InventoryLocationProvider";
import Button from "./buttons/Button";

const Overview = () => {
  const { currentArticles, setCurrentArticles } = useContext(articleContext);
  const [open, setOpen] = useState(false);
  const [currentArticle, setCurrentArticle] =
    useState<PopulatedArticleDocument>();

  // Total amount of articles
  /*   let totalAmount = currentArticles
    ? currentArticles.reduce((sum, item) => sum + item.qty, 0)
    : null; */

  let totalSum = currentArticles?.reduce(
    (sum, item) => sum + (item.price ? item.price : 0) * item.qty,
    0
  );
  const { inventoryLocations } = useContext(inventoryLocationContext);
  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 mt-10 md:mt-10 sm:mt-8 w-full pb-20">
        {/* Introduction and "create article"-button */}
        <div className="flex  items-center w-full justify-center  h-[520px] mb-10 ">
          <div className="min-w-[250px] pt-20 lg:pt-32 h-full items-center flex flex-col flex-1 md:flex-0 ">
            <p className="text-3xl mb-10 ">Välkommen tillbaka, Patrik!</p>
            <div className=" block sm:hidden h-44 mb-14 ">
              <img className="w-full h-full object-contain" src="/mole.png" />
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link href="/create" className="sm:mt-0 sm:flex-none">
                <button
                  type="button"
                  className=" rounded-md flex items-center bg-[#264133] px-3 py-3 text-center text-base gap-3 font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Lägg till artikel <IconPlus width={20} height={20} />
                </button>
              </Link>
              <Link href="/create" className="sm:mt-0 sm:flex-none">
                <button
                  type="button"
                  className=" rounded-md flex items-center bg-[#264133] px-3 py-3 text-center text-base gap-3 font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Hantera lagerplatser
                </button>
              </Link>
            </div>
          </div>
          <div className="flex-1 md:flex-0 max-w-[600px] hidden sm:block ">
            <img className="w-full" src="/mole.png" />
          </div>
        </div>

        <div className=" flow-root">
          {/* Searchbars */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between mt-4 mb-8">
            <SearchBar />
            <div className="text-xs px-2 hidden sm:flex w-full sm:w-20 whitespace-nowrap justify-center  items-center">
              och / eller
            </div>
            <SearchBarKombo />
          </div>

          {/* Article list */}
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 ">
              <table className="min-w-full  ">
                {/* Headers */}
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      Artikel
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 hidden lg:table-cell text-left text-sm font-semibold text-gray-900"
                    >
                      Skick
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 hidden md:flex text-left text-sm font-semibold text-gray-900"
                    >
                      Antal
                    </th>
                    <th
                      scope="col"
                      className="pl-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Lagerplats
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                    >
                      <span className="sr-only">Edit/Remove</span>
                    </th>
                  </tr>
                </thead>
                {/* Content */}
                <tbody className="divide-y divide-gray-200 bg-[#FCFCFC]  ">
                  {!currentArticles
                    ? null
                    : currentArticles.map((article, i) => {
                        const path = `https://res.cloudinary.com/dkzh2lxon/image/upload/v1688383484/inventory/${article.images[0]}`;

                        return (
                          <tr key={i} className="">
                            {/* Artikel */}
                            <td className="md:whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-3 ">
                              <div className="flex">
                                <div
                                  className="h-24 w-24 flex-shrink-0 cursor-pointer"
                                  onClick={() => {
                                    setOpen(true);
                                    setCurrentArticle(article);
                                  }}
                                >
                                  <img
                                    className="h-24 w-24 rounded-sm object-cover"
                                    src={path}
                                    alt="Bild på artikel"
                                  />
                                </div>
                                <div className="ml-4 flex flex-col justify-between">
                                  <div>
                                    <div className="relative h-5">
                                      <div
                                        className="font-medium whitespace-nowrap text-gray-900 cursor-pointer  absolute truncate" //absolute left-0 -top-5
                                        onClick={() => {
                                          setOpen(true);
                                          setCurrentArticle(article);
                                        }}
                                      >
                                        {article.title}
                                      </div>
                                    </div>

                                    <div
                                      className="mt-1 text-gray-500 flex flex-wrap cursor-pointer"
                                      onClick={() => {
                                        setOpen(true);
                                        setCurrentArticle(article);
                                      }}
                                    >
                                      {article.supplierArtno}
                                    </div>
                                  </div>

                                  {/* Qty controls - mobile device */}
                                  <div className="mt-3 w-full gap-2 items-center md:hidden text-gray-800 flex whitespace-nowrap">
                                    <QtyControls articleObject={article} />
                                  </div>
                                </div>
                              </div>
                            </td>
                            {/* Skick */}
                            <td className="whitespace-nowrap hidden lg:table-cell  px-3 py-5 text-sm text-gray-500">
                              <div className="text-gray-900 h-full ">
                                {article.condition}
                              </div>
                            </td>
                            {/* Antal - tab and desktop */}
                            <td className="whitespace-nowrap hidden md:table-cell px-3 py-5 text-sm text-gray-500">
                              <div className="mt-3 w-full gap-2 items-center  text-gray-800  flex flex-wrap">
                                <QtyControls articleObject={article} />
                              </div>
                            </td>
                            {/* Lagerplats */}
                            <td className="whitespace-nowrap pl-3 py-5 text-sm  text-gray-500">
                              <div className="flex items-end md:items-center h-24">
                                {article.inventoryLocation.name}
                              </div>
                            </td>
                            {/* Edit/Remove - Icons */}
                            <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 ">
                              <div className="flex h-24 flex-col md:flex-row items-center justify-end md:justify-center">
                                <IconX
                                  className="text-red-600 hover:text-red-900 cursor-pointer"
                                  onClick={async () => {
                                    const test = confirm("Är du säker?");
                                    // Todo: Update this one later
                                    if (test) {
                                      await fetch(
                                        `api/article/${article._id}`,
                                        {
                                          method: "DELETE",
                                        }
                                      );

                                      const response = await fetch(
                                        "/api/article/"
                                      );
                                      const result = await response.json();
                                      if (result.success) {
                                        setCurrentArticles(result.data);
                                      }
                                    }
                                  }}
                                />
                              </div>
                            </td>
                            {open && currentArticle ? (
                              <ArticleView
                                setOpen={setOpen}
                                article={currentArticle}
                              />
                            ) : null}
                          </tr>
                        );
                      })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6 mt-20">
            <div className="flex-1 w-full sm:w-auto text-gray-800  justify-center flex items-center flex-col p-7 gap-4">
              <IconPackages width={38} height={38} className="text-[#264133]" />{" "}
              <p>Du har lagt in totalt:</p>
              <p className="font-semibold text-xl ">
                {/* totalAmount ? totalAmount : */ 0} produkter
              </p>
            </div>
            <div className="flex-1 w-full sm:w-auto  text-gray-800   justify-center flex items-center flex-col p-7 gap-4">
              <IconServer2 width={38} height={38} className="text-[#264133]" />
              <p>Du har totalt:</p>

              <p className="font-semibold text-xl ">
                {inventoryLocations?.length} st lagerplatser
              </p>
            </div>
            <div className="flex-1 w-full sm:w-auto  text-gray-800  justify-center flex items-center flex-col p-7 gap-4">
              <IconCurrencyKroneSwedish
                width={38}
                height={38}
                className="text-[#264133]"
              />
              <p>Du har ett försäljningsvärde på totalt:</p>

              <p className="font-semibold text-xl ">{totalSum} kr</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Overview;
