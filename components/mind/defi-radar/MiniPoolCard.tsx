import {
  Box,
  Flex,
  Text,
  Badge,
  Image,
  useColorModeValue,
  HStack,
  VStack,
  Icon,
  Tooltip,
} from "@chakra-ui/react";
import { fNum } from "@/lib/utils/numbers";
import { useMemo } from "react";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { AnimatedCard } from "./AnimatedCard";
import {
  getScoreColor,
  getScoreBackgroundColor,
  getScoreTextColor,
} from "@/lib/utils/scoreColors";

interface MiniPoolCardProps {
  pool: {
    id: string;
    chain: string;
    project: string;
    protocol: string;
    symbol: string;
    tvlUsd: number;
    apyBase?: number;
    apyReward?: number;
    apy: number;
    apyPct1D?: number;
    underlyingTokens?: Array<{
      cgId: string;
      chain: string;
      address: string;
    }>;
  };
  analysisReport?: {
    safetyScore?: number;
    sustainabilityScore?: number;
    overallScore?: number;
  };
  tokens?: Record<string, any>;
  protocolInfo: {
    logo: string;
    name: string;
    description: string;
  };
  onClick?: () => void;
  delay?: number;
}

export function MiniPoolCard({
  pool,
  analysisReport,
  tokens,
  protocolInfo,
  onClick,
  delay = 0,
}: MiniPoolCardProps) {
  const {
    id,
    chain,
    project,
    protocol,
    symbol,
    tvlUsd,
    apyBase,
    apyReward,
    apy,
    apyPct1D,
    underlyingTokens,
  } = pool;

  // 颜色和样式
  const bgColor = useColorModeValue(
    "background.baseWithOpacity",
    "background.baseWithOpacity"
  );
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue(
    "background.level0WithOpacity",
    "background.level0WithOpacity"
  );

  // 格式化APY展示
  const formattedApy = useMemo(() => {
    if (apy === null || apy === undefined) return "N/A";
    return fNum("apr", apy);
  }, [apy]);

  // 格式化TVL
  const formattedTvl = useMemo(() => {
    if (tvlUsd === null || tvlUsd === undefined) return "N/A";
    return fNum("fiat", tvlUsd, { abbreviated: true });
  }, [tvlUsd]);

  // 根据链名显示不同颜色
  const chainColor = useMemo(() => {
    if (!chain) return "gray";
    switch (chain?.toLowerCase()) {
      case "ethereum":
        return "blue";
      case "arbitrum":
        return "blue";
      case "optimism":
        return "red";
      case "polygon":
        return "purple";
      case "bsc":
        return "yellow";
      case "base":
        return "green";
      case "avalanche":
        return "red";
      case "solana":
        return "purple";
      default:
        return "gray";
    }
  }, [chain]);

  // 获取底层代币信息
  const tokensList = useMemo(() => {
    if (!underlyingTokens || !tokens) return [];
    return underlyingTokens.map((token) => tokens[token.cgId]).filter(Boolean);
  }, [underlyingTokens, tokens]);

  // 使用统一的评分颜色函数
  // 已从文件顶部导入getScoreColor, getScoreBackgroundColor, getScoreTextColor

  // 链图标路径
  const chainIconPath = useMemo(() => {
    if (!chain) return "";
    return `/images/chains/${chain.toUpperCase()}.svg`;
  }, [chain]);

  return (
    <AnimatedCard delay={delay}>
      <Box
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        overflow="hidden"
        boxShadow="sm"
        transition="all 0.2s"
        _hover={{ boxShadow: "md", transform: "translateY(-2px)", bg: hoverBg }}
        cursor={onClick ? "pointer" : "default"}
        onClick={onClick}
        p={3}
        height="120px"
        position="relative"
      >
        {/* 对角线背景装饰 */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          zIndex={0}
          overflow="hidden"
          pointerEvents="none"
        >
          {/* 链图标作为背景 - 左下角 */}
          {chain && (
            <Box
              position="absolute"
              left="-20px"
              bottom="-25px"
              opacity="0.2"
              width="100px"
              height="100px"
              zIndex={0}
              overflow="hidden"
            >
              {chainIconPath ? (
                <Image
                  src={chainIconPath}
                  alt={chain}
                  width="100%"
                  height="100%"
                  transform="rotate(7deg)"
                  fallback={
                    <Text fontSize="4xl" opacity="0.3">
                      {chain.charAt(0)}
                    </Text>
                  }
                />
              ) : (
                <Text fontSize="4xl" opacity="0.3">
                  {chain.charAt(0)}
                </Text>
              )}
            </Box>
          )}

          {/* Mind score as background - top right */}
          {analysisReport?.overallScore !== undefined && (
            <Box
              position="absolute"
              right="-10px"
              top="-10px"
              opacity="0.3"
              zIndex={0}
              transform="rotate(7deg)"
            >
              <Text
                fontSize="8xl"
                fontWeight="bold"
                color={getScoreColor(analysisReport.overallScore)}
                lineHeight="0.8"
              >
                {analysisReport.overallScore}
              </Text>
            </Box>
          )}
        </Box>

        <Flex
          direction="column"
          height="100%"
          justify="space-between"
          position="relative"
          zIndex={1}
        >
          {/* 顶部区域 - 池子标识 */}
          <Flex justify="space-between" align="center">
            <HStack spacing={2}>
              {/* 底层代币图标 - 层叠效果 */}
              {tokensList.length > 0 && (
                <HStack spacing="-10px" mr={1}>
                  {tokensList.slice(0, 3).map((token, index) => (
                    <Tooltip key={token.cgId} label={token.symbol}>
                      <Box
                        bgColor="white"
                        borderRadius="full"
                        borderWidth="1px"
                        borderColor={borderColor}
                        zIndex={tokensList.length - index}
                        boxShadow="sm"
                      >
                        <Image
                          src={token.imageUrl}
                          alt={token.symbol}
                          boxSize="20px"
                          borderRadius="full"
                          fallbackSrc="https://via.placeholder.com/20"
                        />
                      </Box>
                    </Tooltip>
                  ))}
                  {tokensList.length > 3 && (
                    <Tooltip label={`${tokensList.length - 3} 更多代币`}>
                      <Badge
                        borderRadius="full"
                        px={1}
                        fontSize="xs"
                        colorScheme="gray"
                        ml="-5px"
                        zIndex={0}
                      >
                        +{tokensList.length - 3}
                      </Badge>
                    </Tooltip>
                  )}
                </HStack>
              )}

              {/* 池子名称 */}
              <Text fontWeight="bold" fontSize="sm" noOfLines={1}>
                {symbol}
              </Text>
            </HStack>
          </Flex>

          {/* 中部 - 项目和协议 */}
          <Flex justify="start" align="left" gap={2}>
            {/* 协议图标 */}
            {protocolInfo?.logo && (
              <Image
                src={protocolInfo.logo}
                alt={protocolInfo.name}
                boxSize="16px"
                borderRadius="full"
                fallbackSrc={`https://via.placeholder.com/16/929292?text=${protocol.charAt(0)}`}
              />
            )}
            <Text fontSize="xs" variant="primary" noOfLines={1}>
              {project}
            </Text>
          </Flex>

          {/* 底部 - 核心指标 */}
          <Flex justify="space-between" align="center" mt={1}>
            {/* APY */}
            <Tooltip label="年化收益率">
              <VStack spacing={0} align="flex-start">
                <Text fontSize="xs" color="gray.500">
                  APY
                </Text>
                <Flex align="center">
                  <Text fontSize="sm" fontWeight="bold" color="green.500">
                    {formattedApy}
                  </Text>
                  {apyPct1D !== null && apyPct1D !== undefined && (
                    <Icon
                      as={apyPct1D >= 0 ? FaArrowTrendUp : FaArrowTrendDown}
                      color={apyPct1D >= 0 ? "green.500" : "red.500"}
                      ml={1}
                      mb={apyPct1D >= 0 ? "2px" : "0px"}
                      mt={apyPct1D >= 0 ? "0px" : "2px"}
                      boxSize="10px"
                    />
                  )}
                </Flex>
              </VStack>
            </Tooltip>

            {/* TVL */}
            <Tooltip label="锁仓价值">
              <VStack spacing={0} align="flex-start">
                <Text fontSize="xs" color="gray.500">
                  TVL
                </Text>
                <Text fontSize="sm" fontWeight="bold">
                  {formattedTvl}
                </Text>
              </VStack>
            </Tooltip>

            {/* 移除了AI评分显示 */}
          </Flex>
        </Flex>
      </Box>
    </AnimatedCard>
  );
}
