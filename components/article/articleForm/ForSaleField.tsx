import RadioButtons from "@/components/ui/RadioButtons";
import { Dispatch, SetStateAction } from "react";

interface Props {
  forSale: boolean;
  setForSale: Dispatch<SetStateAction<boolean>>;
}

const ForSaleField = ({ forSale, setForSale }: Props) => {
  const forSaleRadio = [
    { value: "yes", label: "Ja" },
    { value: "no", label: "Nej" },
  ];

  return (
    <div>
      <h3 className="font-bold text-gray-900">Säljas?</h3>

      <RadioButtons
        options={forSaleRadio}
        value={forSale ? "yes" : "no"}
        onChange={(value) => {
          setForSale(value === "yes");
        }}
      />
    </div>
  );
};

export default ForSaleField;
