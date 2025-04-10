import { TokensProvider } from "@/lib/modules/tokens/TokensProvider";
import { PropsWithChildren } from "react";
import { PROJECT_CONFIG } from "@/lib/configs/getProjectConfig";
import { MagpieTokenApiVariables } from "@/lib/services/api/magpie/api.types";
import { GlobalChainToMagpieNetworkMap } from "@/lib/services/api/magpie/api.types";
import { GlobalToken } from "@/lib/modules/tokens/token.types";

// 为构建环境提供一份静态空数据
const EMPTY_TOKENS: GlobalToken[] = [];

/**
 * GlobalDataProvider - 服务器组件，用于获取并提供全局代币数据
 */
export function GlobalDataProvider({ children }: PropsWithChildren) {
  // 创建API请求变量
  const variables: MagpieTokenApiVariables = {
    networkNames: PROJECT_CONFIG.supportedNetworks.map(
      (network) => GlobalChainToMagpieNetworkMap[network]
    ),
    searchValue: "",
    exact: false,
    offset: 0,
  };

  // 使用空数据，让客户端组件处理数据加载
  // 这避免了Next.js构建时的动态fetch错误
  return (
    <TokensProvider tokensData={EMPTY_TOKENS} variables={variables}>
      {children}
    </TokensProvider>
  );
}
