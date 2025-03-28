import { FeatureCard } from "./FeatureCard";
import {
  SimpleGrid,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
} from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { itemVisibleVariants, containerVariants } from "./LandingHeroSection";
import { ContributeButton, LaunchAppButton } from "./LaunchButtons";

export function FeaturesSection() {
  return (
    <Box as="section" py="20" bg="transparent" position="relative" mt="-20vh">
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
              What is DeMind?
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
          <HStack
            as={motion.div}
            variants={itemVisibleVariants}
            spacing="4"
            pt="6"
          >
            <LaunchAppButton />
            <ContributeButton />
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}
