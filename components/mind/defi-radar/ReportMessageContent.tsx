import React, { useState, useEffect } from "react";
import {
  Box,
  useColorModeValue,
  Skeleton,
  SkeletonText,
  Fade,
  SimpleGrid,
} from "@chakra-ui/react";
import { ReportMessage } from "./types";
import { AnalysisReport } from "./AnalysisReport";
import { keyframes } from "@emotion/react";

interface ReportMessageContentProps {
  message: ReportMessage;
}

/**
 * 分析报告消息内容组件
 * 处理分析报告的显示，复用现有的AnalysisResult组件
 */
export function ReportMessageContent({ message }: ReportMessageContentProps) {
  const bgColor = useColorModeValue("background.card", "background.cardDark");

  // 淡入动画效果
  const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  `;

  return (
    <Box
      width="100%"
      maxWidth="100%"
      bg={bgColor}
      borderRadius="lg"
      overflow="hidden"
      boxShadow="none"
    >
      <AnalysisReport result={message.reportData} />
    </Box>
  );
}
