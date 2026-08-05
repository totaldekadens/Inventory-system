import { IconChevronUp } from "@tabler/icons-react";
import { useRef, useState } from "react";

interface Props {
  title: string;
  content: React.ReactNode;
}

const Accordion = ({ title, content }: Props) => {
  const [active, setActive] = useState(false);
  const [height, setHeight] = useState("0px");
  const [rotate, setRotate] = useState("transform duration-700 ease");

  const contentSpace = useRef(null);

  function toggleAccordion() {
    setActive((prevState) => !prevState);
    // @ts-ignore
    setHeight(active ? "0px" : `${contentSpace.current.scrollHeight}px`);
    setRotate(
      active
        ? "transform duration-700 ease"
        : "transform duration-700 ease rotate-180"
    );
  }

  return (
    <div className="flex flex-col">
      <button
        className="pb-6 box-border appearance-none cursor-pointer focus:outline-none flex items-center "
        onClick={toggleAccordion}
      >
        <p className="inline-block text-footnote light font-medium  text-gray-900 mt-2 lg:mt-4">
          {title}
        </p>
        <IconChevronUp className={`${rotate} inline-block ml-3 mt-2 lg:mt-4`} />
      </button>
      <div
        ref={contentSpace}
        style={{ maxHeight: `${height}` }}
        className=" transition-max-height duration-700 ease-in-out" //overflow-auto
      >
        <div className="pb-10">{content}</div>
      </div>
    </div>
  );
};

export default Accordion;
