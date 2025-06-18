import React from "react";
import { Text, Box, useColorModeValue, Spinner, Flex } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { ProgressMessage } from "./types";

interface ProgressMessageContentProps {
  message: ProgressMessage;
}

/**
 * 进度消息内容组件
 * 处理进度指示器的显示
 */
export function ProgressMessageContent({
  message,
}: ProgressMessageContentProps) {
  // 呼吸灯动画
  const pulseAnimation = keyframes`
    0% { opacity: 0.5; }
    50% { opacity: 1; }
    100% { opacity: 0.5; }
  `;

  // 使用预设的Chakra配色方案
  const bgColor = useColorModeValue(
    "background.baseWithOpacity",
    "background.baseWithOpacity"
  );
  const textColor = useColorModeValue("text.primary", "text.primaryDark");

  return (
    <Box
      bg="transparent"
      color={textColor}
      px={4}
      py={2}
      border="none"
      animation={`${pulseAnimation} 2s infinite ease-in-out`}
      boxShadow="none"
      position="relative"
      minWidth="200px"
      maxWidth="100%"
    >
      <Flex align="center">
        <Box position="relative" pr={6}>
          <Box
            position="absolute"
            left={0}
            top="50%"
            transform="translateY(-50%)"
          >
            <Spinner size="xs" color="background.special" />
          </Box>
          <Text pl={6}>{message.progressMessage}</Text>
        </Box>
      </Flex>
    </Box>
  );
}
