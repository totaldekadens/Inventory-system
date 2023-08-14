import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import NewArticle from "./NewArticle";
import HandleLocations from "./handleLocations/HandleLocations";
import HandleVehicleModels from "./handleVehicleModels/HandleVehicleModels";
import { useRemoveBackgroundScroll } from "@/lib/useRemoveBackgroundScroll";

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
    { title: "Konto", src: "/user.svg", alt: "bild på ikon", setState: null },
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
            className="sm:mt-0 sm:flex-none rounded-md flex text-3xl items-center bg-custom-50 py-7 px-8 text-center gap-3 font-normal text-white drop-shadow-3xl border border-custom-50 hover:border-custom-100 hover:drop-shadow-4xl transition-all duration-200"
          >
            Lägg till artikel{" "}
            <Image src="/plus.svg" alt="plus-icon" width={20} height={20} />
          </button>
        </div>
      </div>
      {/* Icons */}

      <div className="flex justify-center lg:justify-start">
        <div className=" grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-6 w-[300px] sm:w-[400px] md:w-full lg:w-[485px] justify-center max-w-xl">
          {list.map((icon) => (
            <div
              onClick={() => {
                icon.setState ? icon.setState(true) : null;
              }}
              className="shadow-sm p-8 rounded-lg gap-2 flex flex-col items-center max-w-[190px] lg:max-w-[220px]  min-w-[150px] lg:px-10  justify-center bg-custom-50 hover:shadow-2xl transition-all duration-200 cursor-pointer border border-custom-50 hover:border-custom-200"
            >
              <img
                src={icon.src}
                alt={icon.alt}
                className="lg:w-16 lg:h-16 xl:w-18 xl:h-18 2xl:w-20 2xl:h-20"
              />
              <p>{icon.title}</p>
            </div>
          ))}
        </div>
      </div>
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
