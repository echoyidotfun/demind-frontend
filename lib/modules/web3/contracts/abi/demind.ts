import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DemindRouter
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const demindRouterAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_executors', internalType: 'address[]', type: 'address[]' },
      { name: '_trustedTokens', internalType: 'address[]', type: 'address[]' },
      { name: '_feeClaimer', internalType: 'address', type: 'address' },
      { name: '_wrappedNative', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'receive', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'FEE_CLIAIMER',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'FEE_DENOMINATOR',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_FEE',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'NAME',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'NATIVE',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'WNATIVE',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_executor', internalType: 'address', type: 'address' }],
    name: 'addExecutor',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_trustedToken', internalType: 'address', type: 'address' },
    ],
    name: 'addTrustedToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_executor', internalType: 'address', type: 'address' }],
    name: 'deleteExecutor',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_trustedToken', internalType: 'address', type: 'address' },
    ],
    name: 'deleteTrustedToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'executors',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'executorsCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_amountIn', internalType: 'uint256', type: 'uint256' },
      { name: '_tokenIn', internalType: 'address', type: 'address' },
      { name: '_tokenOut', internalType: 'address', type: 'address' },
      { name: '_maxSteps', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'findBestPath',
    outputs: [
      {
        name: '',
        internalType: 'struct FormattedRoute',
        type: 'tuple',
        components: [
          { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'executors', internalType: 'address[]', type: 'address[]' },
          { name: 'path', internalType: 'address[]', type: 'address[]' },
          { name: 'gasEstimate', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_amountIn', internalType: 'uint256', type: 'uint256' },
      { name: '_tokenIn', internalType: 'address', type: 'address' },
      { name: '_tokenOut', internalType: 'address', type: 'address' },
      { name: '_maxSteps', internalType: 'uint256', type: 'uint256' },
      { name: '_gasPrice', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'findBestPathWithGas',
    outputs: [
      {
        name: '',
        internalType: 'struct FormattedRoute',
        type: 'tuple',
        components: [
          { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'executors', internalType: 'address[]', type: 'address[]' },
          { name: 'path', internalType: 'address[]', type: 'address[]' },
          { name: 'gasEstimate', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_amountIn', internalType: 'uint256', type: 'uint256' },
      { name: '_tokenIn', internalType: 'address', type: 'address' },
      { name: '_tokenOut', internalType: 'address', type: 'address' },
      { name: '_index', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'queryExecutor',
    outputs: [{ name: 'amountOut', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_amountIn', internalType: 'uint256', type: 'uint256' },
      { name: '_tokenIn', internalType: 'address', type: 'address' },
      { name: '_tokenOut', internalType: 'address', type: 'address' },
      { name: '_options', internalType: 'uint8[]', type: 'uint8[]' },
    ],
    name: 'queryNoSplit',
    outputs: [
      {
        name: 'bestQuery',
        internalType: 'struct Query',
        type: 'tuple',
        components: [
          { name: 'executor', internalType: 'address', type: 'address' },
          { name: 'tokenIn', internalType: 'address', type: 'address' },
          { name: 'tokenOut', internalType: 'address', type: 'address' },
          { name: 'amountOut', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_amountIn', internalType: 'uint256', type: 'uint256' },
      { name: '_tokenIn', internalType: 'address', type: 'address' },
      { name: '_tokenOut', internalType: 'address', type: 'address' },
    ],
    name: 'queryNoSplit',
    outputs: [
      {
        name: 'bestQuery',
        internalType: 'struct Query',
        type: 'tuple',
        components: [
          { name: 'executor', internalType: 'address', type: 'address' },
          { name: 'tokenIn', internalType: 'address', type: 'address' },
          { name: 'tokenOut', internalType: 'address', type: 'address' },
          { name: 'amountOut', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_wrappedNative', internalType: 'address', type: 'address' },
    ],
    name: 'setAllowanceForWrapping',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_executors', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'setExecutors',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_feeClaimer', internalType: 'address', type: 'address' }],
    name: 'setFeeClaimer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_minFee', internalType: 'uint256', type: 'uint256' }],
    name: 'setMinFee',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_trustedTokens', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'setTrustedTokens',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_trade',
        internalType: 'struct TradeSummary',
        type: 'tuple',
        components: [
          { name: 'amountIn', internalType: 'uint256', type: 'uint256' },
          { name: 'amountOut', internalType: 'uint256', type: 'uint256' },
          { name: 'path', internalType: 'address[]', type: 'address[]' },
          { name: 'executors', internalType: 'address[]', type: 'address[]' },
        ],
      },
      { name: '_to', internalType: 'address', type: 'address' },
      { name: 'fee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'swapNoSplit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_trade',
        internalType: 'struct TradeSummary',
        type: 'tuple',
        components: [
          { name: 'amountIn', internalType: 'uint256', type: 'uint256' },
          { name: 'amountOut', internalType: 'uint256', type: 'uint256' },
          { name: 'path', internalType: 'address[]', type: 'address[]' },
          { name: 'executors', internalType: 'address[]', type: 'address[]' },
        ],
      },
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_fee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'swapNoSplitFromNative',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_trade',
        internalType: 'struct TradeSummary',
        type: 'tuple',
        components: [
          { name: 'amountIn', internalType: 'uint256', type: 'uint256' },
          { name: 'amountOut', internalType: 'uint256', type: 'uint256' },
          { name: 'path', internalType: 'address[]', type: 'address[]' },
          { name: 'executors', internalType: 'address[]', type: 'address[]' },
        ],
      },
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_fee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'swapNoSplitToNative',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'trustedTokens',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'trustedTokensCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_tokenIn',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_tokenOut',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_amountIn',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: '_amountOut',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Swapped',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_trustedToken',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'TrustedTokenRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_oldMinFee',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: '_newMinFee',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'UpdateMinFee',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_newExecutors',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
    ],
    name: 'UpdatedExecutors',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_oldFeeClaimer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: '_newFeeClaimer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'UpdatedFeeClaimer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_newTruestedTokens',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
    ],
    name: 'UpdatedTrustedTokens',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// erc20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20Abi = [
  {
    type: 'event',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'spender', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', type: 'address' },
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// yakRouter
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const yakRouterAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_adapters', internalType: 'address[]', type: 'address[]' },
      { name: '_trustedTokens', internalType: 'address[]', type: 'address[]' },
      { name: '_feeClaimer', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_asset',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Recovered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_newAdapters',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
    ],
    name: 'UpdatedAdapters',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_oldFeeClaimer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: '_newFeeClaimer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'UpdatedFeeClaimer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_oldMinFee',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: '_newMinFee',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'UpdatedMinFee',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_newTrustedTokens',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
    ],
    name: 'UpdatedTrustedTokens',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_tokenIn',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_tokenOut',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_amountIn',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: '_amountOut',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'YakSwap',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'ADAPTERS',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'AVAX',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'FEE_CLAIMER',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'FEE_DENOMINATOR',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_FEE',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'NAME',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'TRUSTED_TOKENS',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'WAVAX',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'adaptersCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_amountIn', internalType: 'uint256', type: 'uint256' },
      { name: '_tokenIn', internalType: 'address', type: 'address' },
      { name: '_tokenOut', internalType: 'address', type: 'address' },
      { name: '_maxSteps', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'findBestPath',
    outputs: [
      {
        name: '',
        internalType: 'struct YakRouter.FormattedOffer',
        type: 'tuple',
        components: [
          { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'adapters', internalType: 'address[]', type: 'address[]' },
          { name: 'path', internalType: 'address[]', type: 'address[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_amountIn', internalType: 'uint256', type: 'uint256' },
      { name: '_tokenIn', internalType: 'address', type: 'address' },
      { name: '_tokenOut', internalType: 'address', type: 'address' },
      { name: '_maxSteps', internalType: 'uint256', type: 'uint256' },
      { name: '_gasPrice', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'findBestPathWithGas',
    outputs: [
      {
        name: '',
        internalType: 'struct YakRouter.FormattedOfferWithGas',
        type: 'tuple',
        components: [
          { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'adapters', internalType: 'address[]', type: 'address[]' },
          { name: 'path', internalType: 'address[]', type: 'address[]' },
          { name: 'gasEstimate', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_amountIn', internalType: 'uint256', type: 'uint256' },
      { name: '_tokenIn', internalType: 'address', type: 'address' },
      { name: '_tokenOut', internalType: 'address', type: 'address' },
      { name: '_index', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'queryAdapter',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_amountIn', internalType: 'uint256', type: 'uint256' },
      { name: '_tokenIn', internalType: 'address', type: 'address' },
      { name: '_tokenOut', internalType: 'address', type: 'address' },
      { name: '_options', internalType: 'uint8[]', type: 'uint8[]' },
    ],
    name: 'queryNoSplit',
    outputs: [
      {
        name: '',
        internalType: 'struct YakRouter.Query',
        type: 'tuple',
        components: [
          { name: 'adapter', internalType: 'address', type: 'address' },
          { name: 'tokenIn', internalType: 'address', type: 'address' },
          { name: 'tokenOut', internalType: 'address', type: 'address' },
          { name: 'amountOut', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_amountIn', internalType: 'uint256', type: 'uint256' },
      { name: '_tokenIn', internalType: 'address', type: 'address' },
      { name: '_tokenOut', internalType: 'address', type: 'address' },
    ],
    name: 'queryNoSplit',
    outputs: [
      {
        name: '',
        internalType: 'struct YakRouter.Query',
        type: 'tuple',
        components: [
          { name: 'adapter', internalType: 'address', type: 'address' },
          { name: 'tokenIn', internalType: 'address', type: 'address' },
          { name: 'tokenOut', internalType: 'address', type: 'address' },
          { name: 'amountOut', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'recoverAVAX',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_tokenAddress', internalType: 'address', type: 'address' },
      { name: '_tokenAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'recoverERC20',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_adapters', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'setAdapters',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_claimer', internalType: 'address', type: 'address' }],
    name: 'setFeeClaimer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_fee', internalType: 'uint256', type: 'uint256' }],
    name: 'setMinFee',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_trustedTokens', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'setTrustedTokens',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_trade',
        internalType: 'struct YakRouter.Trade',
        type: 'tuple',
        components: [
          { name: 'amountIn', internalType: 'uint256', type: 'uint256' },
          { name: 'amountOut', internalType: 'uint256', type: 'uint256' },
          { name: 'path', internalType: 'address[]', type: 'address[]' },
          { name: 'adapters', internalType: 'address[]', type: 'address[]' },
        ],
      },
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_fee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'swapNoSplit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_trade',
        internalType: 'struct YakRouter.Trade',
        type: 'tuple',
        components: [
          { name: 'amountIn', internalType: 'uint256', type: 'uint256' },
          { name: 'amountOut', internalType: 'uint256', type: 'uint256' },
          { name: 'path', internalType: 'address[]', type: 'address[]' },
          { name: 'adapters', internalType: 'address[]', type: 'address[]' },
        ],
      },
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_fee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'swapNoSplitFromAVAX',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_trade',
        internalType: 'struct YakRouter.Trade',
        type: 'tuple',
        components: [
          { name: 'amountIn', internalType: 'uint256', type: 'uint256' },
          { name: 'amountOut', internalType: 'uint256', type: 'uint256' },
          { name: 'path', internalType: 'address[]', type: 'address[]' },
          { name: 'adapters', internalType: 'address[]', type: 'address[]' },
        ],
      },
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_fee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'swapNoSplitToAVAX',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_trade',
        internalType: 'struct YakRouter.Trade',
        type: 'tuple',
        components: [
          { name: 'amountIn', internalType: 'uint256', type: 'uint256' },
          { name: 'amountOut', internalType: 'uint256', type: 'uint256' },
          { name: 'path', internalType: 'address[]', type: 'address[]' },
          { name: 'adapters', internalType: 'address[]', type: 'address[]' },
        ],
      },
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_fee', internalType: 'uint256', type: 'uint256' },
      { name: '_deadline', internalType: 'uint256', type: 'uint256' },
      { name: '_v', internalType: 'uint8', type: 'uint8' },
      { name: '_r', internalType: 'bytes32', type: 'bytes32' },
      { name: '_s', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'swapNoSplitToAVAXWithPermit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_trade',
        internalType: 'struct YakRouter.Trade',
        type: 'tuple',
        components: [
          { name: 'amountIn', internalType: 'uint256', type: 'uint256' },
          { name: 'amountOut', internalType: 'uint256', type: 'uint256' },
          { name: 'path', internalType: 'address[]', type: 'address[]' },
          { name: 'adapters', internalType: 'address[]', type: 'address[]' },
        ],
      },
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_fee', internalType: 'uint256', type: 'uint256' },
      { name: '_deadline', internalType: 'uint256', type: 'uint256' },
      { name: '_v', internalType: 'uint8', type: 'uint8' },
      { name: '_r', internalType: 'bytes32', type: 'bytes32' },
      { name: '_s', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'swapNoSplitWithPermit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'trustedTokensCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link demindRouterAbi}__
 */
export const useReadDemindRouter = /*#__PURE__*/ createUseReadContract({
  abi: demindRouterAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"FEE_CLIAIMER"`
 */
export const useReadDemindRouterFeeCliaimer =
  /*#__PURE__*/ createUseReadContract({
    abi: demindRouterAbi,
    functionName: 'FEE_CLIAIMER',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"FEE_DENOMINATOR"`
 */
export const useReadDemindRouterFeeDenominator =
  /*#__PURE__*/ createUseReadContract({
    abi: demindRouterAbi,
    functionName: 'FEE_DENOMINATOR',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"MIN_FEE"`
 */
export const useReadDemindRouterMinFee = /*#__PURE__*/ createUseReadContract({
  abi: demindRouterAbi,
  functionName: 'MIN_FEE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"NAME"`
 */
export const useReadDemindRouterName = /*#__PURE__*/ createUseReadContract({
  abi: demindRouterAbi,
  functionName: 'NAME',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"NATIVE"`
 */
export const useReadDemindRouterNative = /*#__PURE__*/ createUseReadContract({
  abi: demindRouterAbi,
  functionName: 'NATIVE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"WNATIVE"`
 */
export const useReadDemindRouterWnative = /*#__PURE__*/ createUseReadContract({
  abi: demindRouterAbi,
  functionName: 'WNATIVE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"executors"`
 */
export const useReadDemindRouterExecutors = /*#__PURE__*/ createUseReadContract(
  { abi: demindRouterAbi, functionName: 'executors' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"executorsCount"`
 */
export const useReadDemindRouterExecutorsCount =
  /*#__PURE__*/ createUseReadContract({
    abi: demindRouterAbi,
    functionName: 'executorsCount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"findBestPath"`
 */
export const useReadDemindRouterFindBestPath =
  /*#__PURE__*/ createUseReadContract({
    abi: demindRouterAbi,
    functionName: 'findBestPath',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"findBestPathWithGas"`
 */
export const useReadDemindRouterFindBestPathWithGas =
  /*#__PURE__*/ createUseReadContract({
    abi: demindRouterAbi,
    functionName: 'findBestPathWithGas',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"owner"`
 */
export const useReadDemindRouterOwner = /*#__PURE__*/ createUseReadContract({
  abi: demindRouterAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"queryExecutor"`
 */
export const useReadDemindRouterQueryExecutor =
  /*#__PURE__*/ createUseReadContract({
    abi: demindRouterAbi,
    functionName: 'queryExecutor',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"queryNoSplit"`
 */
export const useReadDemindRouterQueryNoSplit =
  /*#__PURE__*/ createUseReadContract({
    abi: demindRouterAbi,
    functionName: 'queryNoSplit',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"trustedTokens"`
 */
export const useReadDemindRouterTrustedTokens =
  /*#__PURE__*/ createUseReadContract({
    abi: demindRouterAbi,
    functionName: 'trustedTokens',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"trustedTokensCount"`
 */
export const useReadDemindRouterTrustedTokensCount =
  /*#__PURE__*/ createUseReadContract({
    abi: demindRouterAbi,
    functionName: 'trustedTokensCount',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link demindRouterAbi}__
 */
export const useWriteDemindRouter = /*#__PURE__*/ createUseWriteContract({
  abi: demindRouterAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"addExecutor"`
 */
export const useWriteDemindRouterAddExecutor =
  /*#__PURE__*/ createUseWriteContract({
    abi: demindRouterAbi,
    functionName: 'addExecutor',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"addTrustedToken"`
 */
export const useWriteDemindRouterAddTrustedToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: demindRouterAbi,
    functionName: 'addTrustedToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"deleteExecutor"`
 */
export const useWriteDemindRouterDeleteExecutor =
  /*#__PURE__*/ createUseWriteContract({
    abi: demindRouterAbi,
    functionName: 'deleteExecutor',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"deleteTrustedToken"`
 */
export const useWriteDemindRouterDeleteTrustedToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: demindRouterAbi,
    functionName: 'deleteTrustedToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteDemindRouterRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: demindRouterAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"setAllowanceForWrapping"`
 */
export const useWriteDemindRouterSetAllowanceForWrapping =
  /*#__PURE__*/ createUseWriteContract({
    abi: demindRouterAbi,
    functionName: 'setAllowanceForWrapping',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"setExecutors"`
 */
export const useWriteDemindRouterSetExecutors =
  /*#__PURE__*/ createUseWriteContract({
    abi: demindRouterAbi,
    functionName: 'setExecutors',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"setFeeClaimer"`
 */
export const useWriteDemindRouterSetFeeClaimer =
  /*#__PURE__*/ createUseWriteContract({
    abi: demindRouterAbi,
    functionName: 'setFeeClaimer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"setMinFee"`
 */
export const useWriteDemindRouterSetMinFee =
  /*#__PURE__*/ createUseWriteContract({
    abi: demindRouterAbi,
    functionName: 'setMinFee',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"setTrustedTokens"`
 */
export const useWriteDemindRouterSetTrustedTokens =
  /*#__PURE__*/ createUseWriteContract({
    abi: demindRouterAbi,
    functionName: 'setTrustedTokens',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"swapNoSplit"`
 */
export const useWriteDemindRouterSwapNoSplit =
  /*#__PURE__*/ createUseWriteContract({
    abi: demindRouterAbi,
    functionName: 'swapNoSplit',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"swapNoSplitFromNative"`
 */
export const useWriteDemindRouterSwapNoSplitFromNative =
  /*#__PURE__*/ createUseWriteContract({
    abi: demindRouterAbi,
    functionName: 'swapNoSplitFromNative',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"swapNoSplitToNative"`
 */
export const useWriteDemindRouterSwapNoSplitToNative =
  /*#__PURE__*/ createUseWriteContract({
    abi: demindRouterAbi,
    functionName: 'swapNoSplitToNative',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteDemindRouterTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: demindRouterAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link demindRouterAbi}__
 */
export const useSimulateDemindRouter = /*#__PURE__*/ createUseSimulateContract({
  abi: demindRouterAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"addExecutor"`
 */
export const useSimulateDemindRouterAddExecutor =
  /*#__PURE__*/ createUseSimulateContract({
    abi: demindRouterAbi,
    functionName: 'addExecutor',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"addTrustedToken"`
 */
export const useSimulateDemindRouterAddTrustedToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: demindRouterAbi,
    functionName: 'addTrustedToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"deleteExecutor"`
 */
export const useSimulateDemindRouterDeleteExecutor =
  /*#__PURE__*/ createUseSimulateContract({
    abi: demindRouterAbi,
    functionName: 'deleteExecutor',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"deleteTrustedToken"`
 */
export const useSimulateDemindRouterDeleteTrustedToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: demindRouterAbi,
    functionName: 'deleteTrustedToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateDemindRouterRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: demindRouterAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"setAllowanceForWrapping"`
 */
export const useSimulateDemindRouterSetAllowanceForWrapping =
  /*#__PURE__*/ createUseSimulateContract({
    abi: demindRouterAbi,
    functionName: 'setAllowanceForWrapping',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"setExecutors"`
 */
export const useSimulateDemindRouterSetExecutors =
  /*#__PURE__*/ createUseSimulateContract({
    abi: demindRouterAbi,
    functionName: 'setExecutors',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"setFeeClaimer"`
 */
export const useSimulateDemindRouterSetFeeClaimer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: demindRouterAbi,
    functionName: 'setFeeClaimer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"setMinFee"`
 */
export const useSimulateDemindRouterSetMinFee =
  /*#__PURE__*/ createUseSimulateContract({
    abi: demindRouterAbi,
    functionName: 'setMinFee',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"setTrustedTokens"`
 */
export const useSimulateDemindRouterSetTrustedTokens =
  /*#__PURE__*/ createUseSimulateContract({
    abi: demindRouterAbi,
    functionName: 'setTrustedTokens',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"swapNoSplit"`
 */
export const useSimulateDemindRouterSwapNoSplit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: demindRouterAbi,
    functionName: 'swapNoSplit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"swapNoSplitFromNative"`
 */
export const useSimulateDemindRouterSwapNoSplitFromNative =
  /*#__PURE__*/ createUseSimulateContract({
    abi: demindRouterAbi,
    functionName: 'swapNoSplitFromNative',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"swapNoSplitToNative"`
 */
export const useSimulateDemindRouterSwapNoSplitToNative =
  /*#__PURE__*/ createUseSimulateContract({
    abi: demindRouterAbi,
    functionName: 'swapNoSplitToNative',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link demindRouterAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateDemindRouterTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: demindRouterAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link demindRouterAbi}__
 */
export const useWatchDemindRouterEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: demindRouterAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link demindRouterAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchDemindRouterOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: demindRouterAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link demindRouterAbi}__ and `eventName` set to `"Swapped"`
 */
export const useWatchDemindRouterSwappedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: demindRouterAbi,
    eventName: 'Swapped',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link demindRouterAbi}__ and `eventName` set to `"TrustedTokenRemoved"`
 */
export const useWatchDemindRouterTrustedTokenRemovedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: demindRouterAbi,
    eventName: 'TrustedTokenRemoved',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link demindRouterAbi}__ and `eventName` set to `"UpdateMinFee"`
 */
export const useWatchDemindRouterUpdateMinFeeEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: demindRouterAbi,
    eventName: 'UpdateMinFee',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link demindRouterAbi}__ and `eventName` set to `"UpdatedExecutors"`
 */
export const useWatchDemindRouterUpdatedExecutorsEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: demindRouterAbi,
    eventName: 'UpdatedExecutors',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link demindRouterAbi}__ and `eventName` set to `"UpdatedFeeClaimer"`
 */
export const useWatchDemindRouterUpdatedFeeClaimerEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: demindRouterAbi,
    eventName: 'UpdatedFeeClaimer',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link demindRouterAbi}__ and `eventName` set to `"UpdatedTrustedTokens"`
 */
export const useWatchDemindRouterUpdatedTrustedTokensEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: demindRouterAbi,
    eventName: 'UpdatedTrustedTokens',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const useReadErc20 = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"allowance"`
 */
export const useReadErc20Allowance = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadErc20BalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"decimals"`
 */
export const useReadErc20Decimals = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"name"`
 */
export const useReadErc20Name = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"symbol"`
 */
export const useReadErc20Symbol = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadErc20TotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const useWriteErc20 = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const useWriteErc20Approve = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useWriteErc20Transfer = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteErc20TransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const useSimulateErc20 = /*#__PURE__*/ createUseSimulateContract({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const useSimulateErc20Approve = /*#__PURE__*/ createUseSimulateContract({
  abi: erc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateErc20Transfer = /*#__PURE__*/ createUseSimulateContract(
  { abi: erc20Abi, functionName: 'transfer' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateErc20TransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc20Abi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20Abi}__
 */
export const useWatchErc20Event = /*#__PURE__*/ createUseWatchContractEvent({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Approval"`
 */
export const useWatchErc20ApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc20Abi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchErc20TransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc20Abi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link yakRouterAbi}__
 */
export const useReadYakRouter = /*#__PURE__*/ createUseReadContract({
  abi: yakRouterAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"ADAPTERS"`
 */
export const useReadYakRouterAdapters = /*#__PURE__*/ createUseReadContract({
  abi: yakRouterAbi,
  functionName: 'ADAPTERS',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"AVAX"`
 */
export const useReadYakRouterAvax = /*#__PURE__*/ createUseReadContract({
  abi: yakRouterAbi,
  functionName: 'AVAX',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"FEE_CLAIMER"`
 */
export const useReadYakRouterFeeClaimer = /*#__PURE__*/ createUseReadContract({
  abi: yakRouterAbi,
  functionName: 'FEE_CLAIMER',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"FEE_DENOMINATOR"`
 */
export const useReadYakRouterFeeDenominator =
  /*#__PURE__*/ createUseReadContract({
    abi: yakRouterAbi,
    functionName: 'FEE_DENOMINATOR',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"MIN_FEE"`
 */
export const useReadYakRouterMinFee = /*#__PURE__*/ createUseReadContract({
  abi: yakRouterAbi,
  functionName: 'MIN_FEE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"NAME"`
 */
export const useReadYakRouterName = /*#__PURE__*/ createUseReadContract({
  abi: yakRouterAbi,
  functionName: 'NAME',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"TRUSTED_TOKENS"`
 */
export const useReadYakRouterTrustedTokens =
  /*#__PURE__*/ createUseReadContract({
    abi: yakRouterAbi,
    functionName: 'TRUSTED_TOKENS',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"WAVAX"`
 */
export const useReadYakRouterWavax = /*#__PURE__*/ createUseReadContract({
  abi: yakRouterAbi,
  functionName: 'WAVAX',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"adaptersCount"`
 */
export const useReadYakRouterAdaptersCount =
  /*#__PURE__*/ createUseReadContract({
    abi: yakRouterAbi,
    functionName: 'adaptersCount',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"findBestPath"`
 */
export const useReadYakRouterFindBestPath = /*#__PURE__*/ createUseReadContract(
  { abi: yakRouterAbi, functionName: 'findBestPath' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"findBestPathWithGas"`
 */
export const useReadYakRouterFindBestPathWithGas =
  /*#__PURE__*/ createUseReadContract({
    abi: yakRouterAbi,
    functionName: 'findBestPathWithGas',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"owner"`
 */
export const useReadYakRouterOwner = /*#__PURE__*/ createUseReadContract({
  abi: yakRouterAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"queryAdapter"`
 */
export const useReadYakRouterQueryAdapter = /*#__PURE__*/ createUseReadContract(
  { abi: yakRouterAbi, functionName: 'queryAdapter' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"queryNoSplit"`
 */
export const useReadYakRouterQueryNoSplit = /*#__PURE__*/ createUseReadContract(
  { abi: yakRouterAbi, functionName: 'queryNoSplit' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"trustedTokensCount"`
 */
export const useReadYakRouterTrustedTokensCount =
  /*#__PURE__*/ createUseReadContract({
    abi: yakRouterAbi,
    functionName: 'trustedTokensCount',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link yakRouterAbi}__
 */
export const useWriteYakRouter = /*#__PURE__*/ createUseWriteContract({
  abi: yakRouterAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"recoverAVAX"`
 */
export const useWriteYakRouterRecoverAvax =
  /*#__PURE__*/ createUseWriteContract({
    abi: yakRouterAbi,
    functionName: 'recoverAVAX',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"recoverERC20"`
 */
export const useWriteYakRouterRecoverErc20 =
  /*#__PURE__*/ createUseWriteContract({
    abi: yakRouterAbi,
    functionName: 'recoverERC20',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteYakRouterRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: yakRouterAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"setAdapters"`
 */
export const useWriteYakRouterSetAdapters =
  /*#__PURE__*/ createUseWriteContract({
    abi: yakRouterAbi,
    functionName: 'setAdapters',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"setFeeClaimer"`
 */
export const useWriteYakRouterSetFeeClaimer =
  /*#__PURE__*/ createUseWriteContract({
    abi: yakRouterAbi,
    functionName: 'setFeeClaimer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"setMinFee"`
 */
export const useWriteYakRouterSetMinFee = /*#__PURE__*/ createUseWriteContract({
  abi: yakRouterAbi,
  functionName: 'setMinFee',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"setTrustedTokens"`
 */
export const useWriteYakRouterSetTrustedTokens =
  /*#__PURE__*/ createUseWriteContract({
    abi: yakRouterAbi,
    functionName: 'setTrustedTokens',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"swapNoSplit"`
 */
export const useWriteYakRouterSwapNoSplit =
  /*#__PURE__*/ createUseWriteContract({
    abi: yakRouterAbi,
    functionName: 'swapNoSplit',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"swapNoSplitFromAVAX"`
 */
export const useWriteYakRouterSwapNoSplitFromAvax =
  /*#__PURE__*/ createUseWriteContract({
    abi: yakRouterAbi,
    functionName: 'swapNoSplitFromAVAX',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"swapNoSplitToAVAX"`
 */
export const useWriteYakRouterSwapNoSplitToAvax =
  /*#__PURE__*/ createUseWriteContract({
    abi: yakRouterAbi,
    functionName: 'swapNoSplitToAVAX',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"swapNoSplitToAVAXWithPermit"`
 */
export const useWriteYakRouterSwapNoSplitToAvaxWithPermit =
  /*#__PURE__*/ createUseWriteContract({
    abi: yakRouterAbi,
    functionName: 'swapNoSplitToAVAXWithPermit',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"swapNoSplitWithPermit"`
 */
export const useWriteYakRouterSwapNoSplitWithPermit =
  /*#__PURE__*/ createUseWriteContract({
    abi: yakRouterAbi,
    functionName: 'swapNoSplitWithPermit',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteYakRouterTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: yakRouterAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link yakRouterAbi}__
 */
export const useSimulateYakRouter = /*#__PURE__*/ createUseSimulateContract({
  abi: yakRouterAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"recoverAVAX"`
 */
export const useSimulateYakRouterRecoverAvax =
  /*#__PURE__*/ createUseSimulateContract({
    abi: yakRouterAbi,
    functionName: 'recoverAVAX',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"recoverERC20"`
 */
export const useSimulateYakRouterRecoverErc20 =
  /*#__PURE__*/ createUseSimulateContract({
    abi: yakRouterAbi,
    functionName: 'recoverERC20',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateYakRouterRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: yakRouterAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"setAdapters"`
 */
export const useSimulateYakRouterSetAdapters =
  /*#__PURE__*/ createUseSimulateContract({
    abi: yakRouterAbi,
    functionName: 'setAdapters',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"setFeeClaimer"`
 */
export const useSimulateYakRouterSetFeeClaimer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: yakRouterAbi,
    functionName: 'setFeeClaimer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"setMinFee"`
 */
export const useSimulateYakRouterSetMinFee =
  /*#__PURE__*/ createUseSimulateContract({
    abi: yakRouterAbi,
    functionName: 'setMinFee',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"setTrustedTokens"`
 */
export const useSimulateYakRouterSetTrustedTokens =
  /*#__PURE__*/ createUseSimulateContract({
    abi: yakRouterAbi,
    functionName: 'setTrustedTokens',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"swapNoSplit"`
 */
export const useSimulateYakRouterSwapNoSplit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: yakRouterAbi,
    functionName: 'swapNoSplit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"swapNoSplitFromAVAX"`
 */
export const useSimulateYakRouterSwapNoSplitFromAvax =
  /*#__PURE__*/ createUseSimulateContract({
    abi: yakRouterAbi,
    functionName: 'swapNoSplitFromAVAX',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"swapNoSplitToAVAX"`
 */
export const useSimulateYakRouterSwapNoSplitToAvax =
  /*#__PURE__*/ createUseSimulateContract({
    abi: yakRouterAbi,
    functionName: 'swapNoSplitToAVAX',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"swapNoSplitToAVAXWithPermit"`
 */
export const useSimulateYakRouterSwapNoSplitToAvaxWithPermit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: yakRouterAbi,
    functionName: 'swapNoSplitToAVAXWithPermit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"swapNoSplitWithPermit"`
 */
export const useSimulateYakRouterSwapNoSplitWithPermit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: yakRouterAbi,
    functionName: 'swapNoSplitWithPermit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link yakRouterAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateYakRouterTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: yakRouterAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link yakRouterAbi}__
 */
export const useWatchYakRouterEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: yakRouterAbi },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link yakRouterAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchYakRouterOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: yakRouterAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link yakRouterAbi}__ and `eventName` set to `"Recovered"`
 */
export const useWatchYakRouterRecoveredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: yakRouterAbi,
    eventName: 'Recovered',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link yakRouterAbi}__ and `eventName` set to `"UpdatedAdapters"`
 */
export const useWatchYakRouterUpdatedAdaptersEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: yakRouterAbi,
    eventName: 'UpdatedAdapters',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link yakRouterAbi}__ and `eventName` set to `"UpdatedFeeClaimer"`
 */
export const useWatchYakRouterUpdatedFeeClaimerEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: yakRouterAbi,
    eventName: 'UpdatedFeeClaimer',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link yakRouterAbi}__ and `eventName` set to `"UpdatedMinFee"`
 */
export const useWatchYakRouterUpdatedMinFeeEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: yakRouterAbi,
    eventName: 'UpdatedMinFee',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link yakRouterAbi}__ and `eventName` set to `"UpdatedTrustedTokens"`
 */
export const useWatchYakRouterUpdatedTrustedTokensEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: yakRouterAbi,
    eventName: 'UpdatedTrustedTokens',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link yakRouterAbi}__ and `eventName` set to `"YakSwap"`
 */
export const useWatchYakRouterYakSwapEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: yakRouterAbi,
    eventName: 'YakSwap',
  })
