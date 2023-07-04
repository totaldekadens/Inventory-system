import { MouseEventHandler, memo } from "react";
import cn from "clsx";
import s from "./SliderControl.module.css";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";

interface Props {
  onPrev: MouseEventHandler<HTMLButtonElement>;
  onNext: MouseEventHandler<HTMLButtonElement>;
}

const SliderControl = ({ onPrev, onNext }: Props) => (
  <div className={s.control}>
    <button
      style={{ height: 44, width: 44 }}
      className={cn(s.leftControl)}
      onClick={onPrev}
      aria-label="Previous Product Image"
    >
      <ChevronLeftIcon />
    </button>
    <button
      style={{ height: 44, width: 44 }}
      className={cn(s.rightControl)}
      onClick={onNext}
      aria-label="Next Product Image"
    >
      <ChevronRightIcon />
    </button>
  </div>
);

export default memo(SliderControl);
