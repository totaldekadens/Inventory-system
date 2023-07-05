import Link from "next/link";
import LogoutButton from "../buttons/LogoutButton";
import Image from "next/image";

const Header = () => {
  return (
    <header className="fixed top-0 z-10 bg-white right-0 left-0 h-42 flex items-center justify-between py-6 sm:py-12 px-8 sm:px-12 lg:px-16">
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
      <LogoutButton />
    </header>
  );
};

export default Header;
