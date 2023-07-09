import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { PopulatedArticleDocument } from "./context/ArticleProvider";
import Image from "next/image";
import { RefObject, useEffect, useRef, useState } from "react";

interface Props {
  article: PopulatedArticleDocument;
}
const Slider = ({ article }: Props) => {
  return (
    <Splide aria-label="My Favorite Images">
      {article.images.map((image, i) => {
        const path = `https://res.cloudinary.com/dkzh2lxon/image/upload/v1688383484/inventory/${image}`;
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
              quality="85"
              className="object-contain h-full max-h-full"
            />
          </SplideSlide>
        );
      })}
    </Splide>
  );
};

export default Slider;
