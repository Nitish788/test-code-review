import { Button } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { storage } from "@/app/shared/utils/storage";

export function StartFreshButton() {
  const handleReset = () => {
    storage.clear();
    window.location.reload();
  };

  return (
    <Button
      variant="light"
      color="blue"
      size="sm"
      leftSection={<IconRefresh size={16} aria-hidden="true" />}
      onClick={handleReset}
      title="Start fresh with initial tasks"
      radius="md"
      styles={{
        root: {
          transition: "transform 0.2s ease",
          "&:hover": {
            transform: "scale(1.02)",
          },
        },
      }}
      aria-label="Reset to initial tasks"
    >
      Start Fresh
    </Button>
  );
}
