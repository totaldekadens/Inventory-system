import { Dispatch, SetStateAction } from "react";

interface Object {
  title: string;
  src: string;
  alt: string;
  setState: Dispatch<SetStateAction<boolean>> | null;
}

interface Props {
  list: Object[];
}
const Navigation = ({ list }: Props) => {
  return (
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
  );
};

export default Navigation;
