import { useContext, useEffect, useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { articleContext } from "../context/ArticleProvider";

const RadioButtons = () => {
  const { articles, setCurrentArticles } = useContext(articleContext);
  const [id, setId] = useState("1");
  const forSaleRadio = [
    { id: "1", title: "Alla", bool: true },
    { id: "2", title: "Endast till salu", bool: false },
    { id: "3", title: "Endast för eget bruk", bool: false },
  ];

  function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
  }

  // Filter articles
  useEffect(() => {
    const copyOfArticles = [...articles];
    if (id == "1") {
      setCurrentArticles(copyOfArticles);
      return;
    } else if (id == "2") {
      const articlesForSale = copyOfArticles.filter(
        (article) => article.forSale
      );
      setCurrentArticles(articlesForSale);
    } else if (id == "3") {
      const articlesNotForSale = copyOfArticles.filter(
        (article) => !article.forSale
      );
      setCurrentArticles(articlesNotForSale);
    }
  }, [id]);

  return (
    <div className="flex flex-col sm:flex-row justify-center sm:items-center mb-3">
      <h3 className="font-semibold text-sm mb-2 sm:mb-0 text-gray-900 mr-4">
        {" "}
        {/*  */}
        Visa:
      </h3>
      <div>
        <RadioGroup value={id} onChange={setId} className="ml-2">
          <div className="flex items-center space-x-6   sm:space-x-10 sm:space-y-0  flex-wrap">
            {forSaleRadio.map((btn) => (
              <div key={btn.id} className="flex  items-center">
                <RadioGroup.Option
                  id={btn.id}
                  value={btn.id}
                  defaultChecked={btn.bool === true}
                  className={({ active, checked }) =>
                    classNames(
                      active && checked
                        ? "ring ring-offset-1 bg-[#4A7660] ring-[#4A7660]"
                        : "",
                      !active && checked
                        ? "ring-4 sm:ring-2 ring-[#4A7660] bg-[#4A7660]"
                        : "",
                      "relative -m-0.5 flex ring-2 cursor-pointer items-center justify-center rounded-full p-1.5 focus:outline-none"
                    )
                  }
                />
                <label
                  htmlFor={btn.id}
                  className="ml-3 block text-sm font-base leading-6 text-gray-900"
                >
                  {btn.title}
                </label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default RadioButtons;
