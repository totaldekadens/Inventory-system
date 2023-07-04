import { useState, useEffect, Dispatch, SetStateAction, FC } from "react";
import { Image, FileInput, Flex, Text, Box } from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";

type Props = {
  setImageList: Dispatch<SetStateAction<string[]>>;
  value: File[];
  setValue: Dispatch<SetStateAction<File[]>>;
  title?: string;
};

const UploadForm: FC<Props> = ({ setImageList, value, setValue, title }) => {
  const [createObjectURL, setCreateObjectURL] = useState<string[]>([]);

  useEffect(() => {
    const uploadToClient = async () => {
      const imageURLs = value.map((img) => URL.createObjectURL(img));
      setCreateObjectURL(imageURLs);
      const imageList = value.map((img) => img.name);
      setImageList(imageList);
    };
    uploadToClient();
  }, [value]);

  return (
    <Box mt={20} mb={20}>
      <label>{title ? title : "Lägg till bilder:"}</label>{" "}
      <Text size={12} mb={2}>
        Godkända format: png, jpg, jpeg, webp
      </Text>
      <FileInput
        icon={<IconUpload />}
        multiple
        value={value}
        onChange={setValue}
        accept="image/png, image/jpg, image/webp, image/jpeg"
      />
      <Flex
        direction={"row"}
        mt={10}
        sx={{ width: "100%", flexWrap: "wrap" }}
        justify="flex-end"
      >
        {createObjectURL.map((img, index) => {
          return (
            <Flex w={180} key={index}>
              <Image alt={img} src={img} />
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
};

export default UploadForm;
