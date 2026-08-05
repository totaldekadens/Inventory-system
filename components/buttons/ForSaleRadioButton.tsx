import { Dispatch, SetStateAction, useEffect, useState } from "react";
import RadioButtons from "./RadioButtons";

interface Props {
  setForSale: Dispatch<SetStateAction<boolean>>;
}

const ForSaleRadioButton = ({ setForSale }: Props) => {
  const forSaleRadio = [
    { value: "yes", label: "Ja" },
    { value: "no", label: "Nej" },
  ];

  const [chosenValue, setChosenValue] = useState("no");

  useEffect(() => {
    if (chosenValue === "no") {
      setForSale(false);
    } else {
      setForSale(true);
    }
  }, [chosenValue]);

  return (
    <div>
      <h3 className="font-bold text-gray-900">Säljas?</h3>
      <div>
        <RadioButtons
          options={forSaleRadio}
          value={chosenValue}
          onChange={setChosenValue}
        />
      </div>
    </div>
  );
};

export default ForSaleRadioButton;
