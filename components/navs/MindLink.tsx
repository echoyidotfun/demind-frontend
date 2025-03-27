import { Badge, BoxProps, HStack, Text } from "@chakra-ui/react";

export function MindLink({ ...props }: BoxProps) {
  const { children, ...rest } = props;
  return (
    <HStack as="div" spacing={1} cursor="default" opacity={0.8} {...rest}>
      <Text color="font.primary">Mind</Text>
      <Badge
        fontSize="2xs"
        colorScheme="purple"
        variant="subtle"
        borderRadius="sm"
        // marginBottom={1}
        bg="rgba(161, 124, 247, 0.2)"
        color="text.secondary"
        textTransform="capitalize"
      >
        <Text fontSize="xxs" variant="special">
          building
        </Text>
      </Badge>
    </HStack>
  );
}
