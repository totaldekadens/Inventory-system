import Link from "next/link";
import LogoutButton from "../buttons/LogoutButton";
import Image from "next/image";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import HandleLocations from "../handleLocations/HandleLocations";
import HandleVehicleModels from "../archive/handleVehicleModelsOld/HandleVehicleModels";
import { useRemoveBackgroundScroll } from "@/lib/useRemoveBackgroundScroll";
import MobileNavigation from "./navigation/MobileNavigation";
import NewArticleMobile from "../article/NewArticleMobile";
import Filter from "../Filter";
import TableOverview from "../tables/tableOverview/TableOverview";

const Header = () => {
  const [createArticle, setCreateArticle] = useState(false);
  const [handleLocations, setHandleLocations] = useState(false);
  const [handleVehicleModels, setHandleVehicleModels] = useState(false);
  const [overview, setOverview] = useState(true);

  useEffect(() => {
    useRemoveBackgroundScroll(createArticle);
    if (createArticle) {
      setHandleLocations(false);
      setHandleVehicleModels(false);
      setOverview(false);
    }
  }, [createArticle]);
  useEffect(() => {
    useRemoveBackgroundScroll(handleLocations);
    if (handleLocations) {
      setCreateArticle(false);
      setHandleVehicleModels(false);
      setOverview(false);
    }
  }, [handleLocations]);
  useEffect(() => {
    useRemoveBackgroundScroll(handleVehicleModels);
    if (handleVehicleModels) {
      setCreateArticle(false);
      setHandleLocations(false);
      setOverview(false);
    }
  }, [handleVehicleModels]);
  return (
    <header className=" top-0 z-10  right-0 left-0 h-42 flex items-center justify-between py-6 sm:py-12 px-8 sm:px-12 lg:px-14">
      <Link
        href={"/"}
        className="font-bold font-sans text-lg w-[220px] sm:w-[300px]"
      >
        <Image
          src={"/logo_black.png"}
          width={250}
          height={52}
          alt="Bild på logga"
          className="contain"
        />
      </Link>
      <div className="flex gap-2 items-center">
        <LogoutButton />
        <div className="block lg:hidden">
          <MobileNavigation
            setHandleVehicleModels={setHandleVehicleModels}
            setCreateArticle={setCreateArticle}
            setHandleLocations={setHandleLocations}
          />
        </div>
      </div>
      {createArticle ? (
        <NewArticleMobile setCreateArticle={setCreateArticle} />
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
