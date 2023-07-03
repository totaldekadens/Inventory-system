import { useContext, useState } from "react";
import SearchBar from "./SearchBar";
import SearchBarKombo from "./SearchBarKombo";
import { IconEdit, IconPlus, IconX } from "@tabler/icons-react";
import { InventoryLocationDocument } from "@/models/InventoryLocationModel";
import { articleContext } from "./context/ArticleProvider";
import CreateArticle from "./CreateArticle";

const Overview = () => {
  const { currentArticles } = useContext(articleContext);
  const [hidden, setHidden] = useState<boolean>(true);
  console.log(hidden);
  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 mt-8 w-full">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Överblick - Lagerartiklar
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Här har du en lista på dina samtliga lagerförda artiklar
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              onClick={() => {
                setHidden(false);
              }}
              type="button"
              className=" rounded-md flex items-center bg-gray-900 px-3 py-3 text-center text-base gap-3 font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Lägg till artikel <IconPlus width={20} height={20} />
            </button>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="flex justify-between mt-4 mb-8">
            <SearchBar />
            <SearchBarKombo />
          </div>
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
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
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Skick
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
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
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {!currentArticles
                    ? null
                    : currentArticles.map((article, i) => (
                        <tr key={i}>
                          <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                            <div className="flex items-center">
                              <div className="h-24 w-24 flex-shrink-0">
                                <img
                                  className="h-24 w-24 rounded-sm"
                                  src={article.images[0]}
                                  alt=""
                                />
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-900">
                                  {article.artno}
                                </div>
                                <div className="mt-1 text-gray-500">
                                  {article.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                            <div className="text-gray-900">
                              {article.condition}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                            <span className="inline-flex items-center rounded-md  px-2 py-1 text-xs font-semibold text-gray-800 ">
                              {article.qty}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                            {article.inventoryLocation.name}
                          </td>
                          <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                            <div className="flex gap-5">
                              <IconEdit className="text-indigo-600 hover:text-indigo-900 cursor-pointer" />
                              <IconX className="text-red-600 hover:text-red-900 cursor-pointer" />
                            </div>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {!hidden ? <CreateArticle setHidden={setHidden} /> : null}
    </>
  );
};

export default Overview;
