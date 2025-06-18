import {
  Box,
  Flex,
  Text,
  Badge,
  Image,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  Tooltip,
  Link,
  HStack,
  Icon,
  IconButton,
  VStack,
  Wrap,
  WrapItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { fNum } from "@/lib/utils/numbers";
import {
  FiExternalLink,
  FiTwitter,
  FiGithub,
  FiMaximize2,
  FiMinimize2,
} from "react-icons/fi";
import { FaTelegramPlane } from "react-icons/fa";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { RiRobot3Line } from "react-icons/ri";
import { AnimatedCard } from "./AnimatedCard";
import {
  getScoreColor,
  getScoreBackgroundColor,
  getScoreTextColor,
} from "@/lib/utils/scoreColors";

interface EnhancedTokenCardProps {
  token: {
    cgId: string;
    name: string;
    symbol: string;
    description?: string;
    imageUrl?: string;
    categories?: string[];
    homepage?: string;
    twitter?: string;
    telegram?: string;
    github?: string;
    currentPrice?: number;
    marketCap?: number;
    fullyDilutedValuation?: number;
    priceChangePercentage24h?: number;
    marketCapRank?: number;
  };
  analysisReport?: {
    tokenAnalysis?: string;
    tokenScore?: number;
    pools?: Record<
      string,
      {
        safetyScore?: number;
        sustainabilityScore?: number;
        overallScore?: number;
        report?: {
          overview?: string;
          tokenAnalysis?: string;
          yieldAndLiquidity?: string;
          riskWarnings?: string;
        };
      }
    >;
  };
  trending?: boolean;
  isCompact?: boolean;
  onClick?: () => void;
  delay?: number;
}

export function EnhancedTokenCard({
  token,
  analysisReport,
  isCompact = false,
  onClick,
  delay = 0,
}: EnhancedTokenCardProps) {
  const {
    cgId,
    name,
    symbol,
    description,
    imageUrl,
    categories,
    homepage,
    twitter,
    telegram,
    github,
    currentPrice,
    marketCap,
    fullyDilutedValuation,
    priceChangePercentage24h,
    marketCapRank,
  } = token;

  const [activeTab, setActiveTab] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [expandedContentType, setExpandedContentType] = useState<string>("");
  const [expandedContent, setExpandedContent] = useState<string>("");

  // 颜色和样式
  const bgColor = useColorModeValue(
    "background.baseWithOpacity",
    "background.baseWithOpacity"
  );
  const borderColor = useColorModeValue("border.base", "border.base");
  const subtitleColor = useColorModeValue("text.secondary", "text.secondary");

  // 格式化价格
  const formatPrice = (price?: number) => {
    if (!price) return "N/A";
    return fNum("fiat", price, { abbreviated: false });
  };

  // 格式化市值
  const formatMarketCap = (value?: number) => {
    if (!value) return "N/A";
    return fNum("fiat", value, { abbreviated: true });
  };

  // 使用统一的评分颜色函数
  // 已从文件顶部导入getScoreColor, getScoreBackgroundColor, getScoreTextColor

  return (
    <AnimatedCard delay={delay}>
      <Box
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        overflow="hidden"
        boxShadow="sm"
        transition="all 0.3s"
        _hover={{
          boxShadow: "lg",
          transform: "translateY(-2px)",
        }}
        position="relative"
        height={isCompact ? "auto" : "auto"}
        minHeight={isCompact ? "150px" : "320px"}
        maxHeight={isCompact ? "150px" : "320px"}
        onClick={isCompact && onClick ? onClick : undefined}
        cursor={isCompact && onClick ? "pointer" : "default"}
        backdropFilter="blur(8px)"
        width="100%"
      >
        {/* 背景装饰 - 使用主题渐变 */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bgGradient="linear(to-br, rgba(129, 99, 199, 0.05), rgba(100, 100, 250, 0.02))"
          zIndex={0}
          pointerEvents="none"
        />

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
          {isCompact && (
            <Box
              position="absolute"
              left="-20px"
              bottom="-25px"
              opacity="0.4"
              zIndex={0}
              overflow="hidden"
            >
              <Image
                src={imageUrl}
                alt={symbol}
                boxSize="100px"
                borderRadius="full"
                fallbackSrc="https://via.placeholder.com/40"
              />
            </Box>
          )}
          <Box
            position="absolute"
            right="-10px"
            top="-10px"
            opacity="0.4"
            zIndex={0}
            transform="rotate(7deg)"
          >
            <Text
              fontSize={isCompact ? "8xl" : "9xl"}
              fontWeight="bold"
              color={getScoreColor(analysisReport?.tokenScore, 1, true)}
              lineHeight="0.8"
            >
              {analysisReport?.tokenScore}
            </Text>
          </Box>
        </Box>

        {/* 内容区域 */}
        <Box p={isCompact ? 3 : 4} position="relative" zIndex={1}>
          {/* 代币基本信息 */}
          <Flex justify="space-between" align="center" mb={isCompact ? 2 : 3}>
            <Flex align="center">
              {!isCompact && (
                <Image
                  src={imageUrl}
                  alt={symbol}
                  boxSize="40px"
                  borderRadius="full"
                  mr={2}
                  fallbackSrc="https://via.placeholder.com/40"
                />
              )}
              <Box>
                <Flex align="center">
                  <Text
                    fontWeight="semibold"
                    variant="primary"
                    fontSize={isCompact ? "md" : "xl"}
                    mr={1}
                  >
                    {symbol.toUpperCase()}
                  </Text>
                  {marketCapRank && (
                    <Badge
                      colorScheme="purple"
                      variant="subtle"
                      fontSize="xs"
                      borderRadius="full"
                    >
                      #{marketCapRank}
                    </Badge>
                  )}
                </Flex>
                {!isCompact && (
                  <Text fontSize="sm" variant="secondary">
                    {name}
                  </Text>
                )}
              </Box>
            </Flex>
          </Flex>

          {/* 代币类别标签 */}
          {categories && categories.length > 0 && (
            <Box mb={2}>
              <Wrap spacing={1}>
                {categories.slice(0, isCompact ? 2 : 4).map((category) => (
                  <WrapItem key={category}>
                    <Badge
                      fontSize="2xs"
                      colorScheme="blue"
                      variant="subtle"
                      borderRadius="full"
                    >
                      {category}
                    </Badge>
                  </WrapItem>
                ))}
                {categories.length > (isCompact ? 2 : 4) && (
                  <WrapItem>
                    <Tooltip label={categories.slice(4).join(", ")} hasArrow>
                      <Badge
                        fontSize="2xs"
                        colorScheme="gray"
                        variant="subtle"
                        borderRadius="full"
                      >
                        +{categories.length - (isCompact ? 2 : 4)}
                      </Badge>
                    </Tooltip>
                  </WrapItem>
                )}
              </Wrap>
            </Box>
          )}

          {/* 价格和市值信息 - 紧凑布局 */}
          {isCompact ? (
            <Flex justify="space-between" align="center" mb={2} wrap="nowrap">
              <Box flex="1">
                <Text fontSize="xs" color={subtitleColor}>
                  Price
                </Text>
                <Flex align="center">
                  <Text fontWeight="bold" fontSize="sm">
                    {formatPrice(currentPrice)}
                  </Text>
                  {priceChangePercentage24h !== undefined && (
                    <Badge
                      ml={1}
                      colorScheme={
                        priceChangePercentage24h >= 0 ? "deepgreen" : "red"
                      }
                      variant="subtle"
                      fontSize="2xs"
                    >
                      <Flex align="center">
                        <Icon
                          as={
                            priceChangePercentage24h >= 0
                              ? FaArrowTrendUp
                              : FaArrowTrendDown
                          }
                          boxSize="8px"
                          mr="1px"
                        />
                        {Math.abs(priceChangePercentage24h).toFixed(1)}%
                      </Flex>
                    </Badge>
                  )}
                </Flex>
              </Box>
              <Box flex="1">
                <Text fontSize="xs" color={subtitleColor}>
                  MCap
                </Text>
                <Text fontWeight="bold" fontSize="sm">
                  {formatMarketCap(marketCap)}
                </Text>
              </Box>
            </Flex>
          ) : (
            // 完整视图的价格和市值信息
            <Flex justify="space-between" mb={3} wrap="wrap">
              <Box flex="1" minWidth="100px" mr={2}>
                <Text fontSize="xs" color={subtitleColor}>
                  Price
                </Text>
                <Flex align="center">
                  <Text fontWeight="bold" fontSize="md">
                    {formatPrice(currentPrice)}
                  </Text>
                  {priceChangePercentage24h !== undefined && (
                    <Badge
                      ml={1}
                      colorScheme={
                        priceChangePercentage24h >= 0 ? "green" : "red"
                      }
                      variant="subtle"
                      fontSize="xs"
                    >
                      <Flex align="center">
                        <Icon
                          as={
                            priceChangePercentage24h >= 0
                              ? FaArrowTrendUp
                              : FaArrowTrendDown
                          }
                          boxSize="10px"
                          mr="1px"
                        />
                        {Math.abs(priceChangePercentage24h).toFixed(1)}%
                      </Flex>
                    </Badge>
                  )}
                </Flex>
              </Box>
              <Box flex="1" minWidth="100px" mr={2}>
                <Text fontSize="xs" color={subtitleColor}>
                  Market Cap
                </Text>
                <Text fontWeight="bold" fontSize="md">
                  {formatMarketCap(marketCap)}
                </Text>
              </Box>
              <Box flex="1" minWidth="100px">
                <Text fontSize="xs" color={subtitleColor}>
                  FDV
                </Text>
                <Text fontWeight="bold" fontSize="md">
                  {formatMarketCap(fullyDilutedValuation)}
                </Text>
              </Box>
            </Flex>
          )}

          {/* 完整视图 - 显示标签页 */}
          {!isCompact && (
            <Box mt={2}>
              <Tabs
                size="sm"
                variant="soft-rounded"
                colorScheme="purple"
                index={activeTab}
                onChange={setActiveTab}
                isLazy
              >
                <TabList>
                  <Tab fontSize="xs">Mind</Tab>
                  <Tab fontSize="xs">Info</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel px={0} py={2}>
                    {analysisReport && analysisReport.tokenAnalysis ? (
                      <Box position="relative">
                        <Box
                          height="90px"
                          overflowY="auto"
                          css={{
                            "&::-webkit-scrollbar": {
                              width: "4px",
                            },
                            "&::-webkit-scrollbar-track": {
                              width: "6px",
                            },
                            "&::-webkit-scrollbar-thumb": {
                              background: "rgba(160, 160, 160, 0.5)",
                              borderRadius: "24px",
                            },
                          }}
                        >
                          <Text fontSize="sm">
                            {analysisReport.tokenAnalysis}
                          </Text>
                        </Box>
                      </Box>
                    ) : (
                      <Text fontSize="sm" color={subtitleColor}>
                        No analysis available.
                      </Text>
                    )}
                  </TabPanel>
                  <TabPanel px={0} py={2}>
                    {description ? (
                      <Box position="relative">
                        <Box
                          height="72px"
                          overflowY="auto"
                          css={{
                            "&::-webkit-scrollbar": {
                              width: "4px",
                            },
                            "&::-webkit-scrollbar-track": {
                              width: "6px",
                            },
                            "&::-webkit-scrollbar-thumb": {
                              background: "rgba(160, 160, 160, 0.5)",
                              borderRadius: "24px",
                            },
                          }}
                        >
                          <Text fontSize="sm">{description}</Text>
                        </Box>
                      </Box>
                    ) : (
                      <Text fontSize="sm" color={subtitleColor}>
                        No description available.
                      </Text>
                    )}

                    {/* 社交链接 */}
                    <Flex mt={2} gap={2}>
                      {homepage && (
                        <IconButton
                          aria-label="Website"
                          icon={<FiExternalLink />}
                          size="xs"
                          variant="ghost"
                          as={Link}
                          href={homepage}
                          isExternal
                        />
                      )}
                      {twitter && (
                        <IconButton
                          aria-label="Twitter"
                          icon={<FiTwitter />}
                          size="xs"
                          variant="ghost"
                          as={Link}
                          href={twitter}
                          isExternal
                        />
                      )}
                      {telegram && (
                        <IconButton
                          aria-label="Telegram"
                          icon={<FaTelegramPlane />}
                          size="xs"
                          variant="ghost"
                          as={Link}
                          href={telegram}
                          isExternal
                        />
                      )}
                      {github && (
                        <IconButton
                          aria-label="GitHub"
                          icon={<FiGithub />}
                          size="xs"
                          variant="ghost"
                          as={Link}
                          href={github}
                          isExternal
                        />
                      )}
                    </Flex>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          )}
        </Box>
      </Box>

      {/* 内容展开模态框 */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent bg="background.card" borderRadius="xl">
          <ModalHeader>
            <Flex align="center" justify="space-between">
              <Text>
                {expandedContentType} - {symbol}
              </Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text whiteSpace="pre-wrap" fontSize="sm">
              {expandedContent}
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </AnimatedCard>
  );
}
