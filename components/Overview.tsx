import { useContext, useRef, useState } from "react";
import SearchBar from "./searchbars/SearchBar";
import SearchBarKombo from "./searchbars/SearchBarKombo";
import { IconPlus, IconX } from "@tabler/icons-react";
import {
  PopulatedArticleDocument,
  articleContext,
} from "./context/ArticleProvider";
import Link from "next/link";
import QtyControls from "./buttons/QtyControls";
import ArticleView from "./article/articleView/ArticleView";

const Overview = () => {
  const { currentArticles, setCurrentArticles } = useContext(articleContext);
  const [open, setOpen] = useState(false);
  const [currentArticle, setCurrentArticle] =
    useState<PopulatedArticleDocument>();

  console.log(currentArticle);
  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 mt-24 sm:mt-8 w-full pb-20">
        {/* Introduction and "create article"-button */}
        <div className="flex flex-col sm:flex-row items-center">
          <div className="sm:flex-auto">
            <h1 className="text-lg sm:text-base text-center sm:text-left font-semibold leading-6 text-gray-900">
              Överblick - Lagerartiklar
            </h1>
            <p className="mt-2 text-sm text-center sm:text-left text-gray-700">
              Här har du en lista på dina samtliga lagerförda artiklar
            </p>
          </div>

          <Link
            href="/create"
            className="mt-16 mb-16 sm:ml-16 sm:mt-0 sm:flex-none"
          >
            <button
              type="button"
              className=" rounded-md flex items-center bg-gray-900 px-3 py-3 text-center text-base gap-3 font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Lägg till artikel <IconPlus width={20} height={20} />
            </button>
          </Link>
        </div>

        <div className="mt-8 flow-root">
          {/* Searchbars */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between mt-4 mb-8">
            <SearchBar />
            <SearchBarKombo />
          </div>

          {/* Article list */}
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
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
                      className="px-3 py-3.5 hidden sm:flex text-left text-sm font-semibold text-gray-900"
                    >
                      Antal
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
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
                <tbody className="divide-y divide-gray-200 bg-white">
                  {!currentArticles
                    ? null
                    : currentArticles.map((article, i) => {
                        const path = `https://res.cloudinary.com/dkzh2lxon/image/upload/v1688383484/inventory/${article.images[0]}`;

                        return (
                          <tr key={i}>
                            {/* Artikel */}
                            <td className="md:whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                              <div className="flex items-center">
                                <div
                                  className="h-24 w-24 flex-shrink-0 cursor-pointer"
                                  onClick={() => {
                                    setOpen(true);
                                    setCurrentArticle(article);
                                  }}
                                >
                                  <img
                                    className="h-24 w-24 rounded-sm"
                                    src={path}
                                    alt="Bild på artikel"
                                  />
                                </div>
                                <div className="ml-4">
                                  <div
                                    className="font-medium text-gray-900 cursor-pointer "
                                    onClick={() => {
                                      setOpen(true);
                                      setCurrentArticle(article);
                                    }}
                                  >
                                    {article.title}
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

                                  {/* Qty controls - mobile device */}
                                  <div className="mt-3 w-full gap-2 items-center sm:hidden text-gray-500 flex flex-wrap">
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
                            <td className="whitespace-nowrap hidden sm:table-cell px-3 py-5 text-sm text-gray-500">
                              <div className="mt-3 w-full gap-2 items-center  text-gray-500 flex flex-wrap">
                                <QtyControls articleObject={article} />
                              </div>
                            </td>
                            {/* Lagerplats */}
                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                              {article.inventoryLocation.name}
                            </td>
                            {/* Edit/Remove - Icons */}
                            <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                              <div className="flex flex-col sm:flex-row gap-5">
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
        </div>
      </div>
    </>
  );
};

export default Overview;
