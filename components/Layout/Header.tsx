import Link from "next/link";
import LogoutButton from "../buttons/LogoutButton";
import Image from "next/image";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import NewArticle from "../NewArticle";
import HandleLocations from "../handleLocations/HandleLocations";
import HandleVehicleModels from "../handleVehicleModels/HandleVehicleModels";
import { useRemoveBackgroundScroll } from "@/lib/useRemoveBackgroundScroll";

const Header = () => {
  const [createArticle, setCreateArticle] = useState(false);
  const [handleLocations, setHandleLocations] = useState(false);
  const [handleVehicleModels, setHandleVehicleModels] = useState(false);

  useEffect(() => {
    useRemoveBackgroundScroll(createArticle);
  }, [createArticle]);
  useEffect(() => {
    useRemoveBackgroundScroll(handleLocations);
  }, [handleLocations]);
  useEffect(() => {
    useRemoveBackgroundScroll(handleVehicleModels);
  }, [handleVehicleModels]);
  return (
    <header className=" top-0 z-10 bg-white right-0 left-0 h-42 flex items-center justify-between py-6 sm:py-12 px-8 sm:px-12 lg:px-16">
      <Link
        href={"/"}
        className="font-bold font-sans text-lg w-[220px] sm:w-[300px]"
      >
        <Image
          src={"/logo_black.png"}
          width={300}
          height={100}
          alt="Bild på logga"
          className="contain"
        />
      </Link>
      <div className="flex gap-2 items-center">
        <div
          onClick={() => setHandleVehicleModels(true)}
          className=" mr-10 hidden md:flex cursor-pointer "
        >
          Hantera modeller
        </div>
        <div
          onClick={() => setHandleLocations(true)}
          className=" mr-10 hidden md:flex cursor-pointer "
        >
          Hantera lagerplatser
        </div>
        <div
          onClick={() => {
            setCreateArticle(true);
          }}
          className=" cursor-pointer gap-0 mr-10  hidden md:flex  "
        >
          Lägg till artikel <IconPlus width={14} height={14} strokeWidth={3} />
        </div>
        <LogoutButton />
      </div>
      {createArticle ? (
        <NewArticle setCreateArticle={setCreateArticle} />
      ) : null}
      {handleLocations ? (
        <HandleLocations setHandleLocations={setHandleLocations} />
      ) : null}
      {handleVehicleModels ? (
        <HandleVehicleModels setHandleVehicleModels={setHandleVehicleModels} />
      ) : null}
    </header>
  );
};

export default Header;
