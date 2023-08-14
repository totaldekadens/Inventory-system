import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import NewArticle from "./NewArticle";
import HandleLocations from "./handleLocations/HandleLocations";
import HandleVehicleModels from "./handleVehicleModels/HandleVehicleModels";
import { useRemoveBackgroundScroll } from "@/lib/useRemoveBackgroundScroll";
import Navigation from "./Navigation";
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
    <div className="flex justify-between pt-4 lg:pt-8 xl:pt-8 2xl:pt-32 h-full gap-10 flex-col lg:flex-row">
      <div className="min-w-[250px]  flex flex-col text-custom-300 flex-1 items-center lg:items-start ">
        <p className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl mb-10">
          Välkommen tillbaka!
        </p>
        <div className="mt-12">
          <button
            onClick={() => setCreateArticle(true)}
            className="sm:mt-0 sm:flex-none rounded-md flex text-3xl items-center bg-custom-50 py-7 px-8 text-center gap-3 font-normal text-custom-300 drop-shadow-3xl border border-custom-50 hover:border-custom-100 hover:drop-shadow-4xl transition-all duration-200"
          >
            Lägg till artikel{" "}
            <Image src="/plus.svg" alt="plus-icon" width={28} height={28} />
          </button>
        </div>
        <Stats />
      </div>
      <Navigation list={list} />
      {createArticle ? (
        <NewArticle setCreateArticle={setCreateArticle} />
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
