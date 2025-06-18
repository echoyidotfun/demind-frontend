import { Avatar, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { FaBrain } from "react-icons/fa";

interface AgentAvatarProps {
  mr?: number;
}

export const AgentAvatar = ({ mr = 2 }: AgentAvatarProps) => {
  const textColor = useColorModeValue("primary.600", "primary.300");

  return (
    <Flex alignItems="center" gap={1}>
      <Avatar size="sm" icon={<FaBrain size={20} />} bg="purple.500" mr={1} />
      <Text fontSize="sm" fontWeight="medium" variant="special" mb={4}>
        Mind
      </Text>
    </Flex>
  );
};
