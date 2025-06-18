import React from "react";
import { Box, Flex, Avatar, VStack } from "@chakra-ui/react";
import { AgentAvatar } from "./AgentAvatar";
import { Message, MessageContentType } from "./types";

interface MessageContainerProps {
  message: Message;
  isConsecutive: boolean;
  children: React.ReactNode;
  id?: string;
}

/**
 * 统一的消息容器组件
 * 负责消息的布局、头像显示和定位
 */
export function MessageContainer({
  message,
  isConsecutive,
  children,
  id,
}: MessageContainerProps) {
  const isUser = message.role === "user";
  const isReportType = message.contentType === MessageContentType.REPORT;

  return (
    <Flex
      direction="column"
      mb={isConsecutive ? 0 : 4}
      alignItems={isUser ? "flex-end" : "flex-start"}
      width="100%"
      id={id}
    >
      {/* 头像区域 - 只在非连续消息时显示 */}
      {!isConsecutive && (
        <Flex mb={1} width="100%" justify={isUser ? "flex-end" : "flex-start"}>
          {!isUser ? (
            <AgentAvatar />
          ) : (
            <Avatar size="sm" name="User" bg="blue.500" />
          )}
        </Flex>
      )}

      {/* 消息内容区域 - 固定边距 */}
      <Box
        width={isReportType ? "100%" : "auto"}
        maxW={isReportType ? "100%" : "80%"}
        mt={isUser ? -5 : 0}
        ml={isUser ? 0 : "44px"} // 固定左边距，与头像宽度对齐
        mr={isUser ? "44px" : 0} // 固定右边距，与头像宽度对齐
      >
        {children}
      </Box>
    </Flex>
  );
}
