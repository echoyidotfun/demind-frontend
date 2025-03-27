"use client";

import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Image,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import Link from "next/link";
import { gochihandFont } from "@/lib/assets/fonts/gochihand/gochihand";
import { SocialIcon } from "@/components/common/icons/SocialIcon";

// 动画变体
const containerVariants = {
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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// 特性卡片组件
function FeatureCard({
  title,
  description,
  imageSrc,
}: {
  title: string;
  description: string;
  imageSrc: string;
}) {
  return (
    <Box
      as={motion.div}
      variants={itemVariants}
      p="8"
      borderRadius="xl"
      bg="background.level2"
      borderWidth="1px"
      borderColor="border.base"
      _hover={{
        transform: "translateY(-5px)",
        transition: "transform 0.3s",
        borderColor: "button.background.secondary",
      }}
    >
      <VStack align="start" spacing="4">
        <Box
          p="4"
          borderRadius="lg"
          bg="background.level1"
          w="full"
          h="200px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          overflow="visible"
          position="relative"
        >
          <Image
            src={imageSrc}
            alt={title}
            maxH="250px"
            objectFit="contain"
            filter="brightness(0.65) contrast(1.1) drop-shadow(0 8px 8px rgba(0, 0, 0, 0.3))"
            position="absolute"
            top="-30px"
            _hover={{
              transform: "scale(1.02) translateY(-1px)",
              transition: "all 0.3s ease-out",
              filter:
                "brightness(0.75) contrast(1.1) drop-shadow(0 16px 16px rgba(0, 0, 0, 0.3))",
            }}
          />
        </Box>
        <Heading size="md" color="font.primary">
          {title}
        </Heading>
        <Text color="font.secondary">{description}</Text>
      </VStack>
    </Box>
  );
}

export default function Home() {
  return (
    <Box as="main" minH="100vh">
      {/* Hero Section */}
      <Container maxW="container.xl" pt={{ base: "20", md: "32" }} pb="20">
        <VStack
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          spacing="8"
          align="center"
          textAlign="center"
        >
          <Heading
            as={motion.h1}
            variants={itemVariants}
            bgGradient="linear-gradient(135deg, #F8D458 0%, #6464FA 100%)"
            bgClip="text"
          >
            <Text
              className={gochihandFont.className}
              fontSize={{ base: "4xl", md: "6xl" }}
              color="font.special"
              fontWeight="normal"
            >
              Where Mind Meets Momentum
            </Text>
          </Heading>
          <Text
            as={motion.p}
            variants={itemVariants}
            fontSize={{ base: "lg", md: "xl" }}
            color="font.secondary"
            maxW="2xl"
          >
            DeMind is your AI companion that enhances trading intents into
            intelligent actions, powered by aggregated liquidity and
            momentum-driven strategies.
          </Text>
          <HStack as={motion.div} variants={itemVariants} spacing="4" pt="6">
            <Button
              as={Link}
              href="/swap"
              size="lg"
              rightIcon={<FiArrowRight />}
              _hover={{
                transform: "translateY(-1px) scale(1.05)",
                backgroundSize: "120% 100%",
              }}
              variant="primary"
            >
              Launch App
            </Button>
          </HStack>
        </VStack>
      </Container>

      {/* 平滑过渡区域 */}
      <Box
        position="relative"
        h="40vh"
        mb="-10vh"
        mt="-10vh"
        bgGradient="linear(to-b, transparent, background.baseWithOpacity)"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          transform: "skewY(-6deg)",
        }}
      >
        <Box
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          height="50%"
          bgGradient="linear(to-b, transparent, background.baseWithOpacity)"
          style={{
            transform: "translateY(1px)", // 防止出现缝隙
          }}
        />
      </Box>

      {/* Features Section */}
      <Box
        as="section"
        py="20"
        bg="background.baseWithOpacity"
        position="relative"
        mt="-20vh"
      >
        <Container maxW="container.xl">
          <VStack
            as={motion.div}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            spacing="16"
          >
            <Heading
              textAlign="center"
              bgGradient="linear-gradient(135deg, #F8D458 0%, #6464FA 100%)"
            >
              <Text fontSize={{ base: "3xl", md: "4xl" }} color="font.special">
                Core Features
              </Text>
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing="8" w="full">
              <FeatureCard
                imageSrc="/images/misc/TradingPlatform.png"
                title="Liquidity Aggregator"
                description="Access the best trading routes across multiple DEXs for optimal execution"
              />
              <FeatureCard
                imageSrc="/images/misc/IntentTrading.png"
                title="Intent Trading"
                description="Transform your trading intentions into optimized strategies using advanced AI technology"
              />
              <FeatureCard
                imageSrc="/images/misc/YieldOpt.png"
                title="Momentum Strategies"
                description="Leverage momentum-based strategies for enhanced DeFi yield performance"
              />
            </SimpleGrid>
            <HStack as={motion.div} variants={itemVariants} spacing="4" pt="6">
              <Button
                as={Link}
                href="/swap"
                size="lg"
                rightIcon={<FiArrowRight />}
                _hover={{
                  transform: "translateY(-1px) scale(1.05)",
                  backgroundSize: "120% 100%",
                }}
                variant="primary"
              >
                Launch App
              </Button>
              <Button
                as={Link}
                href="https://github.com/echoyidotfun/demind-contracts"
                size="lg"
                rightIcon={
                  <>
                    <SocialIcon iconType="github" />

                    <FiArrowUpRight />
                  </>
                }
                _hover={{
                  transform: "translateY(-1px) scale(1.05)",
                  backgroundSize: "120% 100%",
                }}
                variant="primary"
              >
                Contribute
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
}
