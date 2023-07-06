import Hero from "./Hero";
import Stats from "./Stats";
import Filter from "./Filter";
import Table from "./Table";

const Overview = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-10 md:mt-10 sm:mt-8 w-full pb-20">
      {/* Introduction */}
      <Hero />
      <div className="flow-root">
        {/* Searchbars and filter */}
        <Filter />
        {/* Table of all filtered articles */}
        <Table />
        {/* Stats of articles and inventory locations */}
        <Stats />
      </div>
    </div>
  );
};

export default Overview;
