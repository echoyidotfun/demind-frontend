import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { AgentAvatar } from "./AgentAvatar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AgentMessageProps {
  message: Message;
  hideAvatar?: boolean;
  isConsecutive?: boolean;
  isTyping?: boolean;
}

export function AgentMessage({
  message,
  hideAvatar = false,
  isConsecutive = false,
  isTyping = false,
}: AgentMessageProps) {
  const bgColor = useColorModeValue(
    "background.baseWithOpacity",
    "background.baseWithOpacity"
  );
  const textColor = useColorModeValue("text.primary", "text.primary");
  const borderColor = useColorModeValue("border.base", "border.base");

  // 打字机效果状态
  const [displayText, setDisplayText] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const contentRef = useRef(message.content);

  // 确保在组件卸载时清除定时器
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // 当消息内容变化时更新引用
  useEffect(() => {
    contentRef.current = message.content;
  }, [message.content]);

  // 当isTyping变为true时，开始打字机效果
  useEffect(() => {
    // 如果不是打字状态，直接显示完整文本
    if (!isTyping) {
      setDisplayText(message.content);
      return;
    }

    // 重置打字效果
    setDisplayText("");
    let currentIndex = 0;

    // 清除可能存在的旧定时器
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // 创建新的定时器
    intervalRef.current = setInterval(() => {
      if (currentIndex < contentRef.current.length) {
        setDisplayText(
          (prev) => prev + contentRef.current.charAt(currentIndex)
        );
        currentIndex++;
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, 20); // 打字速度

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isTyping, message.id]); // 添加message.id作为依赖，确保消息变化时重新开始打字效果

  // 如果消息内容为空，不渲染任何内容
  if (!message.content && !isTyping) {
    return null;
  }

  return (
    <Flex mb={isConsecutive ? 0 : 4} alignItems="flex-start">
      {!hideAvatar && <AgentAvatar />}
      <Box ml={2} mt={1} maxW="80%">
        <Text
          color={textColor}
          whiteSpace="pre-wrap"
          p={3}
          bg={bgColor}
          borderRadius="lg"
          borderTopLeftRadius={isConsecutive ? "lg" : "0"}
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow="0 2px 10px rgba(0,0,0,0.05)"
          position="relative"
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
          {displayText}
          {isTyping && intervalRef.current && (
            <span className="typing-cursor">|</span>
          )}
        </Text>
      </Box>
    </Flex>
  );
}
