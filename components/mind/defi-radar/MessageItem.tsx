import React from "react";
import { MessageContainer } from "./MessageContainer";
import { TextMessageContent } from "./TextMessageContent";
import { ProgressMessageContent } from "./ProgressMessageContent";
import { ReportMessageContent } from "./ReportMessageContent";
import { Message, MessageContentType } from "./types";

interface MessageItemProps {
  message: Message;
  isConsecutive: boolean;
  isTyping?: boolean;
}

/**
 * 消息项组件
 * 根据消息类型选择合适的内容组件
 */
export function MessageItem({
  message,
  isConsecutive,
  isTyping = false,
}: MessageItemProps) {
  // 渲染消息内容
  const renderMessageContent = () => {
    switch (message.contentType) {
      case MessageContentType.TEXT:
        return (
          <TextMessageContent
            message={message}
            isConsecutive={isConsecutive}
            isTyping={isTyping}
          />
        );
      case MessageContentType.PROGRESS:
        return <ProgressMessageContent message={message} />;
      case MessageContentType.REPORT:
        return <ReportMessageContent message={message} />;
      default:
        return null;
    }
  };

  return (
    <MessageContainer
      message={message}
      isConsecutive={isConsecutive}
      id={message.id} // 直接使用消息的UUID作为DOM ID
    >
      {renderMessageContent()}
    </MessageContainer>
  );
}
