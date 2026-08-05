import { Dispatch, SetStateAction } from "react";
import RadioButtons from "./RadioButtons";

interface Props {
  id: UpdateMode;
  setId: Dispatch<SetStateAction<UpdateMode>>;
}

export type UpdateMode = "set" | "add" | "remove";

const RadioButtonsQuantity = ({ id, setId }: Props) => {
  const inventoryAdjustmentOptions: {
    value: UpdateMode;
    label: string;
  }[] = [
    { value: "set", label: "Sätt" },
    { value: "add", label: "Lägg till" },
    { value: "remove", label: "Ta bort" },
  ];

  return (
    <div className="flex flex-col sm:flex-row mt-3 mb-3">
      <div>
        <RadioButtons
          options={inventoryAdjustmentOptions}
          value={id}
          onChange={setId}
        />
      </div>
    </div>
  );
};

export default RadioButtonsQuantity;
