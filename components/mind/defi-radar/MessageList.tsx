"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, VStack, Text, Flex, Badge, Button } from "@chakra-ui/react";
import { format, differenceInMinutes } from "date-fns";
import { MessageItem } from "./MessageItem";
import { AnalysisReport } from "./AnalysisReport";
import {
  Message,
  MessageContentType,
  WorkflowProgress,
  StreamStatus,
  TextMessage,
} from "./types";

interface MessageListProps {
  messages: Message[];
  status: StreamStatus;
  progress: Record<string, WorkflowProgress>;
  result: any;
  onSendMessage?: (content: string) => void;
}

export function MessageList({
  messages,
  result,
  onSendMessage,
}: MessageListProps) {
  const containerMaxWidth = "1200px";
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const lastMessageRef = useRef<Message | null>(null);

  useEffect(() => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];

    // 如果是新的assistant文本消息，且与上一条不同，则应用打字机效果
    if (
      lastMessage.role === "assistant" &&
      lastMessage.contentType === MessageContentType.TEXT &&
      (!lastMessageRef.current || lastMessageRef.current.id !== lastMessage.id)
    ) {
      setTypingMessageId(lastMessage.id);
      setIsTypingComplete(false);

      // 打字机效果完成后更新状态
      setTimeout(
        () => {
          setIsTypingComplete(true);
        },
        // 只对文本消息计算打字时间
        lastMessage.contentType === MessageContentType.TEXT
          ? (lastMessage as TextMessage).content.length * 20 + 500
          : 500
      );
    }

    lastMessageRef.current = lastMessage;
  }, [messages]);

  // 渲染时间标签
  const renderTimeLabel = (timestamp: Date, prevTimestamp?: Date) => {
    // 如果是第一条消息或者与上一条消息相差超过15分钟，则显示时间标签
    if (!prevTimestamp || differenceInMinutes(timestamp, prevTimestamp) >= 15) {
      return (
        <Flex justify="center" my={3}>
          <Text
            fontSize="xs"
            color="text.secondary"
            bg="background.baseWithOpacity"
            px={3}
            py={1}
            borderRadius="lg"
          >
            {format(timestamp, "MM-dd HH:mm")}
          </Text>
        </Flex>
      );
    }
    return null;
  };

  // 处理示例查询点击
  const handleExampleClick = (query: string) => {
    if (onSendMessage) {
      onSendMessage(query);
    }
  };

  // 处理消息渲染，优化连续消息显示
  const renderMessages = () => {
    if (messages.length === 0) {
      return (
        <Flex
          direction="column"
          align="center"
          justify="center"
          py={20}
          opacity={0.8}
          bgGradient="linear(to-br, rgba(129, 99, 199, 0.05), rgba(100, 100, 250, 0.02))"
          borderRadius="lg"
          backdropFilter="blur(8px)"
          borderWidth="1px"
          borderColor="border.base"
        >
          <Text variant="primary" fontSize="xl" fontWeight="semibold" mb={3}>
            Welcome to Mind! I will be your DeFi seeker.
          </Text>
          <Text fontSize="md" mt={2} color="text.secondary">
            You can ask questions about DeFi investment opportunities, such as:
          </Text>
          <Button
            variant="ghost"
            colorScheme="blue"
            size="sm"
            mt={4}
            fontWeight="normal"
            onClick={() =>
              handleExampleClick(
                "Find Ethereum DeFi opportunities with APY over 10%"
              )
            }
          >
            "Find Ethereum DeFi opportunities with APY over 10%"
          </Button>
          <Button
            variant="ghost"
            colorScheme="blue"
            size="sm"
            mt={2}
            fontWeight="normal"
            onClick={() =>
              handleExampleClick(
                "Analyze investment opportunities in trending tokens"
              )
            }
          >
            "Analyze investment opportunities in trending tokens"
          </Button>
        </Flex>
      );
    }

    let messageElements = [];

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      const prevMessage = i > 0 ? messages[i - 1] : null;

      // 检查是否需要显示时间标签
      if (
        i === 0 ||
        differenceInMinutes(message.timestamp, messages[i - 1].timestamp) >= 15
      ) {
        messageElements.push(
          <Box
            key={`time-${message.id}`}
            maxWidth={containerMaxWidth}
            mx="auto"
            width="100%"
          >
            {renderTimeLabel(message.timestamp, prevMessage?.timestamp)}
          </Box>
        );
      }

      // 检查是否是连续的相同发送方消息
      const isConsecutiveSameSender =
        prevMessage && prevMessage.role === message.role;

      messageElements.push(
        <Box
          key={message.id}
          maxWidth={containerMaxWidth}
          mx="auto"
          width="100%"
        >
          <MessageItem
            message={message}
            isConsecutive={isConsecutiveSameSender ?? false}
            isTyping={message.id === typingMessageId && !isTypingComplete}
          />
        </Box>
      );
    }

    return messageElements;
  };

  return (
    <VStack spacing={2} align="stretch">
      {renderMessages()}

      {/* 如果有结果但没有添加到消息列表中，则显示结果 */}
      {result &&
        !messages.some(
          (m) =>
            m.contentType === MessageContentType.REPORT &&
            m.role === "assistant" &&
            (m as any).reportData === result
        ) && (
          <Box maxWidth={containerMaxWidth} mx="auto" width="100%">
            <AnalysisReport result={result} />
          </Box>
        )}
    </VStack>
  );
}
