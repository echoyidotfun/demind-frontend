import {
  OwnershipTransferred as OwnershipTransferredEvent,
  Swapped as SwappedEvent,
  TrustedTokenRemoved as TrustedTokenRemovedEvent,
  UpdateMinFee as UpdateMinFeeEvent,
  UpdatedExecutors as UpdatedExecutorsEvent,
  UpdatedFeeClaimer as UpdatedFeeClaimerEvent,
  UpdatedTrustedTokens as UpdatedTrustedTokensEvent
} from "../generated/DemindRouter/DemindRouter"
import {
  OwnershipTransferred,
  Swapped,
  TrustedTokenRemoved,
  UpdateMinFee,
  UpdatedExecutors,
  UpdatedFeeClaimer,
  UpdatedTrustedTokens
} from "../generated/schema"
import { Bytes } from "@graphprotocol/graph-ts"

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSwapped(event: SwappedEvent): void {
  let entity = new Swapped(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._tokenIn = event.params._tokenIn
  entity._tokenOut = event.params._tokenOut
  entity._amountIn = event.params._amountIn
  entity._amountOut = event.params._amountOut

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTrustedTokenRemoved(
  event: TrustedTokenRemovedEvent
): void {
  let entity = new TrustedTokenRemoved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._trustedToken = event.params._trustedToken

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdateMinFee(event: UpdateMinFeeEvent): void {
  let entity = new UpdateMinFee(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._oldMinFee = event.params._oldMinFee
  entity._newMinFee = event.params._newMinFee

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdatedExecutors(event: UpdatedExecutorsEvent): void {
  let entity = new UpdatedExecutors(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._newExecutors = changetype<Bytes[]>(event.params._newExecutors)

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdatedFeeClaimer(event: UpdatedFeeClaimerEvent): void {
  let entity = new UpdatedFeeClaimer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._oldFeeClaimer = event.params._oldFeeClaimer
  entity._newFeeClaimer = event.params._newFeeClaimer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdatedTrustedTokens(
  event: UpdatedTrustedTokensEvent
): void {
  let entity = new UpdatedTrustedTokens(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._newTruestedTokens = changetype<Bytes[]>(
    event.params._newTruestedTokens
  )

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
