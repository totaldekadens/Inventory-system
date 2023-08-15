import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import HandleLocations from "./handleLocations/HandleLocations";
import HandleVehicleModels from "./handleVehicleModels/HandleVehicleModels";
import { useRemoveBackgroundScroll } from "@/lib/useRemoveBackgroundScroll";
import NewArticleDesktop from "./article/NewArticleDesktop";
import Filter from "./Filter";
import TableOverview from "./tables/tableOverview/TableOverview";
import NavigationAside from "./layout/navigation/NavigationAside";
import { IconX } from "@tabler/icons-react";
import { PopulatedArticleDocument } from "./context/ArticleProvider";
import ArticleView from "./article/articleView/ArticleView";
import { useRouter } from "next/router";
import { TransactionHistoryDocument } from "@/models/TransactionHistoryModel";
import OverviewHistory from "./OverviewHistory";

interface Props {
  history?: {
    setFilteredObjectList: Dispatch<
      SetStateAction<TransactionHistoryDocument[]>
    >;
    listOfObjects: TransactionHistoryDocument[];
    history: TransactionHistoryDocument[];
  };
}

const Active = ({ history }: Props) => {
  const { data: session } = useSession();
  const { asPath } = useRouter();
  const path = asPath;
  const [createArticle, setCreateArticle] = useState(false);
  const [handleLocations, setHandleLocations] = useState(false);
  const [handleVehiceModels, setHandleVehicleModels] = useState(false);
  const [overview, setOverview] = useState(asPath == "/history" ? false : true);
  const [overviewHistory, setOverviewHistory] = useState(
    asPath == "/history" ? true : false
  );

  useEffect(() => {
    if (path.includes("history")) {
      setOverviewHistory(true);
      setOverview(false);
    }
  }, [path]);

  useEffect(() => {
    useRemoveBackgroundScroll(overviewHistory);
    if (overviewHistory) {
      console.log("1");
      setHandleLocations(false);
      setHandleVehicleModels(false);
      setOverview(false);
      setCreateArticle(false);
    } else if (!handleLocations && !handleVehiceModels && !createArticle) {
      setOverview(true);
    }
  }, [overviewHistory]);

  useEffect(() => {
    useRemoveBackgroundScroll(createArticle);
    if (createArticle) {
      console.log("2");
      setHandleLocations(false);
      setHandleVehicleModels(false);
      setOverview(false);
    } else if (!handleLocations && !handleVehiceModels && !overviewHistory) {
      setOverview(true);
    }
  }, [createArticle]);
  useEffect(() => {
    useRemoveBackgroundScroll(handleLocations);
    if (handleLocations) {
      console.log("3");
      setCreateArticle(false);
      setHandleVehicleModels(false);
      setOverview(false);
    } else if (!createArticle && !handleVehiceModels && !overviewHistory) {
      setOverview(true);
    }
  }, [handleLocations]);
  useEffect(() => {
    useRemoveBackgroundScroll(handleVehiceModels);
    if (handleVehiceModels) {
      console.log("4");
      setCreateArticle(false);
      setHandleLocations(false);
      setOverview(false);
    } else if (!createArticle && !handleLocations && !overviewHistory) {
      setOverview(true);
    }
  }, [handleVehiceModels]);
  useEffect(() => {
    useRemoveBackgroundScroll(handleVehiceModels);
    if (overview) {
      console.log("5");
      setCreateArticle(false);
      setHandleLocations(false);
      setHandleVehicleModels(false);
      setOverviewHistory(false);
    }
  }, [overview]);

  const [open, setOpen] = useState(false);
  const [currentArticle, setCurrentArticle] =
    useState<PopulatedArticleDocument>();

  useEffect(() => {
    useRemoveBackgroundScroll(open);
  }, [open]);

  const list = [
    {
      title: "Lägg till artikel",
      src: "/plus.svg",
      alt: "bild på ikon",
      setState: setCreateArticle,
      state: createArticle,
    },
    {
      title: "Överblick",
      src: "/bullet.svg",
      alt: "bild på ikon",
      setState: setOverview,
      state: overview,
    },
    {
      title: "Lagerplatser",
      src: "/inventory.svg",
      alt: "bild på ikon",
      setState: setHandleLocations,
      state: handleLocations,
    },
    {
      title: "Modeller",
      src: "/subfolder.svg",
      alt: "bild på ikon",
      setState: setHandleVehicleModels,
      state: handleVehiceModels,
    },
    {
      title: "Historik",
      src: "/transaction-history.svg",
      alt: "bild på ikon",
      setState: setOverviewHistory,
      state: overviewHistory,
    },
    {
      title: "Konto",
      src: "/user.svg",
      alt: "bild på ikon",
      setState: null,
      state: false,
    },
    {
      title: "Statistik",
      src: "/pie-chart.svg",
      alt: "bild på ikon",
      setState: null,
      state: false,
    },
  ];

  return (
    <div className="flex -mt-10  2xl:pt-32 gap-4 sm:gap-6 lg:gap-8 xl:gap-10 flex-col md:flex-row justify-center items-center md:items-start ">
      <NavigationAside list={list} />
      <div
        className="bg-custom-50 rounded-lg drop-shadow-2xl"
        style={{ width: "90%", height: "80vh", overflowY: "scroll" }}
      >
        {createArticle ? (
          <NewArticleDesktop setCreateArticle={setCreateArticle} />
        ) : null}
        {handleLocations ? (
          <HandleLocations setHandleLocations={setHandleLocations} />
        ) : null}
        {handleVehiceModels ? (
          <HandleVehicleModels
            setHandleVehicleModels={setHandleVehicleModels}
          />
        ) : null}
        {overview ? (
          <div className="p-6">
            <div className=" w-full flex justify-between items-center mb-6 md:mb-4">
              <h3 className="text-3xl font-normal leading-6 text-custom-300 ">
                Överblick
              </h3>
              <div className="flex md:hidden justify-end ">
                <IconX
                  className="cursor-pointer"
                  width={32}
                  height={32}
                  onClick={() => {
                    setCreateArticle(false);
                  }}
                />
              </div>
            </div>
            <Filter />
            <TableOverview
              setOpen={setOpen}
              setCurrentArticle={setCurrentArticle}
            />
          </div>
        ) : null}
        {overviewHistory && history ? (
          <OverviewHistory
            history={{
              setFilteredObjectList: history.setFilteredObjectList,
              listOfObjects: history.listOfObjects,
              history: history.history,
            }}
            setState={setOverviewHistory}
          />
        ) : null}
      </div>
      {open && currentArticle ? (
        <ArticleView setOpen={setOpen} article={currentArticle} />
      ) : null}
    </div>
  );
};

export default Active;
