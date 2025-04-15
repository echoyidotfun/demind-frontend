"use client";

import { useDailyVolumes, useTopTokens } from "@/hooks/useGraphData";
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Skeleton,
  HStack,
  Card,
  VStack,
} from "@chakra-ui/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Bar,
  ComposedChart,
} from "recharts";
import { formatDate, formatNumber } from "@/lib/utils/formatters";

export function VolumeDashboard() {
  return (
    <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={4}>
      <GridItem>
        <VolumeChart />
      </GridItem>
      <GridItem>
        <TopTokensTable />
      </GridItem>
    </Grid>
  );
}

function VolumeChart() {
  const { data: volumeData, isLoading } = useDailyVolumes(7);

  if (isLoading) {
    return (
      <Box
        p={6}
        bg="background.level2"
        borderRadius="xl"
        borderWidth="1px"
        borderColor="background.level4"
        boxShadow="sm"
        opacity={0.8}
        h="400px"
        transition="all 0.2s"
        _hover={{ shadow: "lg" }}
      >
        <Heading size="md" mb={4}>
          Volume Trend
        </Heading>
        <Skeleton height="330px" />
      </Box>
    );
  }

  // Format date and volumes
  const chartData =
    volumeData
      ?.sort((a, b) => a.date.localeCompare(b.date))
      .map((day) => ({
        date: formatDate(day.date),
        Volume: parseFloat(day.volumeIn),
        Swaps: parseInt(day.swapCount),
      })) || [];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          p={2}
          bg="background.level3"
          border="1px solid"
          borderColor="background.level4"
          borderRadius="md"
          boxShadow="sm"
        >
          <Text fontWeight="bold">{label}</Text>
          {payload.map((entry: any, index: number) => (
            <Text key={`item-${index}`} color={entry.color}>
              {entry.name}: {entry.name === "Volume" ? "$" : ""}
              {formatNumber(entry.value)}
            </Text>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box
      p={6}
      bg="background.level2"
      borderRadius="xl"
      borderWidth="1px"
      borderColor="background.level4"
      boxShadow="sm"
      opacity={0.8}
      transition="all 0.2s"
      _hover={{ shadow: "lg" }}
    >
      <Heading size="md" mb={4}>
        Volume Trend
      </Heading>
      <Box h="330px">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="background.level4" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="Volume"
              fill="#8884d8"
              barSize={30}
              opacity={0.8}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Swaps"
              stroke="#82ca9d"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

function TopTokensTable() {
  const { data: tokens, isLoading } = useTopTokens(5);

  if (isLoading) {
    return (
      <Card
        variant="primary"
        p={6}
        bg="background.level2"
        borderRadius="xl"
        borderWidth="1px"
        borderColor="background.level4"
        boxShadow="sm"
        opacity={0.8}
        transition="all 0.2s"
        _hover={{ shadow: "lg" }}
      >
        <Heading size="md" mb={4}>
          Top Tokens
        </Heading>
        <Skeleton height="330px" />
      </Card>
    );
  }

  return (
    <Box
      p={6}
      bg="background.level2"
      borderRadius="xl"
      borderWidth="1px"
      borderColor="background.level4"
      boxShadow="sm"
      opacity={0.8}
      transition="all 0.2s"
      _hover={{ shadow: "lg" }}
    >
      <Heading size="md" mb={4}>
        Top Tokens
      </Heading>
      <Table variant="simple" borderRadius="lg">
        <Thead bg="background.level2">
          <Tr>
            <Th>Rank</Th>
            <Th>Token</Th>
            <Th isNumeric>Volume</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tokens?.map((token, index) => (
            <Tr key={token.id}>
              <Td fontWeight="bold">{index + 1}</Td>
              <Td>
                <VStack alignItems="flex-start" spacing={0}>
                  <Text fontWeight="medium">{token.symbol || "Unknown"}</Text>
                  <Text color="font.secondary" fontSize="xs">
                    {token.name && token.name.length > 15
                      ? token.name.slice(0, 15) + "..."
                      : token.name}
                  </Text>
                </VStack>
              </Td>
              <Td isNumeric fontWeight="bold">
                $
                {token.volumeUSD
                  ? formatNumber(parseFloat(token.volumeUSD))
                  : "0.00"}
              </Td>
            </Tr>
          ))}
          {(!tokens || tokens.length === 0) && (
            <Tr>
              <Td colSpan={3} textAlign="center">
                No data available
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
}
