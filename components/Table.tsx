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

const Table = () => {
  const { currentArticles, setCurrentArticles } = useContext(articleContext);
  const [open, setOpen] = useState(false);
  const [currentArticle, setCurrentArticle] =
    useState<PopulatedArticleDocument>();

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
                const path = `https://res.cloudinary.com/dkzh2lxon/image/upload/v1688383484/inventory/${article.images[0]}`;

                return (
                  <tr key={i} className="">
                    {/* Artikel */}
                    <td className="md:whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-3 ">
                      <div className="flex">
                        {/* Image */}
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
                            {/* Title */}
                            <div className="relative h-5">
                              <div
                                className="font-medium whitespace-nowrap text-gray-900 cursor-pointer  absolute truncate"
                                onClick={() => {
                                  setOpen(true);
                                  setCurrentArticle(article);
                                }}
                              >
                                {article.title}
                              </div>
                            </div>
                            {/* Modell Mobile & Tab */}

                            <div className="mt-1 w-full gap-2 items-center lg:hidden text-gray-500 flex flex-wrap sm:whitespace-nowrap  ">
                              <Spoiler
                                styles={{ control: { color: "#264133" } }}
                                color="#264133"
                                key={i}
                                maxHeight={20}
                                showLabel={`+ ${
                                  article.vehicleModels.length - 1
                                }`}
                                hideLabel="Dölj"
                              >
                                {article.vehicleModels?.map((model, i) => (
                                  <div
                                    key={i}
                                    className="text-gray-500 h-full "
                                  >
                                    {model.name}
                                  </div>
                                ))}
                              </Spoiler>
                            </div>

                            {/* Supplier part no */}
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
                    {/* Modell */}
                    <td className="whitespace-nowrap hidden lg:table-cell py-5 text-sm text-gray-500 flex-wrap">
                      <Spoiler
                        styles={{ control: { color: "#264133" } }}
                        color="#264133"
                        key={i}
                        maxHeight={20}
                        showLabel={`+ ${article.vehicleModels.length - 1}`}
                        hideLabel="Dölj"
                      >
                        {article.vehicleModels?.map((model, i) => (
                          <div key={i} className="text-gray-900 h-full ">
                            {model.name}
                          </div>
                        ))}
                      </Spoiler>
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
                              await fetch(`api/article/${article._id}`, {
                                method: "DELETE",
                              });

                              const response = await fetch("/api/article/");
                              const result = await response.json();
                              if (result.success) {
                                setCurrentArticles(result.data);
                              }
                            }
                          }}
                        />
                      </div>
                    </td>
                  </tr>
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

export default Table;
