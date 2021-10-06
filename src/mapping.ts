import { log } from "@graphprotocol/graph-ts"
import {
  OrderApprovedPartOne,
  OrderApprovedPartTwo,
  OrderCancelled,
  OrdersMatched,
  OwnershipRenounced,
  OwnershipTransferred
} from "../generated/openseaWyvernExchange/openseaWyvernExchange"
import { Order } from "../generated/schema"

import {
  accounts,
  assetOwners,
  assets,
  balances,
  blocks,
  events,
  orders,
  shared,
  timeSeries,
  tokens,
  transactions
} from "./modules"

export function handleOrderApprovedPartOne(event: OrderApprovedPartOne): void {
  let order = orders.getOrCreateOrder(event.params.hash.toHex())

  // 	shared.helpers.handleEvmMetadata(event)
  //  won't be used as block and tx are needed in scope



  let timestamp = event.block.timestamp
  // TODO handle minute and so on
  let minuteEpoch = shared.date.truncateMinutes(timestamp)
  let minute = timeSeries.minutes.getOrCreateMinute(minuteEpoch)
  minute.save()
  order.minute = minute.id

  let hourEpoch = shared.date.truncateHours(timestamp)
  let hour = timeSeries.hours.getOrCreateHour(hourEpoch)
  hour.save()
  order.hour = hour.id

  let dayEpoch = shared.date.truncateDays(timestamp)
  let day = timeSeries.days.getOrCreateDay(dayEpoch)
  day.save()
  order.day = day.id

  let weekEpoch = shared.date.truncateWeeks(timestamp)
  let week = timeSeries.weeks.getOrCreateWeek(weekEpoch)
  week.save()
  order.week = week.id

  let blockId = event.block.number.toString()
  let txHash = event.transaction.hash
  let txId = txHash.toHex()

  // TODO relate transactions to time series
  let transaction = transactions.getOrCreateTransactionMeta(
    txId,
    blockId,
    txHash,
    event.transaction.from,
    event.transaction.gasPrice,
  )
  transaction.minute = minute.id
  transaction.hour = hour.id
  transaction.day = day.id
  transaction.week = week.id
  transaction.save()
  order.transaction = txId

  let block = blocks.services.getOrCreateBlock(blockId, event.block.timestamp, event.block.number)
  block.minute = minute.id
  block.hour = hour.id
  block.day = day.id
  block.week = week.id
  block.save()
  order.block = blockId

  // is this useful?
  // let orderApprovedPartOneEvent = events.getOrCreateOrderApprovedPartOne(event.transactionLogIndex.toHex())
  // orderApprovedPartOneEvent.timestamp = timestamp
  // orderApprovedPartOneEvent.block = blockId
  // orderApprovedPartOneEvent.transaction = transaction.id
  // orderApprovedPartOneEvent.minute = minute.id
  // orderApprovedPartOneEvent.hour = hour.id
  // orderApprovedPartOneEvent.day = day.id
  // orderApprovedPartOneEvent.week = week.id
  // orderApprovedPartOneEvent.save()

  let maker = accounts.getOrCreateAccount(event.params.maker, txId)
  maker.lastUpdatedAt = txId
  maker.save()
  order.maker = maker.id

  let taker = accounts.getOrCreateAccount(event.params.taker, txId)
  taker.lastUpdatedAt = txId
  taker.save()
  order.taker = taker.id

  // TODO relate assets to time series
  let asset = assets.getOrCreateAsset(event.params.target)
  asset.save()

  order = orders.handleOrderPartOne(
    event.params,
    order,
    asset.id
  )
  order.save()

}

export function handleOrderApprovedPartTwo(event: OrderApprovedPartTwo): void {
  shared.helpers.handleEvmMetadata(event)
  // TODO event entity

  let token = tokens.getOrCreateToken(event.params.paymentToken)
  token.save()

  let order = orders.getOrCreateOrder(event.params.hash.toHex())
  order = orders.handleOrderPartTwo(event.params, order, token.id)
  order.save()
}

export function handleOrderCancelled(event: OrderCancelled): void {
  shared.helpers.handleEvmMetadata(event)
  // TODO event entity
  let order = orders.cancelOrder(event.params.hash.toHex())
  order.save()
}

export function handleOrdersMatched(event: OrdersMatched): void {
  let timestamp = event.block.timestamp
  // TODO handle minute and so on
  let minuteEpoch = shared.date.truncateMinutes(timestamp)
  let minute = timeSeries.minutes.getOrCreateMinute(minuteEpoch)
  minute.save()

  let hourEpoch = shared.date.truncateHours(timestamp)
  let hour = timeSeries.hours.getOrCreateHour(hourEpoch)
  hour.save()

  let dayEpoch = shared.date.truncateDays(timestamp)
  let day = timeSeries.days.getOrCreateDay(dayEpoch)
  day.save()

  let weekEpoch = shared.date.truncateWeeks(timestamp)
  let week = timeSeries.weeks.getOrCreateWeek(weekEpoch)
  week.save()

  let blockId = event.block.number.toString()
  let txHash = event.transaction.hash
  let txId = txHash.toHex()

  // TODO relate transactions to time series
  let transaction = transactions.getOrCreateTransactionMeta(
    txId,
    blockId,
    txHash,
    event.transaction.from,
    event.transaction.gasPrice,
  )
  transaction.minute = minute.id
  transaction.hour = hour.id
  transaction.day = day.id
  transaction.week = week.id
  transaction.save()

  shared.helpers.handleEvmMetadata(event)

  let owner = accounts.getOrCreateAccount(event.params.taker, txId)
  let sellOrderId = event.params.sellHash.toHex()
  let order = orders.getOrCreateOrder(sellOrderId)
  if (order.target == null) {
    log.warning("missing target for order: {}", [sellOrderId])
    return
  }
  let asset = assets.loadAsset(order.target)
  if (asset == null) {
    log.warning("missing asset for target: {}", [order.target])
    return
  }
  let assetOwner = assetOwners.getOrCreateAssetOwner(owner.id, asset.id)
  assetOwner.save()



  // TODO event entity
  // let totalTakerAmount = shared.helpers.calcTotalTakerAmount(order)
  // let takerBalance = balances.increaseBalanceAmount(order.taker, order.paymentToken, totalTakerAmount)
  // takerBalance.save()

}

export function handleOwnershipRenounced(event: OwnershipRenounced): void {
  // shared.helpers.handleEvmMetadata(event)
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  // shared.helpers.handleEvmMetadata(event)
}
