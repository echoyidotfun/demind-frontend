"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Message,
  WorkflowProgress,
  StreamStatus,
  MessageContentType,
  ProgressMessage,
} from "../../components/mind/defi-radar/types";
import { MessageFactory } from "../../components/mind/defi-radar/MessageFactory";

export function useMindStream(useMock = false) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<StreamStatus>("idle");
  const [progress, setProgress] = useState<Record<string, WorkflowProgress>>(
    {}
  );
  const [result, setResult] = useState<any>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const runIdRef = useRef<string | null>(null);
  const connectionEstablishedRef = useRef(false);

  // 跟踪当前进度消息ID - 确保只有一条进度消息
  const progressMessageIdRef = useRef<string | null>(null);

  // 通用事件处理函数
  const handleEvent = useCallback((eventType: string, data: any) => {
    switch (eventType) {
      case "connected":
        runIdRef.current = data.runId;
        setStatus("connected");
        break;
      case "start":
        setStatus("processing");

        // 创建新的进度消息 - 只创建一条
        const progressMessageId = `progress-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        progressMessageIdRef.current = progressMessageId;

        setMessages((prev) => {
          const newMessages = [
            ...prev,
            {
              id: progressMessageId,
              role: "assistant" as const,
              timestamp: new Date(),
              contentType: MessageContentType.PROGRESS,
              progressMessage: "Mind is working...",
            } as ProgressMessage,
          ];
          return newMessages;
        });
        break;
      case "workflowProgress":
        // 更新进度状态
        setProgress((prev) => ({ ...prev, [data.stepId]: data }));

        // 更新现有的进度消息，而不是创建新的
        if (progressMessageIdRef.current) {
          setMessages((prevMessages) => {
            return prevMessages.map((msg) => {
              if (msg.id === progressMessageIdRef.current) {
                return {
                  ...msg,
                  progressMessage: data.detail?.message,
                };
              }
              return msg;
            });
          });
        }
        break;
      case "stepResults":
        // 处理步骤结果（如果需要）
        break;
      case "complete":
        setResult(data.result || null);
        setStatus("completed");

        // 确保移除进度消息（无论是否有结果数据）
        if (progressMessageIdRef.current) {
          const progressIdToRemove = progressMessageIdRef.current;
          progressMessageIdRef.current = null;

          // 使用回调形式确保获取最新的消息列表
          setMessages((prevMessages) => {
            const filteredMessages = prevMessages.filter(
              (msg) => msg.id !== progressIdToRemove
            );
            return filteredMessages;
          });
        }

        // 添加结果消息（如果有分析报告）
        if (data.success && data.result) {
          if (data.result.analysisReport?.response) {
            // 如果有文本响应，添加文本消息
            setMessages((prev) => [
              ...prev,
              MessageFactory.createTextMessage(
                "assistant",
                data.result.analysisReport.response
              ),
            ]);
          } else {
            // 否则添加报告消息
            setMessages((prev) => [
              ...prev,
              MessageFactory.createReportMessage(data.result),
            ]);
          }
        }
        break;
      case "error":
        const errorMessage = data.message || "Connection error";

        // 移除进度消息
        if (progressMessageIdRef.current) {
          setMessages((prevMessages) =>
            prevMessages.filter(
              (msg) => msg.id !== progressMessageIdRef.current
            )
          );
          progressMessageIdRef.current = null;
        }

        setMessages((prev) => [
          ...prev,
          MessageFactory.createTextMessage(
            "assistant",
            `Error: ${errorMessage}`
          ),
        ]);
        setStatus("error");
        break;
      case "aborted":
        // 移除进度消息
        if (progressMessageIdRef.current) {
          setMessages((prevMessages) =>
            prevMessages.filter(
              (msg) => msg.id !== progressMessageIdRef.current
            )
          );
          progressMessageIdRef.current = null;
        }

        setMessages((prev) => [
          ...prev,
          MessageFactory.createTextMessage(
            "assistant",
            `Operation aborted: ${data.message || ""}`
          ),
        ]);
        setStatus("aborted");
        break;
    }
  }, []);

  // 发送用户消息
  const sendMessage = async (content: string) => {
    if (status === "processing" || status === "connecting") {
      console.warn("Cannot send message while processing");
      return;
    }

    // 添加用户消息
    const userMessage = MessageFactory.createTextMessage("user", content);
    setMessages((prev) => [...prev, userMessage]);

    // 重置状态
    setStatus("connecting");
    setProgress({});
    setResult(null);
    connectionEstablishedRef.current = false;

    // 确保没有遗留的进度消息
    if (progressMessageIdRef.current) {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== progressMessageIdRef.current)
      );
      progressMessageIdRef.current = null;
    }

    try {
      // 关闭之前的连接
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      // 创建新的连接
      const eventSource = new EventSource(
        `/api/proxy/agent/stream/defiRadarWorkflow?query=${encodeURIComponent(content)}`
      );
      eventSourceRef.current = eventSource;

      // 设置连接超时
      const connectionTimeout = setTimeout(() => {
        // 只检查连接是否已建立，而不是检查状态
        if (!connectionEstablishedRef.current && eventSourceRef.current) {
          eventSourceRef.current.close();
          handleEvent("error", { message: "Connection timeout" });
        }
      }, 15000); // 15秒超时

      // 连接建立事件
      eventSource.addEventListener("connected", (event: MessageEvent) => {
        connectionEstablishedRef.current = true;
        clearTimeout(connectionTimeout);
        const data = JSON.parse(event.data);
        handleEvent("connected", data);
      });

      // 开始事件
      eventSource.addEventListener("start", (event: MessageEvent) => {
        connectionEstablishedRef.current = true;
        clearTimeout(connectionTimeout);
        const data = JSON.parse(event.data);
        handleEvent("start", data);
      });

      // 工作流进度事件
      eventSource.addEventListener(
        "workflowProgress",
        (event: MessageEvent) => {
          const data = JSON.parse(event.data);
          handleEvent("workflowProgress", data);
        }
      );

      // 步骤结果事件
      eventSource.addEventListener("stepResults", (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        handleEvent("stepResults", data);
      });

      // 完成事件
      eventSource.addEventListener("complete", (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        handleEvent("complete", data);

        // 关闭连接
        eventSource.close();
        eventSourceRef.current = null;
      });

      // 错误事件
      eventSource.addEventListener("error", (event: MessageEvent) => {
        if (event.data) {
          const data = JSON.parse(event.data);
          handleEvent("error", data);
        } else {
          handleEvent("error", { message: "Connection error" });
        }

        // 关闭连接
        eventSource.close();
        eventSourceRef.current = null;
      });

      // 中止事件
      eventSource.addEventListener("aborted", (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        handleEvent("aborted", data);

        // 关闭连接
        eventSource.close();
        eventSourceRef.current = null;
      });

      // 通用错误处理
      eventSource.onerror = () => {
        clearTimeout(connectionTimeout);

        // 确保移除进度消息
        if (progressMessageIdRef.current) {
          setMessages((prevMessages) =>
            prevMessages.filter(
              (msg) => msg.id !== progressMessageIdRef.current
            )
          );
          progressMessageIdRef.current = null;
        }

        handleEvent("error", { message: "EventSource connection error" });

        // 关闭连接
        eventSource.close();
        eventSourceRef.current = null;
      };
    } catch (error) {
      console.error("Error sending message:", error);

      // 确保移除进度消息
      if (progressMessageIdRef.current) {
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== progressMessageIdRef.current)
        );
        progressMessageIdRef.current = null;
      }

      handleEvent("error", {
        message: (error as Error).message || "Unknown error",
      });
    }
  };

  // 中止操作
  const abortOperation = async () => {
    if (status !== "processing" || !runIdRef.current) {
      return;
    }

    try {
      const response = await fetch(
        `/api/proxy/agent/stream/abort/${runIdRef.current}`,
        {
          method: "POST",
        }
      );
      const result = await response.json();

      if (!result.success) {
        console.error("Failed to abort operation:", result.message);
      }
    } catch (error) {
      console.error("Error aborting operation:", error);
    }
  };

  // 清理函数
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return {
    messages,
    status,
    progress,
    result,
    sendMessage,
    abortOperation,
  };
}
