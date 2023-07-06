import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="flex  items-center w-full justify-center  h-[520px] mb-10 ">
      <div className="min-w-[250px] pt-20 lg:pt-32 h-full items-center flex flex-col flex-1 md:flex-0 ">
        <p className="text-3xl mb-10 ">Välkommen tillbaka, Patrik!</p>
        <div className=" block sm:hidden h-44 mb-14 ">
          <img className="w-full h-full object-contain" src="/mole.png" />
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link href="/create" className="sm:mt-0 sm:flex-none">
            <button
              type="button"
              className=" rounded-md flex items-center bg-[#264133] px-3 py-3 text-center text-base gap-3 font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Lägg till artikel <IconPlus width={20} height={20} />
            </button>
          </Link>
          <Link href="/create" className="sm:mt-0 sm:flex-none">
            <button
              type="button"
              className=" rounded-md flex items-center bg-[#264133] px-3 py-3 text-center text-base gap-3 font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Hantera lagerplatser
            </button>
          </Link>
        </div>
      </div>
      <div className="flex-1 md:flex-0 max-w-[600px] hidden sm:block ">
        <img className="w-full" src="/mole2.png" />
      </div>
    </div>
  );
};

export default Hero;
