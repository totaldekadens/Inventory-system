import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import Image from "next/image";

interface Props {
  images: string[];
}
const Slider = ({ images }: Props) => {
  return (
    <Splide aria-label="My Favorite Images">
      {images.map((image, i) => {
        const path = `https://res.cloudinary.com/dkzh2lxon/image/upload/w_600/q_60/v1688383484/inventory/${image}`;
        return (
          <SplideSlide
            key={i}
            style={{ height: "100%" }}
            className="flex justify-center"
          >
            <Image
              src={path}
              alt={"Bild på artikel"}
              width={600}
              height={600}
              priority={i === 0}
              quality="60"
              className="object-contain h-full max-h-full"
            />
          </SplideSlide>
        );
      })}
    </Splide>
  );
};

export default Slider;
