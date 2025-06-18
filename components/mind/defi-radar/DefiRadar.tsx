"use client";

import React, { useRef, useState, useEffect } from "react";
import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { MessageList } from "./MessageList";
import { useMindStream } from "@/hooks/mind/useMindStream";
import { ChatInput } from "./ChatInput";

export function DefiRadar() {
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageCountRef = useRef<number>(0);
  const userSentMessageRef = useRef<boolean>(false);
  // 最新消息ID引用
  const latestMessageIdRef = useRef<string | null>(null);
  // 添加一个标记，防止滚动冲突
  const isScrollingRef = useRef<boolean>(false);
  // 添加上次滚动时间引用，用于防抖
  const lastScrollTimeRef = useRef<number>(0);

  const { messages, status, progress, result, sendMessage, abortOperation } =
    useMindStream(false); // 关闭模拟数据模式，使用真实API

  // 只在特定条件下滚动到底部
  useEffect(() => {
    if (messages.length === 0) return;

    // 检查是否有新的完整消息（非进度消息）
    const hasNewCompleteMessage = messages.length > lastMessageCountRef.current;

    // 获取最新消息ID
    const latestMessage = messages[messages.length - 1];
    latestMessageIdRef.current = latestMessage.id;

    // 如果用户刚发送了消息，或者有新的完整消息且用户当前在底部，则滚动到底部
    if (
      userSentMessageRef.current ||
      (hasNewCompleteMessage && shouldScrollToBottom)
    ) {
      // 延迟滚动以确保DOM已更新
      const scrollDelay = userSentMessageRef.current ? 100 : 300;

      // 防止滚动冲突，检查上次滚动时间
      const now = Date.now();
      if (now - lastScrollTimeRef.current < 500) {
        // 如果距离上次滚动不足500ms，则跳过本次滚动
        userSentMessageRef.current = false;
        return;
      }

      setTimeout(() => {
        if (!isScrollingRef.current) {
          isScrollingRef.current = true;
          lastScrollTimeRef.current = Date.now();
          scrollToLatestMessage();
          userSentMessageRef.current = false;
          // 滚动完成后重置标记
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 500);
        }
      }, scrollDelay);
    }

    // 更新消息计数引用
    lastMessageCountRef.current = messages.length;
  }, [messages, shouldScrollToBottom]);

  // 当结果更新时，如果用户当前在底部，则滚动到底部
  useEffect(() => {
    if (result && shouldScrollToBottom) {
      // 防止滚动冲突
      const now = Date.now();
      if (now - lastScrollTimeRef.current < 500 || isScrollingRef.current) {
        return;
      }

      // 为结果渲染留出更多时间，确保DOM完全更新后再滚动
      setTimeout(() => {
        if (!isScrollingRef.current) {
          isScrollingRef.current = true;
          lastScrollTimeRef.current = Date.now();
          scrollToLatestMessage();
          // 滚动完成后重置标记
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 500);
        }
      }, 500);
    }
  }, [result, shouldScrollToBottom]);

  const bgColor = useColorModeValue("transparent", "transparent");
  const inputBgColor = useColorModeValue(
    "background.gradient",
    "background.gradient"
  );

  // 滚动到最新消息
  const scrollToLatestMessage = () => {
    if (
      !chatContainerRef.current ||
      !latestMessageIdRef.current ||
      isScrollingRef.current
    )
      return;

    // 尝试查找最新消息元素 - 直接使用消息的UUID
    const messageElement = document.getElementById(latestMessageIdRef.current);

    if (messageElement) {
      // 使用平滑滚动效果滚动到消息元素
      messageElement.scrollIntoView({
        behavior: "smooth",
        block: "start", // 将消息顶部对齐可视区域顶部
        inline: "nearest",
      });
    } else {
      console.log(`未找到消息元素: ${latestMessageIdRef.current}`);
      // 如果找不到消息元素，则回退到滚动到底部
      scrollToBottom();
    }
  };

  // 滚动到底部 - 使用平滑滚动效果
  const scrollToBottom = () => {
    if (chatContainerRef.current && !isScrollingRef.current) {
      // 创建一个不可见的元素作为滚动目标
      const scrollTarget = document.createElement("div");
      scrollTarget.style.height = "1px";
      scrollTarget.style.width = "1px";
      scrollTarget.style.opacity = "0";
      scrollTarget.id = "scroll-target-" + Date.now();

      // 将元素添加到容器底部
      chatContainerRef.current.appendChild(scrollTarget);

      // 使用平滑滚动效果
      scrollTarget.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });

      // 滚动完成后移除临时元素
      setTimeout(() => {
        if (chatContainerRef.current?.contains(scrollTarget)) {
          chatContainerRef.current.removeChild(scrollTarget);
        }
      }, 1000);
    }
  };

  // 处理滚动事件 - 使用防抖和更合理的底部检测
  const handleScroll = () => {
    // 如果正在程序性滚动，则不处理手动滚动事件
    if (isScrollingRef.current) return;

    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;

      // 使用更大的阈值（30像素）来判断是否在底部，提供更好的用户体验
      const isScrolledToBottom = scrollHeight - scrollTop - clientHeight < 30;

      // 只在状态真正变化时才更新状态
      if (isScrolledToBottom !== shouldScrollToBottom) {
        setShouldScrollToBottom(isScrolledToBottom);
      }
    }
  };

  // 包装发送消息函数，添加滚动标记
  const handleSendMessage = (content: string) => {
    userSentMessageRef.current = true;
    sendMessage(content);
  };

  return (
    <Flex direction="column" height="100%" position="relative" bg={bgColor}>
      {/* 消息列表区域 - 可滚动，留出底部输入框的空间 */}
      <Box
        ref={chatContainerRef}
        flex="1"
        overflowY="auto"
        p={4}
        pb="140px" // 为底部输入框留出空间
        onScroll={handleScroll}
      >
        <MessageList
          messages={messages}
          status={status}
          progress={progress}
          result={result}
          onSendMessage={handleSendMessage}
        />
      </Box>

      {/* 输入区域 - 绝对定位在底部 */}
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        borderTopWidth="1px"
        borderColor="border.subduedZen"
        bg={inputBgColor}
        backdropFilter="blur(10px)"
        zIndex={10}
        boxShadow="0 -4px 12px rgba(0, 0, 0, 0.05)"
      >
        <Box p={4} maxWidth="1200px" mx="auto">
          <ChatInput
            onSendMessage={handleSendMessage}
            isDisabled={status === "processing" || status === "connecting"}
            onAbort={abortOperation}
            status={status}
          />
        </Box>
      </Box>
    </Flex>
  );
}
