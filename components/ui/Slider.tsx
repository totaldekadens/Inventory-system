import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import Image from "next/image";
import { useContext } from "react";
import { articleContext } from "../context/ArticleProvider";

const splideOptions = {
  arrows: false,
  classes: {
    pagination: "splide__pagination flex justify-center",
    page: "splide__pagination__page !bg-gray-400 !opacity-100 [&.is-active]:!bg-gray-900",
  },
};

const Slider = () => {
  const { currentArticle } = useContext(articleContext);
  if (!currentArticle) return;
  const { images } = currentArticle;
  return (
    <Splide
      hasTrack={false}
      options={splideOptions}
      aria-label="My Favorite Images"
    >
      <SplideTrack className="mb-3">
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
                quality={60}
                className="object-contain h-full max-h-full"
              />
            </SplideSlide>
          );
        })}
      </SplideTrack>
      <ul className="splide__pagination !static mt-6" />
    </Splide>
  );
};

export default Slider;
