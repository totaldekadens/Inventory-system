import { Dispatch, SetStateAction } from "react";
import { PopulatedArticleDocument } from "../context/ArticleProvider";
import { RadioGroup } from "@headlessui/react";

interface Props {
  article?: PopulatedArticleDocument;
  forSale?: boolean;
  setForSale?: Dispatch<SetStateAction<boolean>>;
}

const ForSaleRadioButton = ({ article, forSale, setForSale }: Props) => {
  const forSaleRadio = [
    { id: "1", title: "Ja", bool: true },
    { id: "2", title: "Nej", bool: false },
  ];
  function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div>
      <h3 className="font-medium text-gray-900">Säljas?</h3>
      <div>
        <RadioGroup value={forSale} onChange={setForSale} className="mt-2">
          <div className="flex items-center space-x-10 space-y-0">
            {forSaleRadio.map((btn) => (
              <div key={btn.id} className="flex ml-3 items-center">
                <RadioGroup.Option
                  id={btn.id}
                  value={btn.bool}
                  defaultChecked={btn.bool === article?.forSale}
                  className={({ active, checked }) =>
                    classNames(
                      active && checked
                        ? "ring ring-offset-1 bg-[#4A7660] ring-[#4A7660]"
                        : "",
                      !active && checked
                        ? "ring-2 ring-[#4A7660] bg-[#4A7660]"
                        : "",
                      "relative -m-0.5 flex ring-1 cursor-pointer items-center justify-center rounded-full p-1.5 focus:outline-none"
                    )
                  }
                />
                <label
                  htmlFor={btn.id}
                  className="ml-3 block text-sm font-medium leading-6 text-gray-900"
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

export default ForSaleRadioButton;
