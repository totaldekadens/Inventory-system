import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import NewArticle from "./NewArticle";
const Hero = () => {
  const { data: session } = useSession();
  const [createArticle, setCreateArticle] = useState(false);
  return (
    <div className="flex relative items-center w-full justify-center  h-[590px] mb-10 ">
      <div className="min-w-[250px] pt-14  sm:pt-20 lg:pt-32 h-full items-center flex flex-col flex-1 md:flex-0 ">
        <p className="text-3xl mb-10 ">
          {`Välkommen tillbaka${
            session?.user?.firstName ? ", " + session?.user?.firstName : ""
          }!`}
        </p>
        <div className=" block sm:hidden h-64 mb-20 ">
          <img className="w-full h-full object-contain" src="/mole2.png" />
        </div>
        <div className="flex gap-3 flex-wrap justify-center sm:justify-start ">
          <button
            onClick={() => setCreateArticle(true)}
            type="button"
            className=" sm:mt-0 sm:flex-none rounded-md flex items-center bg-[#264133] px-3 py-3 text-center text-base gap-3 font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Lägg till artikel <IconPlus width={20} height={20} />
          </button>

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
      <div className="flex-1 md:flex-0  hidden sm:flex justify-center ">
        <img className="w-full max-w-[600px]" src="/mole2.png" />
      </div>
      {createArticle ? (
        <NewArticle setCreateArticle={setCreateArticle} />
      ) : null}
    </div>
  );
};

export default Hero;
