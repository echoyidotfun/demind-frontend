import {
  Box,
  Flex,
  Text,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  Image,
  useColorModeValue,
  Tooltip,
  Divider,
  Link,
  HStack,
  VStack,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  IconButton,
  Tag,
  Wrap,
  WrapItem,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { fNum } from "@/lib/utils/numbers";
import {
  FiExternalLink,
  FiTwitter,
  FiGithub,
  FiAlertTriangle,
} from "react-icons/fi";
import { FaTelegramPlane } from "react-icons/fa";
import { BsStars, BsShield, BsGraphUp } from "react-icons/bs";
import { RiRobot3Line } from "react-icons/ri";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { AnimatedCard } from "./AnimatedCard";
import {
  getScoreColor,
  getScoreBackgroundColor,
  getScoreTextColor,
} from "@/lib/utils/scoreColors";

interface EnhancedPoolCardProps {
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
    apyPct7D?: number;
    stablecoin: boolean;
    ilRisk: string;
    volume1D?: number;
    underlyingTokens?: Array<{
      cgId: string;
      chain: string;
      address: string;
    }>;
    exposure: string;
  };
  analysisReport?: {
    safetyScore?: number;
    sustainabilityScore?: number;
    overallScore?: number;
    report?: {
      overview?: string;
      tokenAnalysis?: string;
      yieldAndLiquidity?: string;
      riskWarnings?: string;
    };
  };
  tokens?: Record<string, any>;
  protocolInfo?: any;
  delay?: number;
}

export function EnhancedPoolCard({
  pool,
  analysisReport,
  tokens,
  protocolInfo,
  delay = 0,
}: EnhancedPoolCardProps) {
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
    apyPct7D,
    stablecoin,
    ilRisk,
    volume1D,
    underlyingTokens,
    exposure,
  } = pool;

  const [activeTab, setActiveTab] = useState(0);

  const borderColor = useColorModeValue("border.base", "border.base");
  const titleColor = useColorModeValue("text.primary", "text.primary");
  const subtitleColor = useColorModeValue("text.secondary", "text.secondary");
  const tabBg = useColorModeValue(
    "background.transparent",
    "background.transparent"
  );
  const activeTabBg = useColorModeValue(
    "background.baseWithOpacity",
    "background.baseWithOpacity"
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

  // 格式化交易量
  const formattedVolume = useMemo(() => {
    if (volume1D === null || volume1D === undefined) return "N/A";
    return fNum("fiat", volume1D, { abbreviated: true });
  }, [volume1D]);

  // 根据无常损失风险显示不同颜色
  const ilRiskColor = useMemo(() => {
    if (!ilRisk) return "gray";
    return ilRisk?.toLowerCase() === "yes" ? "red" : "green";
  }, [ilRisk]);

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

  // 链图标路径
  const chainIconPath = useMemo(() => {
    if (!chain) return "";
    return `/images/chains/${chain.toUpperCase()}.svg`;
  }, [chain]);

  return (
    <AnimatedCard delay={delay}>
      <Box
        // bg="background.gradient"
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        overflow="hidden"
        boxShadow="sm"
        transition="all 0.3s"
        _hover={{
          boxShadow: "lg",
          transform: "translateY(-2px)",
          borderColor: "border.divider",
        }}
        position="relative"
        height="350px"
        width="100%"
        // backgroundColor="rgba(255, 255, 255, 0.25)"
        // backdropFilter="blur(8px)"
      >
        <Tabs
          variant="enclosed"
          colorScheme="purple"
          size="sm"
          isFitted
          index={activeTab}
          onChange={setActiveTab}
          position="relative"
          zIndex={1}
          height="100%"
          display="flex"
          flexDirection="column"
        >
          <TabList px={4} pt={4} mb="0" border="none" gap="1px">
            <Tab
              _selected={{
                bg: activeTabBg,
                fontWeight: "semibold",
                color: "text.primary",
                border: "none",
                borderBottomRadius: "0",
                borderTopRadius: "md",
                zIndex: "2",
              }}
              _hover={{
                color: "text.linkHover",
              }}
              fontWeight="medium"
              color="text.primary"
              borderTopRadius="md"
            >
              Overview
            </Tab>
            {analysisReport?.report && (
              <Tab
                _selected={{
                  bg: activeTabBg,
                  fontWeight: "semibold",
                  color: "text.primary",
                  border: "none",
                  borderBottomRadius: "0",
                  borderTopRadius: "md",
                  zIndex: "2",
                }}
                _hover={{
                  color: "text.linkHover",
                }}
                fontWeight="medium"
                color="text.primary"
                borderTopRadius="md"
              >
                Mind
              </Tab>
            )}
            {tokensList.length > 0 && (
              <Tab
                _selected={{
                  bg: activeTabBg,
                  fontWeight: "semibold",
                  color: "text.primary",
                  border: "none",
                  borderBottom: "none",
                  borderBottomRadius: "0",
                  borderTopRadius: "md",
                  zIndex: "2",
                }}
                _hover={{
                  color: "text.linkHover",
                }}
                fontWeight="medium"
                color="text.primary"
                borderTopRadius="md"
              >
                Tokens
              </Tab>
            )}
            {protocolInfo && (
              <Tab
                _selected={{
                  bg: activeTabBg,
                  fontWeight: "semibold",
                  color: "text.primary",
                  border: "none",
                  borderBottomRadius: "0",
                  borderTopRadius: "md",
                  zIndex: "2",
                }}
                _hover={{
                  color: "text.linkHover",
                }}
                fontWeight="medium"
                color="text.primary"
                borderTopRadius="md"
              >
                Protocol
              </Tab>
            )}
          </TabList>

          <TabPanels
            flex="1"
            overflowY="auto"
            bg={activeTabBg}
            mt="1px"
            borderTopRadius="0"
            position="relative"
            zIndex="1"
          >
            {/* 池子信息标签页 */}
            <TabPanel p={0} height="100%" position="relative">
              {/* 链图标作为整体背景 */}
              {chain && (
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  opacity="0.2"
                  width="250px"
                  height="250px"
                  transform="translate(-40px, -40px) rotate(7deg)"
                  zIndex={0}
                >
                  {chainIconPath ? (
                    <Image
                      src={chainIconPath}
                      alt={chain}
                      width="100%"
                      height="100%"
                      fallback={
                        <Text fontSize="3xl" opacity="0.2">
                          {chain}
                        </Text>
                      }
                    />
                  ) : (
                    <Text fontSize="3xl" opacity="0.2">
                      {chain}
                    </Text>
                  )}
                </Box>
              )}

              {/* 头部区域 - 池子基本信息 */}
              <Box position="relative" overflow="hidden">
                <Flex
                  pt={4}
                  alignItems="flex-start"
                  justifyContent="space-between"
                  position="relative"
                  zIndex={1}
                >
                  <Box ml={2}>
                    <HStack spacing={2}>
                      <Badge colorScheme={chainColor} fontSize="xs">
                        {chain}
                      </Badge>
                      <Text
                        fontSize="sm"
                        color={subtitleColor}
                        fontWeight="medium"
                      >
                        {project}
                      </Text>
                    </HStack>

                    <Flex alignItems="center">
                      {/* 底层代币图标 - 增加重叠效果 */}
                      {tokensList.length > 0 && (
                        <HStack spacing="-10px" mr={2} p={1}>
                          {tokensList.map((token, index) => (
                            <Box
                              key={token.cgId}
                              bgColor="white"
                              borderRadius="full"
                              borderWidth="1px"
                              borderColor={borderColor}
                              zIndex={tokensList.length - index}
                              transform={`translateX(${index * -10}px)`}
                              boxShadow="md"
                            >
                              <Image
                                src={token.imageUrl}
                                alt={token.symbol}
                                boxSize="28px"
                                borderRadius="full"
                                fallbackSrc="https://via.placeholder.com/24"
                              />
                            </Box>
                          ))}
                        </HStack>
                      )}
                      <Text fontSize="xl" fontWeight="bold" color={titleColor}>
                        {symbol}
                      </Text>
                    </Flex>
                  </Box>

                  {/* Mind score display - three scores in parallel */}
                  {analysisReport?.overallScore !== undefined && (
                    <Flex
                      direction="row"
                      align="center"
                      zIndex={10}
                      mr={2}
                      bg="rgba(255,255,255,0.1)"
                      p={2}
                      borderRadius="md"
                    >
                      <Flex direction="column" align="center" mx={2}>
                        <Text
                          fontSize="lg"
                          fontWeight="bold"
                          color={getScoreColor(analysisReport.overallScore)}
                          // bg={getScoreBackgroundColor(
                          //   analysisReport.overallScore
                          // )}
                          px={2}
                          py={0.5}
                          borderRadius="md"
                        >
                          {analysisReport.overallScore}
                        </Text>
                        <Text fontSize="xs" fontWeight="medium">
                          Overall
                        </Text>
                      </Flex>

                      {analysisReport.safetyScore !== undefined && (
                        <Flex direction="column" align="center" mx={2}>
                          <Text
                            fontSize="md"
                            fontWeight="bold"
                            color={getScoreColor(analysisReport.safetyScore)}
                            // bg={getScoreBackgroundColor(
                            //   analysisReport.safetyScore
                            // )}
                            px={2}
                            py={0.5}
                            borderRadius="md"
                          >
                            {analysisReport.safetyScore}
                          </Text>
                          <Text fontSize="xs" fontWeight="medium">
                            Safety
                          </Text>
                        </Flex>
                      )}

                      {analysisReport.sustainabilityScore !== undefined && (
                        <Flex direction="column" align="center" mx={2}>
                          <Text
                            fontSize="md"
                            fontWeight="bold"
                            color={getScoreColor(
                              analysisReport.sustainabilityScore
                            )}
                            // bg={getScoreBackgroundColor(
                            //   analysisReport.sustainabilityScore
                            // )}
                            px={2}
                            py={0.5}
                            borderRadius="md"
                          >
                            {analysisReport.sustainabilityScore}
                          </Text>
                          <Text fontSize="xs" fontWeight="medium">
                            Sustain.
                          </Text>
                        </Flex>
                      )}
                    </Flex>
                  )}
                </Flex>
              </Box>

              {/* 核心指标区域 */}
              <Box p={2} position="relative" zIndex={1}>
                <Flex justifyContent="space-between" mb={4}>
                  <Stat>
                    <StatLabel>APY</StatLabel>
                    <Popover trigger="hover" placement="bottom-start">
                      <PopoverTrigger>
                        <Flex alignItems="flex-end">
                          <StatNumber color="green.500" fontSize="xl" mr={1}>
                            {formattedApy}
                          </StatNumber>
                          {apyPct1D !== null && apyPct1D !== undefined && (
                            <Flex align="center" gap={0.5}>
                              <Text
                                fontSize="xs"
                                mb={1}
                                color={apyPct1D >= 0 ? "green.500" : "red.500"}
                              >
                                {apyPct1D >= 0 ? "+" : ""}
                                {fNum("apr", Math.abs(apyPct1D))}
                              </Text>
                              <Icon
                                as={
                                  apyPct1D >= 0
                                    ? FaArrowTrendUp
                                    : FaArrowTrendDown
                                }
                                color={apyPct1D >= 0 ? "green.500" : "red.500"}
                                mb={1}
                                boxSize="12px"
                              />
                            </Flex>
                          )}
                        </Flex>
                      </PopoverTrigger>
                      <PopoverContent width="200px" p={2}>
                        <PopoverArrow />
                        <PopoverBody>
                          <VStack spacing={3} align="stretch">
                            {apyBase !== null && apyBase !== undefined && (
                              <Flex align="center" justify="space-between">
                                <Text fontSize="sm">Base Yield:</Text>
                                <Text fontSize="sm" fontWeight="medium">
                                  {fNum("apr", apyBase)}
                                </Text>
                              </Flex>
                            )}
                            {apyReward !== null &&
                              apyReward !== undefined &&
                              apyReward > 0 && (
                                <Flex align="center" justify="space-between">
                                  <Flex align="center">
                                    <Icon
                                      as={BsStars}
                                      color="yellow.400"
                                      mr={1}
                                    />
                                    <Text fontSize="sm">Reward Yield:</Text>
                                  </Flex>
                                  <Text
                                    fontSize="sm"
                                    fontWeight="medium"
                                    color="purple.300"
                                  >
                                    {fNum("apr", apyReward)}
                                  </Text>
                                </Flex>
                              )}
                            <Divider />
                            <Flex align="center" justify="space-between">
                              <Text fontSize="sm" fontWeight="bold">
                                Total Yield:
                              </Text>
                              <Text
                                fontSize="sm"
                                fontWeight="bold"
                                color="green.500"
                              >
                                {formattedApy}
                              </Text>
                            </Flex>
                          </VStack>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Stat>
                  <Stat>
                    <StatLabel>TVL</StatLabel>
                    <StatNumber fontSize="xl">{formattedTvl}</StatNumber>
                  </Stat>
                  {volume1D !== null && volume1D !== undefined && (
                    <Stat>
                      <StatLabel>24h Volume</StatLabel>
                      <StatNumber fontSize="xl">{formattedVolume}</StatNumber>
                    </Stat>
                  )}
                </Flex>

                {/* 风险和类型标签 */}

                <Wrap mt={3} spacing={2}>
                  {/* 无常损失标签 */}
                  {ilRisk === "yes" && (
                    <WrapItem>
                      <Tooltip label="Impermanent Loss Risk" hasArrow>
                        <Badge
                          colorScheme={ilRiskColor}
                          px={2}
                          py={1}
                          borderRadius="md"
                        >
                          IL Risk
                        </Badge>
                      </Tooltip>
                    </WrapItem>
                  )}

                  {/* 资产敞口标签 */}
                  <WrapItem>
                    <Tooltip
                      label={
                        exposure === "multi"
                          ? "Multiple assets in pool"
                          : "Single asset in pool"
                      }
                      hasArrow
                    >
                      <Badge
                        colorScheme={exposure === "multi" ? "purple" : "blue"}
                        px={2}
                        py={1}
                        borderRadius="md"
                      >
                        {exposure === "multi" ? "Multi-Asset" : "Single-Asset"}
                      </Badge>
                    </Tooltip>
                  </WrapItem>

                  {/* 稳定币标签 */}
                  {stablecoin && (
                    <WrapItem>
                      <Tooltip label="Exposure to stablecoin only" hasArrow>
                        <Badge
                          colorScheme="green"
                          px={2}
                          py={1}
                          borderRadius="md"
                        >
                          Stablecoin
                        </Badge>
                      </Tooltip>
                    </WrapItem>
                  )}

                  {/* 奖励标签 */}
                  {apyReward !== null && (
                    <WrapItem>
                      <Tooltip
                        label={`Reward: ${fNum("apr", apyReward || 0)}`}
                        hasArrow
                      >
                        <Badge
                          colorScheme="purple"
                          px={2}
                          py={1}
                          borderRadius="md"
                          variant="solid"
                        >
                          Incentivized
                        </Badge>
                      </Tooltip>
                    </WrapItem>
                  )}
                </Wrap>

                {/* 添加AI整体评价 */}
                {analysisReport?.report?.overview && (
                  <Box mt={4} position="relative" height="72px">
                    <Box
                      position="absolute"
                      top="0"
                      left="0"
                      right="0"
                      bottom="0"
                      overflowY="auto"
                      css={{
                        "&::-webkit-scrollbar": {
                          width: "0px",
                        },
                        scrollbarWidth: "none",
                        "-ms-overflow-style": "none",
                      }}
                    >
                      <Flex align="center" mb={1}>
                        <Text
                          fontSize="sm"
                          color={subtitleColor}
                          whiteSpace="pre-wrap"
                        >
                          <Icon
                            as={RiRobot3Line}
                            mr={1}
                            color="purple.400"
                            boxSize="16px"
                          />
                          {analysisReport.report.overview}
                        </Text>
                      </Flex>
                    </Box>
                  </Box>
                )}
              </Box>
            </TabPanel>

            {/* AI分析报告标签页 - 添加图标美化 */}
            {analysisReport?.report && (
              <TabPanel p={4} height="100%" overflowY="auto">
                <VStack spacing={4} align="stretch">
                  {analysisReport.report.tokenAnalysis && (
                    <Box>
                      <Flex align="center" mb={2}>
                        <Icon as={BsShield} mr={2} color="purple.300" />
                        <Heading size="sm">Token Analysis</Heading>
                      </Flex>
                      <Text whiteSpace="pre-wrap" fontSize="xs">
                        {analysisReport.report.tokenAnalysis}
                      </Text>
                    </Box>
                  )}

                  {analysisReport.report.yieldAndLiquidity && (
                    <Box>
                      <Flex align="center" mb={2}>
                        <Icon as={BsGraphUp} mr={2} color="purple.300" />
                        <Heading size="sm">Yield & Liquidity</Heading>
                      </Flex>
                      <Text whiteSpace="pre-wrap" fontSize="xs">
                        {analysisReport.report.yieldAndLiquidity}
                      </Text>
                    </Box>
                  )}

                  {analysisReport.report.riskWarnings && (
                    <Box>
                      <Flex align="center" mb={2}>
                        <Icon as={FiAlertTriangle} mr={2} color="orange.400" />
                        <Heading size="sm" color="orange.400">
                          Risk Warnings
                        </Heading>
                      </Flex>
                      <Alert
                        status="error"
                        variant="left-accent"
                        borderRadius="lg"
                      >
                        <Box>
                          <Text
                            whiteSpace="pre-wrap"
                            fontSize="xs"
                            fontWeight="semibold"
                          >
                            {analysisReport.report.riskWarnings}
                          </Text>
                        </Box>
                      </Alert>
                    </Box>
                  )}
                </VStack>
              </TabPanel>
            )}

            {/* 底层代币标签页 */}
            {tokensList.length > 0 && (
              <TabPanel p={0} height="100%" overflowY="auto">
                {tokensList.map((token) => (
                  <Box key={token.cgId} p={4}>
                    <Flex
                      p={0}
                      ml={2}
                      justify="space-between"
                      position="relative"
                      zIndex={1}
                    >
                      <HStack spacing={2} flex={1} maxW="100%" align="center">
                        <Image
                          src={token.imageUrl}
                          alt={token.symbol}
                          boxSize="35px"
                          borderRadius="full"
                          fallbackSrc="https://via.placeholder.com/40"
                        />
                        <VStack spacing={0} align="flex-start">
                          <HStack spacing={1}>
                            <Text fontWeight="bold" fontSize="2xl" mr={1}>
                              {token.symbol.toUpperCase()}
                            </Text>
                            {token.marketCapRank && (
                              <Tooltip label="CoinGecko rank" hasArrow>
                                <Badge
                                  fontSize="xs"
                                  colorScheme="blue"
                                  variant="subtle"
                                >
                                  #{token.marketCapRank}
                                </Badge>
                              </Tooltip>
                            )}
                          </HStack>
                          <Text
                            color="text.secondary"
                            fontSize="xs"
                            noOfLines={1}
                          >
                            {token.name}
                          </Text>
                        </VStack>
                      </HStack>

                      {/* 社交链接 */}
                      <HStack spacing={1}>
                        {token.homepage && (
                          <IconButton
                            as={Link}
                            href={token.homepage}
                            isExternal
                            aria-label="Homepage"
                            icon={<FiExternalLink />}
                            size="xs"
                            variant="ghost"
                          />
                        )}
                        {token.twitter && (
                          <IconButton
                            as={Link}
                            href={`https://x.com/${token.twitter.replace("@", "")}`}
                            isExternal
                            aria-label="Twitter"
                            icon={<FiTwitter />}
                            size="xs"
                            variant="ghost"
                          />
                        )}
                        {token.telegram && (
                          <IconButton
                            as={Link}
                            href={token.telegram}
                            isExternal
                            aria-label="Telegram"
                            icon={<FaTelegramPlane />}
                            size="xs"
                            variant="ghost"
                          />
                        )}
                        {token.github && (
                          <IconButton
                            as={Link}
                            href={token.github}
                            isExternal
                            aria-label="GitHub"
                            icon={<FiGithub />}
                            size="xs"
                            variant="ghost"
                          />
                        )}
                      </HStack>
                    </Flex>
                    <Box ml={2}>
                      {/* 代币类别标签 */}
                      <Wrap
                        spacing={1}
                        justify="start"
                        maxW="100%"
                        zIndex={1}
                        p={2}
                      >
                        {token.categories &&
                          token.categories
                            .slice(0, 4)
                            .map((category: string) => (
                              <WrapItem key={category}>
                                <Badge
                                  colorScheme="purple"
                                  fontSize="10px"
                                  variant="subtle"
                                  textTransform="initial"
                                >
                                  {category}
                                </Badge>
                              </WrapItem>
                            ))}
                        {token.categories && token.categories.length > 4 && (
                          <WrapItem>
                            <Tooltip
                              label={token.categories.slice(4).join(", ")}
                              hasArrow
                            >
                              <Badge
                                colorScheme="gray"
                                fontSize="10px"
                                variant="subtle"
                                textTransform="initial"
                              >
                                +{token.categories.length - 4}
                              </Badge>
                            </Tooltip>
                          </WrapItem>
                        )}
                      </Wrap>
                      {token.description && (
                        <TabPanel p={0}>
                          <Box
                            height="45px"
                            overflowY="auto"
                            css={{
                              "&::-webkit-scrollbar": {
                                width: "3px",
                              },
                              "&::-webkit-scrollbar-track": {
                                width: "3px",
                              },
                              "&::-webkit-scrollbar-thumb": {
                                background: "gray.300",
                                borderRadius: "24px",
                              },
                            }}
                          >
                            <Text fontSize="xs" color={subtitleColor}>
                              {token.description}
                            </Text>
                          </Box>
                        </TabPanel>
                      )}
                    </Box>
                  </Box>
                ))}
              </TabPanel>
            )}

            {/* 协议信息标签页 */}
            <TabPanel p={4} height="100%" overflowY="auto">
              <Box>
                <Flex
                  p={0}
                  justify="space-between"
                  position="relative"
                  zIndex={1}
                >
                  <HStack spacing={2} flex={1} maxW="100%" align="center">
                    {protocolInfo?.logo && (
                      <Image
                        src={protocolInfo.logo}
                        alt={protocolInfo.name}
                        boxSize="35px"
                        borderRadius="full"
                        fallbackSrc={`https://via.placeholder.com/40/929292?text=${protocol.charAt(0)}`}
                      />
                    )}
                    <VStack spacing={0} align="flex-start">
                      <HStack spacing={0}>
                        <Text fontWeight="bold" fontSize="2xl" mr={1}>
                          {protocolInfo?.name || protocol}
                        </Text>
                        {protocolInfo?.url && (
                          <IconButton
                            as={Link}
                            href={protocolInfo.url}
                            isExternal
                            aria-label="Protocol Website"
                            icon={<FiExternalLink />}
                            size="xs"
                            variant="ghost"
                          />
                        )}
                        {protocolInfo?.twitter && (
                          <IconButton
                            as={Link}
                            href={`https://twitter.com/${protocolInfo.twitter}`}
                            isExternal
                            aria-label="Twitter"
                            icon={<FiTwitter />}
                            size="xs"
                            variant="ghost"
                          />
                        )}
                        {protocolInfo?.github && (
                          <IconButton
                            as={Link}
                            href={`https://github.com/${protocolInfo.github}`}
                            isExternal
                            aria-label="GitHub"
                            icon={<FiGithub />}
                            size="xs"
                            variant="ghost"
                          />
                        )}
                      </HStack>
                      <Text variant="secondary" fontSize="xs" noOfLines={1}>
                        {protocolInfo?.category || "Protocol"}
                      </Text>
                    </VStack>
                    {/* TVL信息 */}
                    {protocolInfo?.tvl && (
                      <VStack align="center" mb={2} ml="auto">
                        <Text variant="secondary" fontSize="xs">
                          All-Chains TVL
                        </Text>
                        <Flex direction="column" align="flex-end">
                          <Text fontSize="md" fontWeight="bold">
                            {fNum("fiat", protocolInfo.tvl, {
                              abbreviated: true,
                            })}
                          </Text>
                          {protocolInfo.change_7d !== undefined && (
                            <Flex align="center" mt={0.5}>
                              <Text
                                fontSize="xs"
                                color={
                                  protocolInfo.change_7d >= 0
                                    ? "green.500"
                                    : "red.500"
                                }
                                mr={1}
                              >
                                {protocolInfo.change_7d >= 0 ? "+" : ""}
                                {fNum("apr", Math.abs(protocolInfo.change_7d))}
                              </Text>
                              <Icon
                                as={
                                  protocolInfo.change_7d >= 0
                                    ? FaArrowTrendUp
                                    : FaArrowTrendDown
                                }
                                color={
                                  protocolInfo.change_7d >= 0
                                    ? "green.500"
                                    : "red.500"
                                }
                                boxSize="10px"
                              />
                            </Flex>
                          )}
                        </Flex>
                      </VStack>
                    )}
                  </HStack>
                </Flex>
                {/* 协议描述 */}
                {protocolInfo?.description && (
                  <Box mt={2} ml={2} maxW="100%">
                    <Text fontSize="sm" color={subtitleColor}>
                      {protocolInfo.description}
                    </Text>
                  </Box>
                )}

                <Box ml={2} mt={4}>
                  <VStack align="start" mb={2}>
                    <Text fontSize="sm" fontWeight="medium" variant="secondary">
                      Supported Chains
                    </Text>
                    <Wrap spacing={1} mb={4}>
                      {protocolInfo?.chains
                        ?.slice(0, 5)
                        .map((chainName: string) => (
                          <WrapItem key={chainName}>
                            <Tag size="xs" variant="subtle" borderRadius="sm">
                              {chainName}
                            </Tag>
                          </WrapItem>
                        ))}
                      {protocolInfo?.chains?.length > 5 && (
                        <WrapItem>
                          <Tooltip
                            label={protocolInfo.chains.slice(5).join(", ")}
                            hasArrow
                          >
                            <Tag size="xs" colorScheme="gray" variant="solid">
                              +{protocolInfo.chains.length - 5}
                            </Tag>
                          </Tooltip>
                        </WrapItem>
                      )}
                    </Wrap>
                  </VStack>

                  {/* 审计信息 */}
                  <VStack align="start" mb={2}>
                    <Text fontSize="sm" fontWeight="medium" variant="secondary">
                      Audits
                    </Text>
                    <Text fontSize="sm">{protocolInfo?.audits || "N/A"}</Text>
                  </VStack>
                </Box>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </AnimatedCard>
  );
}
