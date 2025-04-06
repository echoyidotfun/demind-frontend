import { Box, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TypewriterEffectProps {
  words: string[];
  typingSpeed?: number;
  pauseTime?: number;
  bgGradient?: string;
  fontSize?: any;
}

export const TypewriterEffect = ({
  words,
  typingSpeed = 150,
  pauseTime = 2000,
  bgGradient,
  fontSize,
}: TypewriterEffectProps) => {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const currentWord = words[wordIndex];

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isTyping) {
      if (text.length < currentWord.length) {
        timeout = setTimeout(() => {
          setText(currentWord.slice(0, text.length + 1));
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, pauseTime);
      }
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => {
          setText(text.slice(0, -1));
        }, typingSpeed);
      } else {
        setWordIndex((prev) => (prev + 1) % words.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, isTyping, currentWord, words, typingSpeed, pauseTime]);

  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      position="relative"
    >
      <Text
        as="span"
        bgGradient={bgGradient}
        bgClip="text"
        fontSize={fontSize}
        whiteSpace="pre"
      >
        {text}
      </Text>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{
          display: "inline-block",
          width: "3px",
          height: "1em",
          background: bgGradient
            ? "linear-gradient(135deg, #F8D458 0%, #6464FA 100%)"
            : "currentColor",
          marginLeft: "2px",
        }}
      />
    </Box>
  );
};
