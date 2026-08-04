import clsx from "clsx";

interface Props {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
}

const SearchBar = ({ query, setQuery, placeholder = "Sök..." }: Props) => {
  return (
    <div className="w-full">
      <input
        type="text"
        name="search"
        id="article-search"
        value={query}
        className={clsx(
          "py-3.5 placeholder:text-gray-500",
          "block w-full rounded-md border-0 text-gray-900 ring-1 ring-inset mt-2 ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6 md:h-auto",
        )}
        placeholder={placeholder}
        onChange={(event) => setQuery(event.currentTarget.value)}
      />
    </div>
  );
};

export default SearchBar;
