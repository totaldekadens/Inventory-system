import { useEffect, useState } from "react";

interface Props {
  articles: any[];
  setCurrentArticles: any;
}

const SearchBar = ({ articles, setCurrentArticles }: Props) => {
  const [query, setQuery] = useState("");

  // Filtering articles depending on search input.
  useEffect(() => {
    const updateArticles = async () => {
      const filterArticles = articles.filter(
        (article) =>
          article.artno.toUpperCase().includes(query.toUpperCase()) ||
          article.description.toUpperCase().includes(query.toUpperCase())
      );
      setCurrentArticles(filterArticles);
    };
    updateArticles();
  }, [query]);
  return (
    <div>
      <div className="mt-2 w-64">
        <input
          type="text"
          name="search"
          id="search"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Sök på artikelnummer, beskrivning.."
          onChange={(event) => setQuery(event.currentTarget.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;
