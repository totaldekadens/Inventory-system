import { IconEdit } from "@tabler/icons-react";
import { PopulatedArticleDocument } from "../context/ArticleProvider";

interface Props {
  article: PopulatedArticleDocument;
  className?: string;
}

const forSaleRadio = [
  { id: "1", title: "Ja", bool: true },
  { id: "2", title: "Nej", bool: false },
];

const ArticleSidebar = ({ article, className }: Props) => {
  return (
    <aside className={className}>
      <div className="flex justify-between mb-4">
        <div>
          <h1 className="text-xl font-medium text-gray-900">{article.title}</h1>
          <p className="text-lg font-medium tracking-tight text-gray-900/70 ">
            {article.supplierArtno}
          </p>
        </div>
        <IconEdit />
      </div>
      <div className="flex justify-between flex-wrap">
        <div>
          <div className=" font-medium text-gray-900 mt-4 lg:mt-8  ">Skick</div>
          <div className="text-gray-900/80">{article.condition}</div>
        </div>
        <div>
          <div className=" font-medium text-gray-900 mt-4 lg:mt-8">Antal</div>
          <div className="text-gray-900/80">{article.qty} st</div>
        </div>
      </div>

      <div>
        <div className=" font-medium text-gray-900 mt-4 lg:mt-8">
          Beskrivning
        </div>
        <div className="text-gray-900/80">
          {article.description ? article.description : "Ingen beskrivning"}
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
          <p>{article.artno}</p>
        </div>
        <div className=" grid grid-cols-2">
          <p className=" tracking-tight text-gray-900/80">
            Leverantörens art. no:{" "}
          </p>
          <p> {article.supplierArtno ? article.supplierArtno : "-"}</p>
        </div>
        <div className=" grid grid-cols-2">
          <p className=" tracking-tight text-gray-900/80">Försäljningspris:</p>
          <p>{article.price ? article.price + " kr" : "-"}</p>
        </div>
        <div className=" grid grid-cols-2">
          <p className=" tracking-tight text-gray-900/80">Inköpspris: </p>
          <p> {article.purchaseValue ? article.purchaseValue + " kr" : "-"} </p>
        </div>

        <div className=" grid grid-cols-2">
          <p className=" tracking-tight text-gray-900/80">
            Senast uppdaterad:{" "}
          </p>
          <p>
            {" "}
            {article.lastUpdated ? article.lastUpdated : article.createdDate}
          </p>
        </div>

        <form className="mt-10">
          {/* For sale */}
          <div>
            <h3 className="font-medium text-gray-900">Kan säljas?</h3>

            <div>
              <fieldset className="mt-4">
                <div className="flex items-center space-x-10 space-y-0">
                  {forSaleRadio.map((btn) => (
                    <div key={btn.id} className="flex items-center">
                      <input
                        id={btn.id}
                        name="notification-method"
                        type="radio"
                        defaultChecked={btn.bool === article.forSale}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <label
                        htmlFor={btn.id}
                        className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                      >
                        {btn.title}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>

          {/* <button
            type="submit"
            className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add to bag
          </button> */}
        </form>
      </div>
    </aside>
  );
};

export default ArticleSidebar;
