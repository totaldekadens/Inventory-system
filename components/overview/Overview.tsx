import Hero from "../layout/Hero";
import Stats from "./Stats";
import ArticleFilters from "./ArticleFilters";
import TableOverview from "../article/articleTables/tableOverview/TableOverview";

const Overview = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-10 md:mt-10 sm:mt-8 w-full pb-20 max-w-8xl">
      {/* Introduction */}
      <Hero />
      <div className="flow-root">
        <div className="w-full text-5xl mb-7 ">Ditt lager</div>
        {/* Searchbars and filter */}
        <ArticleFilters />
        {/* Table of all filtered articles */}
        <TableOverview />
        {/* Stats of articles and inventory locations */}
        <Stats />
      </div>
    </div>
  );
};

export default Overview;
