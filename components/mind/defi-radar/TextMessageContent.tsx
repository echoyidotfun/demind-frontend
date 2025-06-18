import React, { useEffect, useState } from "react";
import { Text, Box, useColorModeValue } from "@chakra-ui/react";
import { TextMessage } from "./types";

interface TextMessageContentProps {
  message: TextMessage;
  isConsecutive: boolean;
  isTyping?: boolean;
}

/**
 * 文本消息内容组件
 * 处理纯文本消息的显示和打字机效果
 */
export function TextMessageContent({
  message,
  isConsecutive,
  isTyping = false,
}: TextMessageContentProps) {
  const isUser = message.role === "user";
  const [displayedContent, setDisplayedContent] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);

  // 使用预设的Chakra配色方案
  const bgColor = useColorModeValue(
    isUser ? "background.special" : "background.baseWithOpacity",
    isUser ? "background.special" : "background.baseWithOpacity"
  );

  const textColor = useColorModeValue(
    isUser ? "white" : "text.primary",
    isUser ? "white" : "text.primaryDark"
  );

  // 打字机效果
  useEffect(() => {
    if (!isTyping) {
      setDisplayedContent(message.content);
      return;
    }

    if (typingIndex < message.content.length) {
      const timeout = setTimeout(() => {
        setDisplayedContent(message.content.substring(0, typingIndex + 1));
        setTypingIndex(typingIndex + 1);
      }, 20);

      return () => clearTimeout(timeout);
    }
  }, [isTyping, message.content, typingIndex]);

  return (
    <Box
      bg={bgColor}
      color={textColor}
      px={4}
      py={2}
      borderRadius="lg"
      borderTopLeftRadius={!isUser && !isConsecutive ? "0" : undefined}
      borderTopRightRadius={isUser && !isConsecutive ? "0" : undefined}
      boxShadow="sm"
    >
      <Text whiteSpace="pre-wrap">
        {isTyping ? displayedContent : message.content}
        {isTyping && typingIndex < message.content.length && (
          <Box as="span" animation="cursor-blink 1s step-end infinite">
            |
          </Box>
        )}
      </Text>
    </Box>
  );
}
