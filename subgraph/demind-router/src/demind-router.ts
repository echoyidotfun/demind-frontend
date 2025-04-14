import { BigDecimal, BigInt, Address, log } from "@graphprotocol/graph-ts";
import { Swapped } from "../generated/DemindRouter/DemindRouter";
import { ERC20 } from "../generated/DemindRouter/ERC20";
import {
  Swap,
  Token,
  DailyVolume,
  TokenDailyVolume,
} from "../generated/schema";
import { convertToDecimal, getDayId } from "./utils";

// 加载或创建Token实体
function getOrCreateToken(address: Address): Token {
  let token = Token.load(address.toHexString());

  if (!token) {
    token = new Token(address.toHexString());
    token.address = address;
    token.volumeTokenIn = BigInt.fromI32(0);
    token.volumeTokenOut = BigInt.fromI32(0);
    token.volumeUSD = BigDecimal.fromString("0");

    // 尝试从合约加载代币信息
    let erc20Contract = ERC20.bind(address);

    let nameResult = erc20Contract.try_name();
    if (!nameResult.reverted) {
      token.name = nameResult.value;
    }

    let symbolResult = erc20Contract.try_symbol();
    if (!symbolResult.reverted) {
      token.symbol = symbolResult.value;
    }

    let decimalsResult = erc20Contract.try_decimals();
    if (!decimalsResult.reverted) {
      token.decimals = decimalsResult.value;
    } else {
      token.decimals = 18; // 默认值
    }

    token.save();
  }

  return token;
}

// 获取或创建每日统计
function getOrCreateDailyVolume(timestamp: BigInt): DailyVolume {
  let dateId = getDayId(timestamp);
  let dailyVolume = DailyVolume.load(dateId);

  if (!dailyVolume) {
    dailyVolume = new DailyVolume(dateId);
    dailyVolume.date = dateId;
    dailyVolume.volumeIn = BigDecimal.fromString("0");
    dailyVolume.volumeOut = BigDecimal.fromString("0");
    dailyVolume.swapCount = BigInt.fromI32(0);
    dailyVolume.uniqueUsers = [];
    dailyVolume.save();
  }

  return dailyVolume;
}

// 获取或创建代币每日统计
function getOrCreateTokenDailyVolume(
  token: Token,
  dailyVolume: DailyVolume
): TokenDailyVolume {
  let id = token.id + "-" + dailyVolume.id;
  let tokenDailyVolume = TokenDailyVolume.load(id);

  if (!tokenDailyVolume) {
    tokenDailyVolume = new TokenDailyVolume(id);
    tokenDailyVolume.token = token.id;
    tokenDailyVolume.date = dailyVolume.date;
    tokenDailyVolume.dailyVolume = dailyVolume.id;
    tokenDailyVolume.volumeIn = BigDecimal.fromString("0");
    tokenDailyVolume.volumeOut = BigDecimal.fromString("0");
    tokenDailyVolume.save();
  }

  return tokenDailyVolume;
}

// 处理Swapped事件
export function handleSwapped(event: Swapped): void {
  // 创建唯一ID
  let id =
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString();

  // 加载或创建相关实体
  let tokenIn = getOrCreateToken(event.params._tokenIn);
  let tokenOut = getOrCreateToken(event.params._tokenOut);
  let dailyVolume = getOrCreateDailyVolume(event.block.timestamp);
  let tokenInDailyVolume = getOrCreateTokenDailyVolume(tokenIn, dailyVolume);
  let tokenOutDailyVolume = getOrCreateTokenDailyVolume(tokenOut, dailyVolume);

  // 转换金额
  let decimalsIn = tokenIn.decimals ? tokenIn.decimals : 18;
  let decimalsOut = tokenOut.decimals ? tokenOut.decimals : 18;

  let amountInDecimal = convertToDecimal(event.params._amountIn, decimalsIn);
  let amountOutDecimal = convertToDecimal(event.params._amountOut, decimalsOut);

  // 创建Swap实体
  let swap = new Swap(id);
  swap.tokenIn = tokenIn.id;
  swap.tokenOut = tokenOut.id;
  swap.amountIn = amountInDecimal;
  swap.amountOut = amountOutDecimal;
  swap.timestamp = event.block.timestamp;
  swap.date = dailyVolume.date;
  swap.sender = event.transaction.from;
  swap.txHash = event.transaction.hash;
  swap.blockNumber = event.block.number;
  swap.save();

  // 更新代币累计交易量
  tokenIn.volumeTokenIn = tokenIn.volumeTokenIn.plus(event.params._amountIn);
  tokenOut.volumeTokenOut = tokenOut.volumeTokenOut.plus(
    event.params._amountOut
  );
  tokenIn.volumeUSD = tokenIn.volumeUSD.plus(amountInDecimal);
  tokenOut.volumeUSD = tokenOut.volumeUSD.plus(amountOutDecimal);
  tokenIn.save();
  tokenOut.save();

  // 更新每日交易量
  dailyVolume.volumeIn = dailyVolume.volumeIn.plus(amountInDecimal);
  dailyVolume.volumeOut = dailyVolume.volumeOut.plus(amountOutDecimal);
  dailyVolume.swapCount = dailyVolume.swapCount.plus(BigInt.fromI32(1));

  // 处理唯一用户
  let senderString = event.transaction.from.toHexString();
  let uniqueUsers = dailyVolume.uniqueUsers;
  if (!uniqueUsers.includes(senderString)) {
    uniqueUsers.push(senderString);
    dailyVolume.uniqueUsers = uniqueUsers;
  }

  dailyVolume.save();

  // 更新代币每日交易量
  tokenInDailyVolume.volumeIn =
    tokenInDailyVolume.volumeIn.plus(amountInDecimal);
  tokenOutDailyVolume.volumeOut =
    tokenOutDailyVolume.volumeOut.plus(amountOutDecimal);
  tokenInDailyVolume.save();
  tokenOutDailyVolume.save();
}
