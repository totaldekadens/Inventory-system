import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import NewArticleDesktop from "./article/NewArticleDesktop";
import HandleLocations from "./handleLocations/HandleLocations";
import HandleVehicleModels from "./archive/handleVehicleModelsOld/HandleVehicleModels";
import { useRemoveBackgroundScroll } from "@/lib/useRemoveBackgroundScroll";
import Navigation from "./layout/navigation/Navigation";
import Stats from "./Stats";

const Hero = () => {
  const { data: session } = useSession();
  const [createArticle, setCreateArticle] = useState(false);
  const [handleLocations, setHandleLocations] = useState(false);
  const [handleVehiceModels, setHandleVehicleModels] = useState(false);

  useEffect(() => {
    useRemoveBackgroundScroll(createArticle);
  }, [createArticle]);
  useEffect(() => {
    useRemoveBackgroundScroll(handleLocations);
  }, [handleLocations]);
  useEffect(() => {
    useRemoveBackgroundScroll(handleVehiceModels);
  }, [handleVehiceModels]);

  const list = [
    {
      title: "Överblick",
      src: "/bullet.svg",
      alt: "bild på ikon",
      setState: null,
    },
    {
      title: "Lagerplatser",
      src: "/inventory.svg",
      alt: "bild på ikon",
      setState: setHandleLocations,
    },
    {
      title: "Modeller",
      src: "/subfolder.svg",
      alt: "bild på ikon",
      setState: setHandleVehicleModels,
    },
    {
      title: "Historik",
      src: "/transaction-history.svg",
      alt: "bild på ikon",
      setState: null,
    },
    {
      title: "Konto",
      src: "/user.svg",
      alt: "bild på ikon",
      setState: null,
    },
    {
      title: "Statistik",
      src: "/pie-chart.svg",
      alt: "bild på ikon",
      setState: null,
    },
  ];

  return (
    <div className="flex sm:justify-between  lg:pt-2 2xl:pt-32 h-full gap-4 sm:gap-10 flex-col md:flex-row">
      <div className="min-w-[250px] hidden sm:flex flex-col text-custom-300 flex-1 items-center md:items-start ">
        <p className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl mb-10 sm:mb-1 xl:mb-3">
          Välkommen tillbaka!
        </p>
        <div className="sm:mt-12">
          <button
            onClick={() => setCreateArticle(true)}
            className="sm:mt-0 sm:flex-none rounded-md flex text-xl sm:text-3xl items-center bg-custom-50 py-7 px-8 text-center gap-3 font-normal text-custom-300 drop-shadow-3xl border border-custom-50 hover:border-custom-100 hover:drop-shadow-4xl transition-all duration-200"
          >
            Lägg till artikel{" "}
            <Image src="/plus.svg" alt="plus-icon" width={28} height={28} />
          </button>
        </div>
        <div className="w-full hidden md:block mt-10 pr-10">
          <Stats />
        </div>
      </div>
      <Navigation list={list} setCreateArticle={setCreateArticle} />
      <div className="w-full md:hidden mt-10">
        <Stats />
      </div>
      {createArticle ? (
        <NewArticleDesktop setCreateArticle={setCreateArticle} />
      ) : null}
      {handleLocations ? (
        <HandleLocations setHandleLocations={setHandleLocations} />
      ) : null}
      {handleVehiceModels ? (
        <HandleVehicleModels setHandleVehicleModels={setHandleVehicleModels} />
      ) : null}
    </div>
  );
};

export default Hero;
