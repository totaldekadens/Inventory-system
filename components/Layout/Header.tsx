import Link from "next/link";
import LogoutButton from "../buttons/LogoutButton";
import Image from "next/image";
import { IconPlus } from "@tabler/icons-react";

const Header = () => {
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
        <Link href={"#"} className=" mr-10 hidden md:flex ">
          Hantera lagerplatser
        </Link>
        <Link href={"/create"} className=" gap-0 mr-10  hidden md:flex  ">
          Lägg till artikel <IconPlus width={14} height={14} strokeWidth={3} />
        </Link>
        <LogoutButton />
      </div>
    </header>
  );
};

export default Header;
