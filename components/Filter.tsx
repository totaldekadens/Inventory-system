import { useContext } from "react";
import RadioButtons from "./buttons/RadioButtons";
import SearchBarKombo from "./searchbars/SearchBarKombo";
import SearchBarKomboModels from "./searchbars/SearchBarKomboModels";
import { articleContext } from "./context/ArticleProvider";
import SearchBar from "./searchbars/SearchBar";

const Filter = () => {
  const { setCurrentArticles, articles } = useContext(articleContext);
  return (
    <>
      <div className="w-full flex sm:justify-end">
        <RadioButtons />
      </div>
      <div className="flex flex-col md:flex-row gap-4 sm:gap-0 justify-between mt-4 mb-8">
        <SearchBar
          setFilteredObjectList={setCurrentArticles}
          listOfObjects={articles}
          articles
        />
        <div className="text-xs py-2 md:py-0 md:px-2 hidden sm:flex whitespace-nowrap justify-center  items-center"></div>
        <div className="flex ">
          <SearchBarKomboModels />
          <div className="text-xs  hidden sm:flex  px-2 whitespace-nowrap justify-center  items-center">
            och / eller
          </div>
          <div className=" px-2 sm:hidden" />
          <SearchBarKombo />
        </div>
      </div>
    </>
  );
};

export default Filter;
