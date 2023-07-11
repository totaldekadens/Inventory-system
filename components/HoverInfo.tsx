import { HoverCard, Button, Text, Group } from "@mantine/core";
import { IconExclamationCircle } from "@tabler/icons-react";

interface Props {
  text: string;
  width: number;
}

function HoverInfo({ text, width }: Props) {
  return (
    <Group noWrap={false} position="center">
      <HoverCard width={width} shadow="md">
        <HoverCard.Target>
          <IconExclamationCircle className="text-gray-300" />
        </HoverCard.Target>
        <HoverCard.Dropdown style={{ zIndex: 100 }}>
          <Text size="sm">{text}</Text>
        </HoverCard.Dropdown>
      </HoverCard>
    </Group>
  );
}

export default HoverInfo;
