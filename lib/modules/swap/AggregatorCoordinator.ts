import {
  SimulateSwapInputs,
  RouterApiSimulateSwapResponse,
  BuildSwapInputs,
} from "./swap.types";
import { AggregatorSwapHandler } from "./handlers/Swap.handler";
import { GlobalChain } from "@/lib/services/api/magpie/api.types";
import { TransactionConfig } from "../web3/contracts/contract.types";

export class AggregatorCoordinator implements AggregatorSwapHandler {
  name = "AggregatorCoordinator";
  isAggregator = true as const;
  private handlers: AggregatorSwapHandler[] = [];
  private lastUsedHandler: AggregatorSwapHandler | null = null;

  constructor(handlers: AggregatorSwapHandler[] = []) {
    this.handlers = handlers;
  }

  registerHandler(handler: AggregatorSwapHandler) {
    this.handlers.push(handler);
  }
  async simulate(
    inputs: SimulateSwapInputs
  ): Promise<RouterApiSimulateSwapResponse> {
    const availableHandlers = this.handlers.filter((handler) => {
      if (typeof handler.isAvailable === "function") {
        return handler.isAvailable(inputs.chain);
      }
      return true; // 假设默认可用
    });

    if (availableHandlers.length === 0) {
      throw new Error(`No available swap handlers for chain ${inputs.chain}`);
    }

    // 对单一聚合器的简单情况做优化
    if (availableHandlers.length === 1) {
      this.lastUsedHandler = availableHandlers[0];
      return availableHandlers[0].simulate(inputs);
    }

    // 并行请求所有可用聚合器
    const quotesPromises = availableHandlers.map(async (handler) => {
      try {
        const result = await handler.simulate(inputs);
        return {
          handler,
          result,
        };
      } catch (error) {
        console.error(`Error getting quote from ${handler.name}:`, error);
        return null;
      }
    });

    const results = await Promise.all(quotesPromises);
    const validResults = results.filter(Boolean) as {
      handler: AggregatorSwapHandler;
      result: RouterApiSimulateSwapResponse;
    }[];

    if (validResults.length === 0) {
      throw new Error("No quotes available for the requested swap");
    }

    // 根据returnAmount选择最佳报价
    const best = validResults.reduce((best, current) => {
      // 对于exactIn类型，选择returnAmount最大的
      const bestAmount = BigInt(best.result.returnAmount);
      const currentAmount = BigInt(current.result.returnAmount);

      return currentAmount > bestAmount ? current : best;
    });

    // 保存最后使用的handler，以便在build阶段使用
    this.lastUsedHandler = best.handler;

    // 在结果中添加提供者信息
    return {
      ...best.result,
      provider: best.handler.name,
    };
  }

  async isAvailable(chain: GlobalChain): Promise<boolean> {
    // 只要有一个handler可用，coordinator就可用
    const availabilityPromises = this.handlers.map((handler) => {
      if (typeof handler.isAvailable === "function") {
        const result = handler.isAvailable(chain);
        return result instanceof Promise ? result : Promise.resolve(result);
      }
      return Promise.resolve(true);
    });

    const availabilities = await Promise.all(availabilityPromises);
    return availabilities.some((available) => available);
  }

  async build(inputs: BuildSwapInputs): Promise<TransactionConfig> {
    // 使用上次模拟时选择的handler
    if (!this.lastUsedHandler) {
      throw new Error("No handler available for build. Call simulate first.");
    }

    return await this.lastUsedHandler.build(inputs);
  }

  async getAllQuotes(
    inputs: SimulateSwapInputs
  ): Promise<RouterApiSimulateSwapResponse[]> {
    const availableHandlers = this.handlers.filter((handler) => {
      if (typeof handler.isAvailable === "function") {
        return handler.isAvailable(inputs.chain);
      }
      return true;
    });

    // 并行请求所有可用聚合器
    const quotesPromises = availableHandlers.map(async (handler) => {
      try {
        const result = await handler.simulate(inputs);
        return {
          ...result,
          provider: handler.name,
        };
      } catch (error) {
        console.error(`Error getting quote from ${handler.name}:`, error);
        return null;
      }
    });

    const results = await Promise.all(quotesPromises);
    return results.filter(Boolean) as RouterApiSimulateSwapResponse[];
  }
}
