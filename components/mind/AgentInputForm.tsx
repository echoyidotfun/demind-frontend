import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Textarea,
  VStack,
  Text,
  useToast,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { useUserAccount } from "@/lib/modules/web3/UserAccountProvider";

export function AgentInputForm() {
  const [userInput, setUserInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentResponse, setAgentResponse] = useState<any>(null);
  const toast = useToast();
  const { isConnected } = useUserAccount();

  // 处理用户提交的交易意图
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      toast({
        title: "请先连接钱包",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!userInput.trim()) {
      toast({
        title: "请输入交易意图",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsProcessing(true);

      // 调用后端API解析用户意图
      const response = await fetch("/api/mind/parseIntent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput }),
      });

      if (!response.ok) {
        throw new Error("意图解析失败");
      }

      const data = await response.json();
      setAgentResponse(data);
    } catch (error) {
      console.error("处理交易意图时出错:", error);
      toast({
        title: "处理失败",
        description: (error as Error).message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // 执行解析后的交易
  const executeSwap = async () => {
    if (!agentResponse) return;

    try {
      setIsProcessing(true);

      // 调用后端API执行交易
      const response = await fetch("/api/mind/executeSwap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(agentResponse),
      });

      if (!response.ok) {
        throw new Error("交易执行失败");
      }

      const data = await response.json();

      toast({
        title: "交易已提交",
        description: `交易哈希: ${data.txHash}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // 重置状态
      setUserInput("");
      setAgentResponse(null);
    } catch (error) {
      console.error("执行交易时出错:", error);
      toast({
        title: "交易失败",
        description: (error as Error).message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box w="full" maxW="container.md" mx="auto" p={4}>
      <VStack spacing={6} align="stretch">
        <form onSubmit={handleSubmit}>
          <FormControl>
            <Textarea
              placeholder="请输入您的交易意图，例如: '我想用 100 USDT 购买 ETH'"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              size="lg"
              rows={4}
              disabled={isProcessing}
            />
          </FormControl>
          <Button
            mt={4}
            colorScheme="purple"
            type="submit"
            isLoading={isProcessing}
            w="full"
          >
            解析交易意图
          </Button>
        </form>

        {agentResponse && (
          <Box
            border="1px"
            borderColor="gray.200"
            borderRadius="md"
            p={4}
            bg="gray.50"
          >
            <Text fontSize="lg" fontWeight="bold" mb={3}>
              解析结果:
            </Text>
            <VStack align="start" spacing={2}>
              <Text>从: {agentResponse.sourceToken.symbol}</Text>
              <Text>到: {agentResponse.targetToken.symbol}</Text>
              <Text>金额: {agentResponse.amount}</Text>
              <Text>预计可得: {agentResponse.expectedOutput}</Text>
              <Text>滑点: {agentResponse.slippage}%</Text>
            </VStack>
            <Button
              mt={4}
              colorScheme="green"
              onClick={executeSwap}
              isLoading={isProcessing}
              w="full"
            >
              确认交易
            </Button>
          </Box>
        )}

        {isProcessing && !agentResponse && (
          <Flex justify="center" my={8}>
            <VStack>
              <Spinner size="xl" color="purple.500" />
              <Text mt={2}>AI正在理解您的交易意图...</Text>
            </VStack>
          </Flex>
        )}
      </VStack>
    </Box>
  );
}
