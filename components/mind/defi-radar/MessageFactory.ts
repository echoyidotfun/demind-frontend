import { v4 as uuidv4 } from "uuid";
import {
  Message,
  TextMessage,
  ProgressMessage,
  ReportMessage,
  MessageContentType,
} from "./types";

/**
 * 消息工厂类
 * 提供创建各种类型消息的静态方法
 */
export class MessageFactory {
  /**
   * 创建文本消息
   */
  static createTextMessage(
    role: "user" | "assistant",
    content: string
  ): TextMessage {
    return {
      id: uuidv4(),
      role,
      timestamp: new Date(),
      contentType: MessageContentType.TEXT,
      content,
    };
  }

  /**
   * 创建进度消息
   */
  static createProgressMessage(message: string): ProgressMessage {
    return {
      id: uuidv4(),
      role: "assistant",
      timestamp: new Date(),
      contentType: MessageContentType.PROGRESS,
      progressMessage: message,
    };
  }

  /**
   * 创建报告消息
   */
  static createReportMessage(data: any): ReportMessage {
    return {
      id: uuidv4(),
      role: "assistant",
      timestamp: new Date(),
      contentType: MessageContentType.REPORT,
      reportData: data,
    };
  }
}
