import QtyControls from "@/components/buttons/QtyControls";
import {
  PopulatedArticleDocument,
  articleContext,
} from "@/components/context/ArticleProvider";
import { Spoiler } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { Dispatch, SetStateAction, useContext, useState } from "react";

interface Props {
  article: PopulatedArticleDocument;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setCurrentArticle: Dispatch<
    SetStateAction<PopulatedArticleDocument | undefined>
  >;
}

const TableRow = ({ article, setOpen, setCurrentArticle }: Props) => {
  const { currentArticles, setCurrentArticles } = useContext(articleContext);

  const path = `https://res.cloudinary.com/dkzh2lxon/image/upload/w_200/q_60/v1688383484/inventory/${article.images[0]}`;

  return (
    <tr className="">
      {/* Artikel */}
      <td className="md:whitespace-nowrap py-2 pl-4 pr-3 text-sm sm:pl-3 ">
        <div className="flex">
          {/* Image */}
          <div
            className="h-20 w-20 flex-shrink-0 cursor-pointer"
            onClick={() => {
              setOpen(true);
              setCurrentArticle(article);
            }}
          >
            <img
              className="h-20 w-20 rounded-sm object-cover"
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
                  maxHeight={20}
                  showLabel={`+ ${article.vehicleModels.length - 1}`}
                  hideLabel="Dölj"
                >
                  {article.vehicleModels?.map((model, i) => (
                    <div key={i} className="text-gray-500 h-full ">
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
      <td className="whitespace-nowrap hidden lg:table-cell py-2 text-sm text-gray-500 flex-wrap">
        <Spoiler
          styles={{ control: { color: "#264133" } }}
          color="#264133"
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
      <td className="whitespace-nowrap hidden lg:table-cell  px-3 py-2  text-sm text-gray-500">
        <div className="text-gray-900 h-full ">{article.condition}</div>
      </td>
      {/* Antal - tab and desktop */}
      <td className="whitespace-nowrap hidden md:table-cell px-3 py-2  text-sm text-gray-500">
        <div className="mt-3 w-full gap-2 items-center  text-gray-800  flex flex-wrap">
          <QtyControls articleObject={article} />
        </div>
      </td>
      {/* Lagerplats */}
      <td className="whitespace-nowrap pl-3 py-2  text-sm  text-gray-500">
        <div className="flex items-end md:items-center h-24">
          {article.inventoryLocation.name}
        </div>
      </td>
      {/* Edit/Remove - Icons */}
      <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 ">
        <div className="flex h-24 flex-col md:flex-row items-center justify-end md:justify-center">
          <IconX
            className="text-red-600 hover:text-red-900 cursor-pointer"
            onClick={async () => {
              const test = confirm("Är du säker?");
              // Todo: Update this one later
              if (test) {
                try {
                  await fetch(`api/article/${article._id}`, {
                    method: "DELETE",
                  });
                  const response = await fetch("/api/article/");
                  const result = await response.json();
                  if (result.success) {
                    setCurrentArticles(result.data);
                  }
                } catch (err) {
                  console.error(err);
                }
              }
            }}
          />
        </div>
      </td>
    </tr>
  );
};

export default TableRow;
