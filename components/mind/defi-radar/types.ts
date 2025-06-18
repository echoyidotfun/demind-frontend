// 消息类型枚举
export enum MessageContentType {
  TEXT = "text",
  PROGRESS = "progress",
  REPORT = "report",
}

// 基础消息接口
export interface BaseMessage {
  id: string;
  role: "user" | "assistant";
  timestamp: Date;
  contentType: MessageContentType;
}

// 文本消息
export interface TextMessage extends BaseMessage {
  contentType: MessageContentType.TEXT;
  content: string;
}

// 进度提示器消息
export interface ProgressMessage extends BaseMessage {
  contentType: MessageContentType.PROGRESS;
  progressMessage: string;
}

// 分析报告消息
export interface ReportMessage extends BaseMessage {
  contentType: MessageContentType.REPORT;
  reportData: any;
}

// 统一消息类型
export type Message = TextMessage | ProgressMessage | ReportMessage;

// 工作流进度接口
export interface WorkflowProgress {
  type: string;
  timestamp: string;
  stepId: string;
  stepStatus: "start" | "complete" | "failed";
  message: string;
  detail?: any;
  data?: any;
}

// 流状态类型
export type StreamStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "processing"
  | "completed"
  | "error"
  | "aborted";
