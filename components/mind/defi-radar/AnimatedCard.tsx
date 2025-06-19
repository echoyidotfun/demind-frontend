import React, { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

/**
 * 动画卡片组件
 * 为卡片内容添加淡入和上移动画效果
 */
export function AnimatedCard({
  children,
  delay = 0,
  duration = 0.5,
}: AnimatedCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  // 淡入动画效果
  const fadeIn = keyframes`
    from { 
      opacity: 0; 
      transform: translateY(15px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  `;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Box
      opacity={isVisible ? 1 : 0}
      animation={
        isVisible ? `${fadeIn} ${duration}s ease-out forwards` : "none"
      }
      height="100%"
      width="100%"
      backdropFilter="blur(8px)"
    >
      {children}
    </Box>
  );
}
