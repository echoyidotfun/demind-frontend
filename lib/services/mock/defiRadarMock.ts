import defiOpportunities from "@/findDefiOppotunities.json";
import trendingTokenPools from "@/findTrendingTokenPools.json";

// 模拟工作流步骤
const workflowSteps = [
  {
    stepId: "prepare-intent-input",
    stepStatus: "start",
    message: "Preparing to analyze user input",
    timestamp: new Date().toISOString(),
  },
  {
    stepId: "prepare-intent-input",
    stepStatus: "complete",
    message: "User input parsing complete",
    timestamp: new Date().toISOString(),
  },
  {
    stepId: "intent-recognition",
    stepStatus: "start",
    message: "Identifying user intent",
    timestamp: new Date().toISOString(),
  },
  {
    stepId: "intent-recognition",
    stepStatus: "complete",
    message: "User intent successfully identified",
    timestamp: new Date().toISOString(),
    detail: {
      message: "Successfully identified user intent",
      intentRecognized: true,
    },
    data: {
      tool: "findDefiInvestmentOpportunities",
      hasParams: true,
    },
  },
  {
    stepId: "tool-selector",
    stepStatus: "start",
    message: "Selecting appropriate data tools",
    timestamp: new Date().toISOString(),
  },
  {
    stepId: "tool-selector",
    stepStatus: "complete",
    message: "Data tools selected",
    timestamp: new Date().toISOString(),
  },
  {
    stepId: "process-tool-output",
    stepStatus: "start",
    message: "Processing tool output",
    timestamp: new Date().toISOString(),
  },
  {
    stepId: "process-tool-output",
    stepStatus: "complete",
    message: "Data processing complete",
    timestamp: new Date().toISOString(),
  },
  {
    stepId: "wrap-analysis-report",
    stepStatus: "start",
    message: "Generating analysis report",
    timestamp: new Date().toISOString(),
  },
  {
    stepId: "wrap-analysis-report",
    stepStatus: "complete",
    message: "Analysis report generation complete",
    timestamp: new Date().toISOString(),
  },
  {
    stepId: "final-data-formatter",
    stepStatus: "start",
    message: "Formatting final data",
    timestamp: new Date().toISOString(),
  },
  {
    stepId: "final-data-formatter",
    stepStatus: "complete",
    message: "Data formatting complete",
    timestamp: new Date().toISOString(),
  },
];

// 步骤结果消息
const stepResultsMessage = {
  steps: workflowSteps.map((step) => ({
    stepId: step.stepId,
    status: step.stepStatus,
    message: step.message,
  })),
  summary: "Analysis completed, found multiple high-yield DeFi opportunities",
};

// 模拟延迟函数
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 模拟流事件的发送
export const mockStreamEvents = async (
  queryType: "defi" | "trending",
  callback: (event: any) => void,
  stepDelay = 700,
  messageDelay = 1000
) => {
  // 发送连接事件
  callback({
    type: "connected",
    data: {
      status: "Connected to streaming API",
      timestamp: new Date().toISOString(),
      runId: `mock-${Date.now()}`,
    },
  });

  await delay(500);

  // 发送开始事件
  callback({
    type: "start",
    data: {
      message: "Starting DeFi analysis...",
      query:
        queryType === "defi"
          ? "Find DeFi opportunities with APY over 10%"
          : "Analyze investment opportunities in trending tokens",
    },
  });

  await delay(500);

  // 发送工作流进度事件
  for (const step of workflowSteps) {
    callback({
      type: "workflowProgress",
      data: step,
    });
    await delay(stepDelay);
  }

  // 发送步骤结果事件
  callback({
    type: "stepResults",
    data: stepResultsMessage,
  });

  await delay(messageDelay);

  // 发送心跳信号
  callback({
    type: "heartbeat",
    data: {
      time: new Date().toISOString(),
    },
  });

  await delay(messageDelay);

  // 发送完成事件，附带结果数据
  callback({
    type: "complete",
    data: {
      success: true,
      result: queryType === "defi" ? defiOpportunities : trendingTokenPools,
    },
  });

  // 确保打印日志
  console.log("模拟数据发送完成事件", {
    success: true,
    result: queryType === "defi" ? "defiOpportunities" : "trendingTokenPools",
  });
};

// 获取模拟数据
export const getMockData = (queryType: "defi" | "trending") => {
  return queryType === "defi" ? defiOpportunities : trendingTokenPools;
};

// 获取固定的模拟工作流步骤
export const getMockWorkflowSteps = () => {
  return workflowSteps.reduce(
    (acc, step) => {
      acc[step.stepId] = step;
      return acc;
    },
    {} as Record<string, any>
  );
};
