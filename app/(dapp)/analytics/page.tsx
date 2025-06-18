"use client";

import { StatsBoard } from "@/components/analytics/StatsBoard";
import { VolumeDashboard } from "@/components/analytics/AnalyticsDashboard";
import {
  Box,
  Container,
  Heading,
  Text,
  Flex,
  Image,
  HStack,
  VStack,
} from "@chakra-ui/react";

export default function AnalyticsPage() {
  return (
    <Container maxW="container.xl" py={8}>
      <Box mt={55} mb={10}>
        <Flex
          width="100%"
          justifyContent="space-between"
          alignItems="center"
          mb={6}
        >
          <VStack alignItems="flex-start" spacing={1}>
            <Heading variant="primary" fontSize="5xl">
              DeMind Analytics
            </Heading>
            <Text as="h1" color="font.primary" fontSize="lg">
              Real-time On-chain Analytics
            </Text>
          </VStack>

          <HStack spacing={2} alignItems="center" mt={6}>
            <Text fontSize="sm" color="font.primary">
              powered by
            </Text>
            <Image
              src="/images/icons/theGraphLogoLight.svg"
              alt="The Graph"
              height="24px"
            />
          </HStack>
        </Flex>
      </Box>

      <Box mb={8}>
        <StatsBoard />
      </Box>

      <VolumeDashboard />
    </Container>
  );
}
