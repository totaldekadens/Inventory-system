import { Dispatch, SetStateAction } from "react";
import { MultiSelect } from "@mantine/core";

interface Props {
  selectedObjects: string[];
  setSelectedObjects: Dispatch<SetStateAction<string[] | []>>;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const MultiSelectCustom = ({
  selectedObjects,
  setSelectedObjects,
  options,
  placeholder = "Välj alternativ",
}: Props) => {
  return (
    <MultiSelect
      sx={() => ({
        width: "100%",
      })}
      styles={{
        value: { marginLeft: 10 },
        input: {
          paddingTop: "8px",
          paddingBottom: "8px",
          paddingLeft: 0,
          borderRadius: "6px",
          ":focus-visible": {
            border: "0px",
          },
        },
        searchInput: {
          paddingLeft: 0,
          "::placeholder": {
            color: "#66696e",
            fontSize: "16px",
            paddingLeft: 0,
            "@media (max-width: 500px)": {
              fontSize: "16px",
            },
          },
        },
      }}
      value={selectedObjects}
      onChange={setSelectedObjects}
      data={options}
      placeholder={placeholder}
    />
  );
};

export default MultiSelectCustom;
