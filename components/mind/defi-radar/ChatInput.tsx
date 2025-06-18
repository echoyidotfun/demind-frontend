"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Textarea,
  Button,
  Flex,
  Spinner,
  useColorModeValue,
  Icon,
  IconButton,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { FiSend, FiStopCircle } from "react-icons/fi";
import { StreamStatus } from "./types";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onAbort?: () => void;
  isDisabled?: boolean;
  status: StreamStatus;
}

export function ChatInput({
  onSendMessage,
  onAbort,
  isDisabled = false,
  status,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isComposing, setIsComposing] = useState(false);

  // 自动调整文本区域高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // 处理发送消息
  const handleSendMessage = () => {
    if (message.trim() && !isDisabled) {
      onSendMessage(message.trim());
      setMessage("");
      // 重置高度
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // 如果是中文输入法正在输入，不处理任何键盘事件
    if (isComposing) {
      return;
    }

    // 只有在非输入法状态下，才处理Enter键发送消息
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 处理中文输入法事件
  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  // 按钮颜色
  const buttonColorScheme = useColorModeValue("primary", "primary");
  const isProcessing = status === "processing" || status === "connecting";

  return (
    <Box position="relative">
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        placeholder="Talk with Mind..."
        minH="50px"
        maxH="150px"
        resize="none"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="border.base"
        bg="background.base"
        _hover={{ borderColor: "border.hover" }}
        _focus={{ borderColor: "border.focus", boxShadow: "outline" }}
        pr="60px"
        disabled={isDisabled}
      />

      {/* 发送或中止按钮 */}
      <Flex position="absolute" right="8px" bottom="8px">
        {isProcessing && onAbort ? (
          <IconButton
            aria-label="Stop"
            icon={<FiStopCircle />}
            size="sm"
            colorScheme="red"
            variant="ghost"
            onClick={onAbort}
          />
        ) : (
          <Button
            isDisabled={!message.trim() || isDisabled}
            onClick={handleSendMessage}
            colorScheme={buttonColorScheme}
            size="sm"
            borderRadius="md"
            leftIcon={
              isProcessing ? <Spinner size="xs" /> : <Icon as={FiSend} />
            }
          >
            {isProcessing ? "Processing" : "Send"}
          </Button>
        )}
      </Flex>

      {/* 处理状态提示 - 使用绝对定位，不影响输入框宽度 */}
      {isProcessing && (
        <Text
          fontSize="xs"
          variant="special"
          mt={1}
          ml={4}
          position="absolute"
          bottom="5px"
          left={0}
        >
          Mind is thinking, please wait...
        </Text>
      )}
    </Box>
  );
}
