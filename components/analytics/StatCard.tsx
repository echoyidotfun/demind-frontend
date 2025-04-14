import React from "react";
import { Box, Flex, Text, Skeleton } from "@chakra-ui/react";

interface StatCardProps {
  title?: string;
  value?: string;
  icon?: React.ReactElement;
  isLoading?: boolean;
}

export function StatCard({
  title = "",
  value = "",
  icon,
  isLoading = false,
}: StatCardProps) {
  return (
    <Box
      bg="background.level2"
      borderWidth="1px"
      borderColor="background.level4"
      borderRadius="xl"
      p={5}
      opacity={0.8}
      shadow="none"
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Flex flexDirection="column">
          <Skeleton isLoaded={!isLoading} height={isLoading ? "24px" : "auto"}>
            <Text fontSize="lg" fontWeight="medium">
              {title}
            </Text>
          </Skeleton>
          <Skeleton
            isLoaded={!isLoading}
            height={isLoading ? "36px" : "auto"}
            mt={2}
          >
            <Text fontSize="2xl" fontWeight="medium">
              {value}
            </Text>
          </Skeleton>
        </Flex>
        <Skeleton
          isLoaded={!isLoading}
          height={isLoading ? "40px" : "auto"}
          width={isLoading ? "40px" : "auto"}
          borderRadius="full"
        >
          <Box p={2} borderRadius="full" bg="background.special" mt={4}>
            {icon}
          </Box>
        </Skeleton>
      </Flex>
    </Box>
  );
}
