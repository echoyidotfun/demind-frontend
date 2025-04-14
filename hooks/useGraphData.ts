import { useQuery } from "@tanstack/react-query";
import {
  GET_GLOBAL_STATS,
  GET_TOP_TOKENS,
  GET_DAILY_VOLUMES,
  GET_LATEST_DAILY_VOLUME,
} from "@/lib/services/api/graph-queries";
import { graphqlClient } from "@/lib/services/graphql/client";

// 定义类型
interface Swap {
  id: string;
  sender: string;
}

interface Token {
  id: string;
  name?: string;
  symbol?: string;
  volumeUSD?: string;
  address?: string;
}

interface DailyVolume {
  id: string;
  date: string;
  volumeIn: string;
  volumeOut: string;
  swapCount: string;
  uniqueUsers?: string[];
}

interface GlobalStatsResponse {
  swaps: Swap[];
  tokens: Token[];
}

interface DailyVolumeResponse {
  dailyVolumes: DailyVolume[];
}

interface TopTokensResponse {
  tokens: Token[];
}

// 计算全局统计信息
export function useGlobalStats() {
  return useQuery({
    queryKey: ["globalStats"],
    queryFn: async () => {
      try {
        const data =
          await graphqlClient.request<GlobalStatsResponse>(GET_GLOBAL_STATS);

        const uniqueUsers = [...new Set(data.swaps.map((swap) => swap.sender))];
        const protocolCount = 4;
        const totalSwaps = data.swaps.length;

        return {
          uniqueUsers: uniqueUsers.length,
          protocolCount,
          totalSwaps,
        };
      } catch (error) {
        throw error;
      }
    },
  });
}

// 获取最新一天的交易数据
export function useLatestDailyVolume() {
  return useQuery({
    queryKey: ["latestDailyVolume"],
    queryFn: async () => {
      try {
        const data = await graphqlClient.request<DailyVolumeResponse>(
          GET_LATEST_DAILY_VOLUME
        );
        return (
          data.dailyVolumes[0] || {
            volumeIn: "0",
            volumeOut: "0",
            swapCount: "0",
          }
        );
      } catch (error) {
        throw error;
      }
    },
  });
}

// 获取Top Token数据
export function useTopTokens(limit = 5) {
  return useQuery({
    queryKey: ["topTokens", limit],
    queryFn: async () => {
      try {
        const data = await graphqlClient.request<TopTokensResponse>(
          GET_TOP_TOKENS,
          { limit }
        );
        return data.tokens;
      } catch (error) {
        throw error;
      }
    },
  });
}

// 获取历史每日交易量
export function useDailyVolumes(days = 7) {
  return useQuery({
    queryKey: ["dailyVolumes", days],
    queryFn: async () => {
      try {
        const data = await graphqlClient.request<DailyVolumeResponse>(
          GET_DAILY_VOLUMES,
          { days }
        );
        return data.dailyVolumes.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      } catch (error) {
        throw error;
      }
    },
  });
}
