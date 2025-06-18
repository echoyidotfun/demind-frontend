import { Box, Flex, Text, Avatar, useColorModeValue } from "@chakra-ui/react";
import { format } from "date-fns";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface UserMessageProps {
  message: Message;
  hideAvatar?: boolean;
  isConsecutive?: boolean;
}

export function UserMessage({
  message,
  hideAvatar = false,
  isConsecutive = false,
}: UserMessageProps) {
  const bgColor = useColorModeValue(
    "background.baseWithOpacity",
    "background.baseWithOpacity"
  );
  const textColor = useColorModeValue("text.primary", "text.primary");
  const timeColor = useColorModeValue("text.secondary", "text.secondary");
  const borderColor = useColorModeValue("border.divider", "border.divider");

  return (
    <Flex justify="flex-end" mb={isConsecutive ? 0.5 : 3}>
      <Box maxW="80%" mr={hideAvatar ? 10 : 2}>
        {!isConsecutive && (
          <Flex mb={1} justify="flex-end">
            <Text fontSize="sm" variant="primary">
              You
            </Text>
          </Flex>
        )}
        <Text
          color={textColor}
          whiteSpace="pre-wrap"
          p={3}
          pt={isConsecutive ? 2 : 3}
          pb={isConsecutive ? 2 : 3}
          bg={bgColor}
          borderRadius="lg"
          borderTopLeftRadius={isConsecutive ? "lg" : "0"}
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow="0 2px 10px rgba(0,0,0,0.05)"
          position="relative"
          mt={isConsecutive ? 1 : 0}
          _after={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            bgGradient: "linear(to-r, purple.300, blue.300)",
          }}
        >
          {message.content}
        </Text>
      </Box>
      {!hideAvatar && <Avatar size="sm" name="User" bg="blue.500" />}
    </Flex>
  );
}
