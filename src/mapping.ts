import { date } from "@protofire/subgraph-toolkit"
import {
  openseaWyvernExchange,
  OrderApprovedPartOne,
  OrderApprovedPartTwo,
  OrderCancelled,
  OrdersMatched,
  OwnershipRenounced,
  OwnershipTransferred
} from "../generated/openseaWyvernExchange/openseaWyvernExchange"
import { orders, timeSeries } from "./modules"

export function handleOrderApprovedPartOne(event: OrderApprovedPartOne): void {
  let timestamp = event.block.timestamp
  let order = orders.getOrCreateOrder(event.params.hash.toString())

  let minuteEpoch = date.truncateMinutes(timestamp)
  let minute = timeSeries.minutes.getOrCreateMinute(minuteEpoch)
  minute.save()
  order.minute = minute.id

  let hourEpoch = date.truncateHours(timestamp)
  let hour = timeSeries.hours.getOrCreateHour(hourEpoch)
  hour.save()
  order.hour = hour.id


}

export function handleOrderApprovedPartTwo(event: OrderApprovedPartTwo): void { }

export function handleOrderCancelled(event: OrderCancelled): void { }

export function handleOrdersMatched(event: OrdersMatched): void { }

export function handleOwnershipRenounced(event: OwnershipRenounced): void { }

export function handleOwnershipTransferred(event: OwnershipTransferred): void { }
