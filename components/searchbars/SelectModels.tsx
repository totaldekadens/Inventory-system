import { Dispatch, SetStateAction, useContext } from "react";
import { vehicleContext } from "../context/VehicleProvider";
import { MultiSelect } from "@mantine/core";

interface Props {
  selectedModel: string[];
  setSelectedModel: Dispatch<SetStateAction<string[] | []>>;
  placeholder?: string;
}

const SelectModels = ({
  selectedModel,
  setSelectedModel,
  placeholder,
}: Props) => {
  const { vehicles } = useContext(vehicleContext);

  const values = vehicles
    ? vehicles?.map((model, i) => ({
        value: model._id ? model._id.toString() : `${i}`,
        label: model.name,
      }))
    : [{ value: "1", label: "Fel på server" }];

  return (
    <div className="flex items-center gap-2">
      <MultiSelect
        sx={() => ({
          width: "100%",
        })}
        styles={{
          value: { marginLeft: 10 },
          input: {
            paddingTop: "3.9px",
            paddingBottom: "3.9px",
            paddingLeft: 0,
          },
          searchInput: {
            paddingLeft: 0,
            "::placeholder": {
              color: "#66696e",
              fontSize: "14px",
              paddingLeft: 0,
              "@media (max-width: 500px)": {
                fontSize: "16px",
              },
            },
          },
        }}
        value={selectedModel}
        onChange={setSelectedModel}
        data={values}
        placeholder="Välj fordonsmodell*"
      />
    </div>
  );
};

export default SelectModels;
