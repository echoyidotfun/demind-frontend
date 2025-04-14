import { gql } from "graphql-request";

// 获取总体统计 (计算而不是直接查询)
export const GET_GLOBAL_STATS = gql`
  query GetGlobalStats {
    swaps(first: 1000) {
      id
      sender
    }
    tokens(first: 1000) {
      id
    }
  }
`;

// 获取最新一天的数据
export const GET_LATEST_DAILY_VOLUME = gql`
  query GetLatestDailyVolume {
    dailyVolumes(first: 1, orderBy: date, orderDirection: desc) {
      id
      date
      volumeIn
      volumeOut
      swapCount
      uniqueUsers
    }
  }
`;

// 获取前N个Token交易量排行
export const GET_TOP_TOKENS = gql`
  query GetTopTokens($limit: Int!) {
    tokens(first: $limit, orderBy: volumeUSD, orderDirection: desc) {
      id
      name
      symbol
      volumeUSD
      address
    }
  }
`;

// 获取指定天数的每日交易量
export const GET_DAILY_VOLUMES = gql`
  query GetDailyVolumes($days: Int!) {
    dailyVolumes(first: $days, orderBy: date, orderDirection: desc) {
      id
      date
      volumeIn
      volumeOut
      swapCount
    }
  }
`;
