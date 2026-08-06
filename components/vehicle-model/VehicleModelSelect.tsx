import { Dispatch, SetStateAction, useContext } from "react";
import { vehicleContext } from "../context/VehicleProvider";
import MultiSelectCustom from "../ui/MultiSelectCustom";

interface Props {
  selectedModel: string[];
  setSelectedModel: Dispatch<SetStateAction<string[] | []>>;
}

const VehicleModelSelect = ({ selectedModel, setSelectedModel }: Props) => {
  const { vehicles } = useContext(vehicleContext);

  const values = vehicles
    ? vehicles?.map((model, i) => ({
        value: model._id ? model._id.toString() : `${i}`,
        label: model.name,
      }))
    : [{ value: "1", label: "Fel på server" }];

  return (
    <div className="flex items-center gap-2">
      <MultiSelectCustom
        selectedObjects={selectedModel}
        setSelectedObjects={setSelectedModel}
        options={values}
        placeholder="Välj fordonsmodell"
      />
    </div>
  );
};

export default VehicleModelSelect;
