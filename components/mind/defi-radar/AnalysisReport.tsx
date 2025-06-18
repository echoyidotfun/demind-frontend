"use client";

import {
  Box,
  Text,
  Menu,
  Heading,
  SimpleGrid,
  Flex,
  HStack,
  Button,
  Badge,
  MenuButton,
  MenuList,
  MenuItem,
  Wrap,
  WrapItem,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { EnhancedPoolCard } from "./EnhancedPoolCard";
import { MiniPoolCard } from "./MiniPoolCard";
import { EnhancedTokenCard } from "./EnhancedTokenCard";
import { useState, useMemo } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiMaximize,
  FiMinimize,
} from "react-icons/fi";
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";

interface AnalysisReportProps {
  result: {
    analysisReport: any;
    pools: Array<any>;
    protocols: Record<string, any>;
    tokens: Record<string, any>;
    trending?: Array<any>;
  };
}

export function AnalysisReport({ result }: AnalysisReportProps) {
  // 添加安全检查，确保result不为null或undefined
  if (!result) {
    return <Text>No analysis data available.</Text>;
  }

  const {
    analysisReport,
    pools = [],
    protocols = {},
    tokens = {},
    trending = [],
  } = result;

  // 判断是否是热门代币分析模式
  const isTrendingMode = trending && trending.length > 0;

  // 状态管理
  const [sortBy, setSortBy] = useState<string>("apy");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [activeChain, setActiveChain] = useState<string>("");
  const [viewMode, setViewMode] = useState<"standard" | "compact">("standard");
  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(null);
  const [tokenViewMode, setTokenViewMode] = useState<"standard" | "compact">(
    "standard"
  );
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);

  // 获取所有可用的链
  const availableChains = useMemo(() => {
    if (!pools || !Array.isArray(pools)) return [];
    return Array.from(
      new Set(pools.map((pool) => pool?.chain || "").filter(Boolean))
    ).sort();
  }, [pools]);

  // 筛选和排序后的池子
  const filteredPools = useMemo(() => {
    if (!pools || !Array.isArray(pools)) return [];

    let filtered = [...pools].filter(
      (pool) => pool && typeof pool === "object"
    );

    // 应用链过滤
    if (activeChain) {
      filtered = filtered.filter((pool) => pool.chain === activeChain);
    }

    // 应用排序
    filtered.sort((a, b) => {
      let valueA = 0,
        valueB = 0;

      switch (sortBy) {
        case "apy":
          valueA = a.apy ?? 0;
          valueB = b.apy ?? 0;
          break;
        case "tvl":
          valueA = a.tvlUsd ?? 0;
          valueB = b.tvlUsd ?? 0;
          break;
        case "safety":
          valueA = analysisReport?.analyses?.[a.id]?.safetyScore ?? 0;
          valueB = analysisReport?.analyses?.[b.id]?.safetyScore ?? 0;
          break;
        default:
          valueA = a.apy ?? 0;
          valueB = b.apy ?? 0;
      }

      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    });

    return filtered;
  }, [pools, activeChain, sortBy, sortDirection, analysisReport]);

  // 切换排序方向
  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // 处理池子点击
  const handlePoolClick = (poolId: string) => {
    if (viewMode === "compact") {
      setSelectedPoolId(poolId === selectedPoolId ? null : poolId);
    }
  };

  // 卡片布局配置
  const cardLayoutConfig = {
    standard: {
      columns: { base: 1, md: 2, lg: 2 },
      spacing: 4,
      maxWidth: "100%",
    },
    compact: {
      columns: { base: 2, sm: 3, md: 4, lg: 5 },
      spacing: 3,
      maxWidth: "100%",
    },
  };

  // 代币卡片布局配置
  const tokenCardLayoutConfig = {
    standard: {
      columns: { base: 1, md: 2, lg: 3 },
      spacing: 4,
      maxWidth: "100%",
    },
    compact: {
      columns: { base: 2, sm: 3, md: 4, lg: 5 },
      spacing: 3,
      maxWidth: "100%",
    },
  };

  return (
    <Box bg="transparent" border="none" p={4} mt={4} width="100%">
      <Heading size="md" mb={4}>
        {isTrendingMode
          ? "Trending Tokens Analysis"
          : "DeFi Investment Opportunities"}
      </Heading>

      {isTrendingMode ? (
        // 热门代币模式
        <>
          <Flex justify="flex-end" mb={4} width="100%">
            <Tooltip
              label={
                tokenViewMode === "standard"
                  ? "Switch to compact view"
                  : "Switch to standard view"
              }
            >
              <IconButton
                aria-label="Toggle view mode"
                icon={
                  tokenViewMode === "standard" ? <FiMinimize /> : <FiMaximize />
                }
                size="xs"
                variant="ghost"
                onClick={() => {
                  setTokenViewMode(
                    tokenViewMode === "standard" ? "compact" : "standard"
                  );
                }}
              />
            </Tooltip>
          </Flex>
          <Box width="100%">
            <SimpleGrid
              columns={tokenCardLayoutConfig[tokenViewMode].columns}
              spacing={tokenCardLayoutConfig[tokenViewMode].spacing}
              width="100%"
            >
              {trending.map((token: any, index) => (
                <EnhancedTokenCard
                  key={token.cgId}
                  token={tokens[token.cgId] || token}
                  analysisReport={
                    analysisReport?.trendingAnalyses?.[token.cgId]
                  }
                  isCompact={tokenViewMode === "compact"}
                  onClick={
                    tokenViewMode === "compact"
                      ? () =>
                          setSelectedTokenId(
                            token.cgId === selectedTokenId ? null : token.cgId
                          )
                      : undefined
                  }
                  delay={index * 50} // 添加递增延迟
                />
              ))}
            </SimpleGrid>
          </Box>

          {/* 在紧凑视图下，显示选中的代币卡片 */}
          {tokenViewMode === "compact" && selectedTokenId && (
            <Box mt={4} width="100%">
              <EnhancedTokenCard
                token={
                  tokens[selectedTokenId] ||
                  trending.find((t: any) => t.cgId === selectedTokenId)
                }
                analysisReport={
                  analysisReport?.trendingAnalyses?.[selectedTokenId]
                }
                isCompact={false}
                delay={50} // 添加固定延迟
              />
            </Box>
          )}
        </>
      ) : pools && pools.length > 0 ? (
        <Box width="100%">
          {/* 简化的排序和筛选UI */}
          <Flex
            justify="space-between"
            align="center"
            mb={4}
            flexWrap="wrap"
            gap={2}
            width="100%"
          >
            {/* 结果计数和链筛选 */}
            <HStack spacing={2} flexWrap="wrap">
              <Text fontSize="sm" color="gray.500">
                {filteredPools.length} results
              </Text>
              {availableChains.length > 1 && (
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<FiChevronDown />}
                    size="xs"
                    variant="outline"
                  >
                    {activeChain || "All Chains"}
                  </MenuButton>
                  <MenuList zIndex={10}>
                    <MenuItem onClick={() => setActiveChain("")}>
                      All Chains
                    </MenuItem>
                    {availableChains.map((chain) => (
                      <MenuItem
                        key={chain}
                        onClick={() => setActiveChain(chain)}
                      >
                        {chain.charAt(0).toUpperCase() + chain.slice(1)}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              )}
            </HStack>

            {/* 排序和视图控制 */}
            <HStack spacing={2}>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<FiChevronDown />}
                  size="xs"
                  variant="outline"
                >
                  Sort: {sortBy.toUpperCase()}
                </MenuButton>
                <MenuList zIndex={10}>
                  <MenuItem onClick={() => setSortBy("apy")}>APY</MenuItem>
                  <MenuItem onClick={() => setSortBy("tvl")}>TVL</MenuItem>
                  <MenuItem onClick={() => setSortBy("overallScore")}>
                    Overall Score
                  </MenuItem>
                </MenuList>
              </Menu>

              <IconButton
                aria-label="Toggle sort direction"
                icon={
                  sortDirection === "desc" ? (
                    <FaSortAmountDown />
                  ) : (
                    <FaSortAmountUp />
                  )
                }
                size="xs"
                variant="outline"
                onClick={toggleSortDirection}
              />

              <Tooltip
                label={
                  viewMode === "standard"
                    ? "Switch to compact view"
                    : "Switch to standard view"
                }
              >
                <IconButton
                  aria-label="Toggle view mode"
                  icon={
                    viewMode === "standard" ? <FiMinimize /> : <FiMaximize />
                  }
                  size="xs"
                  variant="ghost"
                  onClick={() => {
                    setViewMode(
                      viewMode === "standard" ? "compact" : "standard"
                    );
                  }}
                />
              </Tooltip>
            </HStack>
          </Flex>

          {/* 池子卡片网格 */}
          <Box width="100%">
            <SimpleGrid
              columns={cardLayoutConfig[viewMode].columns}
              spacing={cardLayoutConfig[viewMode].spacing}
              width="100%"
            >
              {filteredPools.map((pool, index) => (
                <Box key={pool.id} width="100%">
                  {viewMode === "standard" ? (
                    <EnhancedPoolCard
                      pool={pool}
                      protocolInfo={protocols[pool.protocol]}
                      tokens={tokens}
                      analysisReport={analysisReport?.analyses?.[pool.id]}
                      delay={index * 50} // 添加递增延迟
                    />
                  ) : (
                    <MiniPoolCard
                      pool={pool}
                      protocolInfo={protocols[pool.protocol]}
                      tokens={tokens}
                      analysisReport={analysisReport?.analyses?.[pool.id]}
                      onClick={() => handlePoolClick(pool.id)}
                      delay={index * 50} // 添加递增延迟
                    />
                  )}
                </Box>
              ))}
            </SimpleGrid>
          </Box>

          {/* 在紧凑视图下，显示选中的池子卡片 */}
          {viewMode === "compact" && selectedPoolId && (
            <Box mt={4} width="100%">
              <EnhancedPoolCard
                pool={filteredPools.find((p) => p.id === selectedPoolId)!}
                protocolInfo={
                  protocols[
                    filteredPools.find((p) => p.id === selectedPoolId)!.protocol
                  ]
                }
                tokens={tokens}
                analysisReport={analysisReport?.analyses?.[selectedPoolId]}
                delay={50} // 添加固定延迟
              />
            </Box>
          )}
        </Box>
      ) : (
        <Text>No investment opportunities found.</Text>
      )}
    </Box>
  );
}
