import { HoverCard, Button, Text, Group } from "@mantine/core";
import { IconExclamationCircle } from "@tabler/icons-react";

function HoverInfo() {
  return (
    <Group position="center">
      <HoverCard width={330} shadow="md">
        <HoverCard.Target>
          <IconExclamationCircle className="text-gray-300" />
        </HoverCard.Target>
        <HoverCard.Dropdown
          style={{ zIndex: 100, flexWrap: "wrap", width: "100px" }}
        >
          <Text size="sm">Vill du radera? Platsen måste vara tom först.</Text>
        </HoverCard.Dropdown>
      </HoverCard>
    </Group>
  );
}

export default HoverInfo;
