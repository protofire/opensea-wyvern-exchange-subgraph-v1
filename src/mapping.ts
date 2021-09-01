import {
  OrderApprovedPartOne,
  OrderApprovedPartTwo,
  OrderCancelled,
  OrdersMatched,
  OwnershipRenounced,
  OwnershipTransferred
} from "../generated/openseaWyvernExchange/openseaWyvernExchange"
import {
  orders,
  shared,
  timeSeries
} from "./modules"

export function handleOrderApprovedPartOne(event: OrderApprovedPartOne): void {
  let timestamp = event.block.timestamp
  let order = orders.getOrCreateOrder(event.params.hash.toString())

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

  order.save()


}

export function handleOrderApprovedPartTwo(event: OrderApprovedPartTwo): void { }

export function handleOrderCancelled(event: OrderCancelled): void { }

export function handleOrdersMatched(event: OrdersMatched): void { }

export function handleOwnershipRenounced(event: OwnershipRenounced): void { }

export function handleOwnershipTransferred(event: OwnershipTransferred): void { }
