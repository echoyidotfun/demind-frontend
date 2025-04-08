import { useEffect, useRef, useState } from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  Button,
  useTheme,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";
import { motion, useAnimation } from "framer-motion";
import { exoFont } from "@/lib/assets/fonts/exo/exo";
import { ContributeButton } from "./LaunchButtons";
import { LaunchAppButton } from "./LaunchButtons";
import { itemVisibleVariants } from "./LandingHeroSection";

// 与LandingHeroSection一致的动画变体
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

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

type RoadmapFeature = {
  name: string;
  isFinished?: boolean;
};

type RoadmapData = {
  time: string;
  features: RoadmapFeature[];
};

const roadmapData: RoadmapData[] = [
  {
    time: "Q1 2025",
    features: [
      { name: "Launch on Sonic mainnet", isFinished: true },
      { name: "Finish UI/UX design", isFinished: true },
      { name: "Aggregate 5+ AMM protocols", isFinished: true },
    ],
  },
  {
    time: "Q2 2025",
    features: [
      { name: "Upgrade token API", isFinished: false },
      { name: "Support user-imported tokens", isFinished: false },
      { name: "Ingregate subgraph", isFinished: false },
      { name: "Order route visualization", isFinished: false },
      { name: "Agentic trading", isFinished: false },
    ],
  },
  {
    time: "Q3 2025",
    features: [
      { name: "Support new EVM chians", isFinished: false },
      { name: "Support cross-chain swap", isFinished: false },
      { name: "Agentic portfolio management", isFinished: false },
    ],
  },
  {
    time: "Q4 2025",
    features: [
      { name: "Support new non-EVM chains", isFinished: false },
      { name: "AI-based yield optimization", isFinished: false },
    ],
  },
];

export function RoadmapSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const theme = useTheme();
  const primaryColor = useColorModeValue(
    theme.colors.purple[500],
    theme.colors.purple[400]
  );
  const controls = useAnimation();

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const { top, bottom, height } =
        sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // 当section在视口中时
      if (top < viewportHeight && bottom > 0) {
        controls.start("visible");

        // 进度条计算方式：section滚动了多少比例
        let progressValue = 0;
        // 计算基于section已经滚过的部分占总高度的比例
        if (top <= 0) {
          progressValue = Math.min(
            Math.abs(top) / (height - viewportHeight),
            1
          );
        }

        setProgress(progressValue);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // 初始检查
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [controls]);

  return (
    <Box
      ref={sectionRef}
      position="relative"
      width="100%"
      bg="bg.primary"
      minH="100vh"
    >
      <Container maxW="container.xl" position="relative">
        <Flex direction={{ base: "column", lg: "row" }}>
          {/* roadmap title and progress bar */}
          <Flex
            position={{ base: "relative", lg: "sticky" }}
            top="50px"
            width={{ base: "100%", lg: "68%" }}
            direction={{ base: "column", lg: "row" }}
            height={{ base: "auto", lg: "80vh" }}
            mb={{ base: 10, lg: 0 }}
            zIndex="10"
          >
            {/* roadmap title */}
            <MotionBox
              flex={{ lg: "0.8" }}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              variants={containerVariants}
              initial="hidden"
              animate={controls}
              pr={{ lg: "8" }}
            >
              <MotionHeading
                as="h2"
                variants={itemVariants}
                className={exoFont.className}
                bgGradient="linear-gradient(135deg,  #F8D458 0%, #6464FA 100%)"
                bgClip="text"
                fontSize={{ base: "4xl", md: "5xl" }}
                fontWeight="medium"
                mb="6"
              >
                DeMind roadmap
              </MotionHeading>

              <MotionText
                variants={itemVariants}
                fontSize={{ base: "md", md: "lg" }}
                color="font.secondary"
                mb="8"
              >
                View our vision on DeFi future
              </MotionText>

              <Button
                as={motion.button}
                variants={itemVariants}
                alignSelf="flex-start"
                borderWidth="1px"
                borderColor="whiteAlpha.300"
                bg="transparent"
                _hover={{
                  borderColor: primaryColor,
                  bg: "rgba(100, 100, 250, 0.1)",
                }}
                px="6"
              >
                view Docs
              </Button>
            </MotionBox>
            {/* progress bar*/}
            <Flex
              position="relative"
              width="3px"
              height="90%"
              ml={{ lg: "10" }}
              mt={{ base: "10", lg: "0" }}
              alignItems="center"
              justifyContent="center"
            >
              <Box
                position="absolute"
                width="100%"
                height="100%" // 控制进度条总长度，可以调整
                top="50%"
                transform="translateY(-50%)" // 使进度条垂直居中
              >
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  width="100%"
                  height={`${progress * 100}%`}
                  bgGradient="linear-gradient(to bottom, #6464FA, #F8D458 150%)"
                  transition="height 0.3s ease"
                />
              </Box>
            </Flex>
          </Flex>

          {/* features timeline */}
          <Box
            width={{ base: "100%", lg: "45%" }}
            pl={{ lg: "8" }}
            mt={{ base: "10", lg: "80px" }}
            position="relative"
          >
            <VStack spacing="20" align="stretch" py="8">
              {roadmapData.map((phase, index) => (
                <MotionFlex
                  key={index}
                  variants={itemVariants}
                  align="flex-start"
                  initial="hidden"
                  animate={controls}
                >
                  <Box flex="1">
                    <HStack>
                      <Heading
                        fontSize={{ base: "xl", md: "2xl" }}
                        color={primaryColor}
                        mb="8"
                      >
                        {phase.time}
                      </Heading>
                    </HStack>

                    <VStack align="start" spacing="3">
                      {phase.features.map((feature, fIndex) => (
                        <Text
                          key={fIndex}
                          fontSize={{ base: "sm", md: "md" }}
                          opacity={feature.isFinished ? 0.6 : 1}
                          mb="4"
                        >
                          {feature.name}
                        </Text>
                      ))}
                    </VStack>
                  </Box>
                </MotionFlex>
              ))}
            </VStack>
          </Box>
        </Flex>
      </Container>
      <HStack
        as={motion.div}
        variants={itemVisibleVariants}
        spacing="4"
        pt="20"
        pb="10"
        justifyContent="center"
      >
        <LaunchAppButton />
        <ContributeButton />
      </HStack>
    </Box>
  );
}
