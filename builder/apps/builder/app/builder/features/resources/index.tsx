import { Flex, Text, theme } from "@webstudio-is/design-system";
import type { Publish } from "~/shared/pubsub";

type ResourcesPanelProps = {
  publish: Publish;
  onClose: () => void;
};

export const ResourcesPanel = ({ publish, onClose }: ResourcesPanelProps) => {
  return (
    <Flex
      direction="column"
      css={{
        padding: theme.panel.paddingInline,
        height: "100%",
        gap: theme.spacing[5],
      }}
    >
      <Text as="div" variant="titles">
        Resources
      </Text>
      <Text variant="descriptions">
        Connect to external REST APIs and data sources to power your website.
      </Text>
      <Flex
        direction="column"
        css={{
          gap: theme.spacing[3],
          padding: theme.spacing[3],
          backgroundColor: theme.colors.surfaceNeutralHover,
          borderRadius: theme.borderRadius[1],
        }}
      >
        <Text variant="labelsSemibold">Available Resources</Text>
        <Text variant="descriptions" css={{ fontSize: "12px" }}>
          No resources configured yet. Add a REST API connection to get started.
        </Text>
      </Flex>
    </Flex>
  );
};
