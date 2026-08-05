import { IconX } from "@tabler/icons-react";
import clsx from "clsx";

interface Props {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
}

const SearchBar = ({ query, setQuery, placeholder = "Sök..." }: Props) => {
  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="text"
          id="article-search"
          value={query}
          placeholder={placeholder}
          onChange={(event) => setQuery(event.currentTarget.value)}
          className={clsx(
            "mt-2 block w-full rounded-md border-0 py-3.5",
            query ? "pr-10" : "pr-3",
            "text-gray-900 ring-1 ring-inset ring-gray-300",
            "placeholder:text-gray-500",
            "focus:ring-2 focus:ring-inset focus:ring-indigo-600",
            "sm:leading-6",
          )}
        />

        {query && (
          <button
            type="button"
            aria-label="Rensa sökfält"
            title="Rensa sökfält"
            onClick={() => setQuery("")}
            className={clsx(
              "absolute inset-y-0 right-0 flex items-center px-3",
              "text-gray-400 hover:text-red-600",
              "focus:outline-none focus-visible:ring-2",
              "focus-visible:ring-indigo-600",
            )}
          >
            <IconX width={16} height={16} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
