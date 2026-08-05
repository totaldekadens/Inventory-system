import { RefObject, useEffect, useState } from "react";
import { IconChevronUp } from "@tabler/icons-react";
import clsx from "clsx";

interface Props {
  targetRef: RefObject<HTMLElement>;
}

const ScrollToSection = ({ targetRef }: Props) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!targetRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      {
        threshold: 0,
      },
    );

    observer.observe(targetRef.current);

    return () => observer.disconnect();
  }, [targetRef]);

  const scrollToSection = () => {
    targetRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <button
      type="button"
      aria-label="Till filtreringen"
      title="Till filtreringen"
      onClick={scrollToSection}
      className={clsx(
        "fixed bottom-6 right-6 z-50",
        "rounded-full bg-[#264133] p-4 shadow-lg",
        "text-white transition-all duration-300",
        "hover:scale-105 hover:bg-[#3d6552]",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <IconChevronUp size={24} />
    </button>
  );
};

export default ScrollToSection;
