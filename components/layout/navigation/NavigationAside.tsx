import clsx from "clsx";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

interface Object {
  title: string;
  src: string;
  alt: string;
  setState: Dispatch<SetStateAction<boolean>> | null;
  state: boolean;
}

interface Props {
  list: Object[];
}
const NavigationAside = ({ list }: Props) => {
  return (
    <div
      className=" grid-cols-1 gap-3 hidden md:grid"
      style={{ height: "80vh" }}
    >
      {list.map((icon) => (
        <>
          {icon.title == "Historik" ? (
            <Link
              href={"/history"}
              onClick={() => {
                icon.setState ? icon.setState(true) : null;
              }}
              className={clsx(
                icon.state ? "bg-custom-100" : "bg-custom-50 ",
                "shadow-md p-2 xl:p-3 rounded-lg gap-2 flex flex-col items-center justify-center hover:shadow-2xl transition-all duration-200 cursor-pointer border border-custom-50 hover:border-custom-100"
              )}
            >
              <img
                src={icon.src}
                alt={icon.alt}
                className="w-6 h-6 2xl:w-14 2xl:h-14"
              />
              <p className="text-xs xl:text-sm whitespace-nowrap">
                {icon.title}
              </p>
            </Link>
          ) : (
            <div
              onClick={() => {
                icon.setState ? icon.setState(true) : null;
              }}
              className={clsx(
                icon.state ? "bg-custom-100" : "bg-custom-50 ",
                "shadow-md p-2 xl:p-3 rounded-lg gap-2 flex flex-col items-center justify-center hover:shadow-2xl transition-all duration-200 cursor-pointer border border-custom-50 hover:border-custom-100"
              )}
            >
              <img
                src={icon.src}
                alt={icon.alt}
                className="w-6 h-6 2xl:w-14 2xl:h-14"
              />
              <p className="text-xs xl:text-sm whitespace-nowrap">
                {icon.title}
              </p>
            </div>
          )}
        </>
      ))}
    </div>
  );
};

export default NavigationAside;
