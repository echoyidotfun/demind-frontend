"use client";

import { useGlobalStats, useLatestDailyVolume } from "@/hooks/useGraphData";
import { SimpleGrid } from "@chakra-ui/react";
import { FiActivity } from "react-icons/fi";
import { BiTransfer } from "react-icons/bi";
import { FaExchangeAlt, FaUsers } from "react-icons/fa";
import { StatCard } from "./StatCard";
import { formatNumber } from "@/lib/utils/formatters";

// Loading component
function LoadingStats() {
  return (
    <SimpleGrid columns={{ base: 1, md: 4 }} gap={4} w="full">
      <StatCard isLoading={true} />
      <StatCard isLoading={true} />
      <StatCard isLoading={true} />
      <StatCard isLoading={true} />
    </SimpleGrid>
  );
}

// Error component
function ErrorStats() {
  return (
    <SimpleGrid columns={{ base: 1, md: 4 }} gap={4} w="full">
      <StatCard
        title="Error Loading Data"
        value=""
        icon={<BiTransfer size={24} />}
      />
      <StatCard
        title="Try Again Later"
        value=""
        icon={<FaExchangeAlt size={20} />}
      />
      <StatCard title="Contact Support" value="" icon={<FaUsers size={20} />} />
      <StatCard
        title="Or Refresh Page"
        value=""
        icon={<FiActivity size={20} />}
      />
    </SimpleGrid>
  );
}

export function StatsBoard() {
  try {
    const globalStats = useGlobalStats();
    const latestVolume = useLatestDailyVolume();

    if (globalStats.isLoading || latestVolume.isLoading) {
      return <LoadingStats />;
    }

    if (globalStats.error || latestVolume.error) {
      console.error("Stats error:", globalStats.error || latestVolume.error);
      return <ErrorStats />;
    }

    // Calculate total volume
    const totalVolume = latestVolume.data?.volumeIn
      ? parseFloat(latestVolume.data.volumeIn)
      : 0;

    return (
      <SimpleGrid columns={{ base: 1, md: 4 }} gap={4} w="full">
        <StatCard
          title="Total Volume"
          value={`$${formatNumber(totalVolume)}`}
          icon={<FiActivity size={20} />}
        />
        <StatCard
          title="Transactions"
          value={String(globalStats.data?.totalSwaps || 0)}
          icon={<BiTransfer size={24} />}
        />
        <StatCard
          title="Protocols"
          value={String(globalStats.data?.protocolCount || 0)}
          icon={<FaExchangeAlt size={20} />}
        />
        <StatCard
          title="Unique Users"
          value={String(globalStats.data?.uniqueUsers || 0)}
          icon={<FaUsers size={20} />}
        />
      </SimpleGrid>
    );
  } catch (err) {
    console.error("StatsBoard error:", err);
    return <ErrorStats />;
  }
}
