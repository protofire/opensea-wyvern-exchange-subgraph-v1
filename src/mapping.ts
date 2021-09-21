import {
  OrderApprovedPartOne,
  OrderApprovedPartTwo,
  OrderCancelled,
  OrdersMatched,
  OwnershipRenounced,
  OwnershipTransferred
} from "../generated/openseaWyvernExchange/openseaWyvernExchange"
import {
  assets,
  blocks,
  orders,
  shared,
  timeSeries,
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
  transaction.save()
  order.transaction = txId

  let block = blocks.services.getOrCreateBlock(blockId, event.block.timestamp, event.block.number)
  block.minute = minute.id
  block.hour = hour.id
  block.day = day.id
  block.week = week.id
  block.save()
  order.block = blockId

  // TODO relate assets to time series
  let asset = assets.getOrCreateAsset(event.params.target)
  asset.save()

  order = orders.handleOrderPartOne(event.params, order, asset.id)
  order.save()
}

export function handleOrderApprovedPartTwo(event: OrderApprovedPartTwo): void {
  shared.helpers.handleEvmMetadata(event)
  // TODO event entity
  let order = orders.getOrCreateOrder(event.params.hash.toHex())
  order = orders.handleOrderPartTwo(event.params, order)
  order.save()

}

export function handleOrderCancelled(event: OrderCancelled): void {
  shared.helpers.handleEvmMetadata(event)
  // TODO event entity
  let order = orders.cancelOrder(event.params.hash.toHex())
  order.save()
}

export function handleOrdersMatched(event: OrdersMatched): void {
  shared.helpers.handleEvmMetadata(event)
  // TODO event entity

}

export function handleOwnershipRenounced(event: OwnershipRenounced): void {
  // shared.helpers.handleEvmMetadata(event)
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  // shared.helpers.handleEvmMetadata(event)
}
