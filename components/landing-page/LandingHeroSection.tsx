import { Heading } from "@chakra-ui/react";
import { exoFont } from "@/lib/assets/fonts/exo/exo";
import { Container, HStack, Text, VStack } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { LaunchAppButton } from "./LaunchButtons";
import { TypewriterEffect } from "../common/animations/TypewriterEffect";

// 动画变体
export const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2,
    },
  },
};

export const itemVisibleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function LandingHeroSection() {
  return (
    <Box
      position="relative"
      minH={{ base: "100vh", lg: "100vh" }}
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Container
        maxW="container.xl"
        py={{ base: "10", md: "20" }}
        position="relative"
        zIndex="1"
      >
        <VStack
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          spacing={{ base: "6", md: "8" }}
          align="center"
          textAlign="center"
        >
          <Heading
            as={motion.h1}
            variants={itemVisibleVariants}
            position="relative"
            display="inline-block"
            textAlign="center"
          >
            <Text
              as="div"
              className={exoFont.className}
              bgGradient="linear-gradient(135deg, #F8D458 0%, #6464FA 100%)"
              bgClip="text"
              fontSize={{ base: "2xl", md: "6xl" }}
              fontWeight="medium"
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              whiteSpace="pre"
              flexWrap={{ base: "wrap", md: "nowrap" }}
              width="100%"
            >
              Where Mind Meets{" "}
              <Box as="span" display="inline-flex" alignItems="center">
                <TypewriterEffect
                  words={["Momentum", "Markets", "Yield"]}
                  typingSpeed={100}
                  pauseTime={3000}
                  fontSize={{ base: "2xl", md: "6xl" }}
                  bgGradient="linear-gradient(135deg, #BDA3F9 0%, #6464FA 100%)"
                />
              </Box>
            </Text>
          </Heading>
          <Text
            as={motion.div}
            variants={itemVisibleVariants}
            fontSize={{ base: "lg", md: "xl" }}
            color="font.secondary"
            maxW={{ base: "100%", md: "2xl" }}
            textAlign="center"
          >
            DeMind is your AI companion that enhances trading intents into
            intelligent actions, powered by aggregated liquidity and
            momentum-driven strategies.
          </Text>
          <HStack
            as={motion.div}
            variants={itemVisibleVariants}
            spacing="4"
            pt={{ base: "4", md: "6" }}
            justifyContent="center"
            width="100%"
          >
            <LaunchAppButton />
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}
