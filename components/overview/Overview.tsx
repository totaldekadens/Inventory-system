import Hero from "../layout/Hero";
import Stats from "./Stats";
import ArticleFilters from "./ArticleFilters";
import TableOverview from "../article/articleTables/tableOverview/TableOverview";
import { useRef } from "react";
import ScrollToSection from "../ui/ScrollToSection";

const Overview = () => {
  const filtersRef = useRef<HTMLDivElement>(null);

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-10 md:mt-10 sm:mt-8 w-full pb-20 max-w-8xl">
      <Hero />

      <div className="flow-root">
        <div className="scroll-mt-6" ref={filtersRef}>
          <h1 className="mb-7 text-5xl">Ditt lager</h1>

          <ArticleFilters />
        </div>

        <TableOverview />

        <Stats />
      </div>

      <ScrollToSection targetRef={filtersRef} />
    </div>
  );
};

export default Overview;
