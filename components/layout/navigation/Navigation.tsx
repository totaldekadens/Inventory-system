import { Dispatch, SetStateAction } from "react";
import Image from "next/image";

interface Object {
  title: string;
  src: string;
  alt: string;
  setState: Dispatch<SetStateAction<boolean>> | null;
}

interface Props {
  list: Object[];
  setCreateArticle: Dispatch<SetStateAction<boolean>>;
}
const Navigation = ({ list, setCreateArticle }: Props) => {
  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-0 justify-center items-center lg:justify-start">
      <div className="min-w-[250px] w-full sm:hidden flex flex-col text-custom-300 items-center ">
        <p className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl mb-10">
          Välkommen tillbaka!
        </p>
        <div className="w-[320px]">
          <button
            onClick={() => setCreateArticle(true)}
            className="rounded-md flex text-xl w-full justify-center items-center bg-custom-50 py-8 px-8 text-center gap-3 font-normal text-custom-300 shadow-md border border-custom-50 hover:border-custom-100 hover:shadow-2xl transition-all duration-200"
          >
            Lägg till artikel{" "}
            <Image src="/plus.svg" alt="plus-icon" width={28} height={28} />
          </button>
        </div>
      </div>
      <div className=" grid grid-cols-2  gap-6 w-[320px] sm:w-[400px] md:w-full lg:w-[445px] xl:w-[485px] justify-center max-w-xl">
        {list.map((icon) => (
          <div
            onClick={() => {
              icon.setState ? icon.setState(true) : null;
            }}
            className="shadow-md p-7 rounded-lg gap-2 flex flex-col items-center max-w-[190px] lg:max-w-[200px] xl:max-w-[220px] min-w-[150px] lg:px-6 xl:px-10  justify-center bg-custom-50 hover:shadow-2xl transition-all duration-200 cursor-pointer border border-custom-50 hover:border-custom-100"
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
  );
};

export default Navigation;
