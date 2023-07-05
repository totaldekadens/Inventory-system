import { useContext, useEffect, useState } from "react";
import { articleContext } from "../context/ArticleProvider";

const SearchBar = () => {
  const { setCurrentArticles, articles } = useContext(articleContext);
  const [query, setQuery] = useState("");

  // Filtering articles depending on search input.
  useEffect(() => {
    const updateArticles = async () => {
      if (articles) {
        const filterArticles = articles.filter(
          (article) =>
            article.artno
              .toString()
              .toUpperCase()
              .includes(query.toUpperCase()) ||
            (article.description &&
              article.description
                .toUpperCase()
                .includes(query.toUpperCase())) ||
            (article.supplierArtno &&
              article.supplierArtno
                .toUpperCase()
                .includes(query.toUpperCase())) ||
            article.title.toUpperCase().includes(query.toUpperCase())
        );
        setCurrentArticles(filterArticles);
      }
    };
    updateArticles();
  }, [query]);
  return (
    <div className="w-full">
      <div className="w-full">
        <input
          type="search"
          name="search"
          id="search"
          className="block w-full rounded-md border-0 py-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Sök på artikelnummer, beskrivning.."
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;
