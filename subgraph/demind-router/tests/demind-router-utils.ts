import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  OwnershipTransferred,
  Swapped,
  TrustedTokenRemoved,
  UpdateMinFee,
  UpdatedExecutors,
  UpdatedFeeClaimer,
  UpdatedTrustedTokens
} from "../generated/DemindRouter/DemindRouter"

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createSwappedEvent(
  _tokenIn: Address,
  _tokenOut: Address,
  _amountIn: BigInt,
  _amountOut: BigInt
): Swapped {
  let swappedEvent = changetype<Swapped>(newMockEvent())

  swappedEvent.parameters = new Array()

  swappedEvent.parameters.push(
    new ethereum.EventParam("_tokenIn", ethereum.Value.fromAddress(_tokenIn))
  )
  swappedEvent.parameters.push(
    new ethereum.EventParam("_tokenOut", ethereum.Value.fromAddress(_tokenOut))
  )
  swappedEvent.parameters.push(
    new ethereum.EventParam(
      "_amountIn",
      ethereum.Value.fromUnsignedBigInt(_amountIn)
    )
  )
  swappedEvent.parameters.push(
    new ethereum.EventParam(
      "_amountOut",
      ethereum.Value.fromUnsignedBigInt(_amountOut)
    )
  )

  return swappedEvent
}

export function createTrustedTokenRemovedEvent(
  _trustedToken: Address
): TrustedTokenRemoved {
  let trustedTokenRemovedEvent = changetype<TrustedTokenRemoved>(newMockEvent())

  trustedTokenRemovedEvent.parameters = new Array()

  trustedTokenRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "_trustedToken",
      ethereum.Value.fromAddress(_trustedToken)
    )
  )

  return trustedTokenRemovedEvent
}

export function createUpdateMinFeeEvent(
  _oldMinFee: BigInt,
  _newMinFee: BigInt
): UpdateMinFee {
  let updateMinFeeEvent = changetype<UpdateMinFee>(newMockEvent())

  updateMinFeeEvent.parameters = new Array()

  updateMinFeeEvent.parameters.push(
    new ethereum.EventParam(
      "_oldMinFee",
      ethereum.Value.fromUnsignedBigInt(_oldMinFee)
    )
  )
  updateMinFeeEvent.parameters.push(
    new ethereum.EventParam(
      "_newMinFee",
      ethereum.Value.fromUnsignedBigInt(_newMinFee)
    )
  )

  return updateMinFeeEvent
}

export function createUpdatedExecutorsEvent(
  _newExecutors: Array<Address>
): UpdatedExecutors {
  let updatedExecutorsEvent = changetype<UpdatedExecutors>(newMockEvent())

  updatedExecutorsEvent.parameters = new Array()

  updatedExecutorsEvent.parameters.push(
    new ethereum.EventParam(
      "_newExecutors",
      ethereum.Value.fromAddressArray(_newExecutors)
    )
  )

  return updatedExecutorsEvent
}

export function createUpdatedFeeClaimerEvent(
  _oldFeeClaimer: Address,
  _newFeeClaimer: Address
): UpdatedFeeClaimer {
  let updatedFeeClaimerEvent = changetype<UpdatedFeeClaimer>(newMockEvent())

  updatedFeeClaimerEvent.parameters = new Array()

  updatedFeeClaimerEvent.parameters.push(
    new ethereum.EventParam(
      "_oldFeeClaimer",
      ethereum.Value.fromAddress(_oldFeeClaimer)
    )
  )
  updatedFeeClaimerEvent.parameters.push(
    new ethereum.EventParam(
      "_newFeeClaimer",
      ethereum.Value.fromAddress(_newFeeClaimer)
    )
  )

  return updatedFeeClaimerEvent
}

export function createUpdatedTrustedTokensEvent(
  _newTruestedTokens: Array<Address>
): UpdatedTrustedTokens {
  let updatedTrustedTokensEvent =
    changetype<UpdatedTrustedTokens>(newMockEvent())

  updatedTrustedTokensEvent.parameters = new Array()

  updatedTrustedTokensEvent.parameters.push(
    new ethereum.EventParam(
      "_newTruestedTokens",
      ethereum.Value.fromAddressArray(_newTruestedTokens)
    )
  )

  return updatedTrustedTokensEvent
}
