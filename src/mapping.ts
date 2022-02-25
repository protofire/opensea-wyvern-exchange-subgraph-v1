import { BigInt, log } from "@graphprotocol/graph-ts"
import {
  AtomicMatch_Call,
  OrderCancelled,
  OrdersMatched
} from "../generated/openseaWyvernExchange/openseaWyvernExchange"
import { Order } from "../generated/schema"
import { mappingHelpers } from "./mappingHelpers"

import {
  abi,
  accounts,
  assetOwners,
  assets,
  balances,
  blocks,
  events,
  nfts,
  orders,
  shared,
  timeSeries,
  tokens,
  transactions,
  volumes
} from "./modules"

// TODO: add event handlers


export function handleOrderCancelled(event: OrderCancelled): void {
  shared.helpers.handleEvmMetadata(event)
  // TODO event entity
  let order = orders.cancelOrder(event.params.hash.toHex())
  order.save()
}


// export function handleOrdersMatched(event: OrdersMatched): void {
//   let sellOrder = Order.load(event.params.sellHash.toHex())
//   let buyOrder = Order.load(event.params.buyHash.toHex())
//   let order = sellOrder || buyOrder

//   if (!order) {
//     log.warning("handleOrdersMatched :: missing sell and buy ABORTING", [])
//     return
//   }

//   log.info(
//     "handleOrdersMatched :: [sell is {}] [buy is {}]",
//     [sellOrder ? sellOrder.id : "missing", buyOrder ? buyOrder.id : "missing"]
//   )

//   order = orders.mutations.setAsFilled(order)

//   if (buyOrder && sellOrder) {
//     let sellCallData = sellOrder.callData!
//     let buyCallData = buyOrder.callData!
//     log.info("handleOrdersMatched :: both buy and sell are present", [])
//     log.warning("call data are: [sell: {}][buy: {}]", [sellCallData.toHexString(), buyCallData.toHexString()])

//   }

// }

/*
 params
  address[14] addrs,
  uint[18] uints,
  uint8[8] feeMethodsSidesKindsHowToCalls,
  bytes calldataBuy,
  bytes calldataSell,
  bytes replacementPatternBuy,
  bytes replacementPatternSell,
  bytes staticExtradataBuy,
  bytes staticExtradataSell,
  uint8[2] vs,
  bytes32[5] rssMetadata
*/

/*
handleAtomicMatch_ :: maker/taker mismatch 
(maker[buy 0xe78d1efd02e41d8defd2e1ac29dca8291f67bfbc][sell 0x1bf8ba061664339baf1e1d016d8f6cea9455f404]) 
(taker[buy 0x1bf8ba061664339baf1e1d016d8f6cea9455f404][sell 0x0000000000000000000000000000000000000000]),
*/
export function handleAtomicMatch_(call: AtomicMatch_Call): void {

  let blockId = call.block.number.toString()
  let transaction = transactions.getOrCreateTransactionMeta(
    blockId,
    call.transaction.hash,
    call.transaction.from,
    call.transaction.gasPrice,
  )

  // buyMaker === someoneElse
  // sellMaker === buyTaker
  // sellTaker === Address.zero

  let buyMakerAddress = call.inputs.addrs[1]
  let sellMakerAddress = call.inputs.addrs[8]
  let buyTakerAddress = call.inputs.addrs[2]
  let sellTakerAddress = call.inputs.addrs[9]



  //TODO relate filled orders
  //TODO handle bundle sales
  //TODO get asset token ids
  //TODO add counters


  // buyMaker
  let buyer = accounts.getOrCreateAccount(buyMakerAddress, transaction.id)
  buyer.save()

  let seller = accounts.getOrCreateAccount(sellMakerAddress || buyTakerAddress, transaction.id)
  seller.save()

  let sellTaker = accounts.getOrCreateAccount(sellTakerAddress, transaction.id)
  sellTaker.save()


  let paymentToken = tokens.getOrCreateToken(call.inputs.addrs[6])
  paymentToken.save()

  // TIME SERIES

  let timestamp = call.block.timestamp

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

  transaction.minute = minute.id
  transaction.hour = hour.id
  transaction.day = day.id
  transaction.week = week.id
  transaction.save()

  let block = blocks.services.getOrCreateBlock(blockId, call.block.timestamp, call.block.number)
  block.minute = minute.id
  block.hour = hour.id
  block.day = day.id
  block.week = week.id
  block.save()

  /*
  Order(addrs[0], addrs[1], addrs[2], uints[0], uints[1], uints[2], uints[3], addrs[3], 
    FeeMethod(feeMethodsSidesKindsHowToCalls[0]), SaleKindInterface.Side(feeMethodsSidesKindsHowToCalls[1]),
    SaleKindInterface.SaleKind(feeMethodsSidesKindsHowToCalls[2]), addrs[4], 
    AuthenticatedProxy.HowToCall(feeMethodsSidesKindsHowToCalls[3]), 
    calldataBuy, replacementPatternBuy, addrs[5], staticExtradataBuy, 
    ERC20(addrs[6]), uints[4], uints[5], uints[6], uints[7], uints[8]),
  
  */

  let buyOrder = orders.handleOrder(
    call.inputs.addrs[0], buyer.id, seller.id,
    call.inputs.uints[0], call.inputs.uints[1],
    call.inputs.uints[2], call.inputs.uints[3], call.inputs.addrs[3],
    call.inputs.feeMethodsSidesKindsHowToCalls[0],
    call.inputs.feeMethodsSidesKindsHowToCalls[1],
    call.inputs.feeMethodsSidesKindsHowToCalls[2],
    call.inputs.addrs[4].toHexString(), call.inputs.feeMethodsSidesKindsHowToCalls[3],
    call.inputs.calldataBuy, call.inputs.replacementPatternBuy,
    call.inputs.addrs[5], call.inputs.staticExtradataBuy,
    paymentToken.id, call.inputs.uints[4], call.inputs.uints[5],
    call.inputs.uints[6], call.inputs.uints[7], call.inputs.uints[8]
  )
  buyOrder.minute = minute.id
  buyOrder.hour = hour.id
  buyOrder.day = day.id
  buyOrder.week = week.id
  buyOrder.transaction = transaction.id
  buyOrder.block = blockId



  /*
  Order(addrs[7], addrs[8], addrs[9], uints[9], uints[10], uints[11], uints[12], addrs[10],
    FeeMethod(feeMethodsSidesKindsHowToCalls[4]), SaleKindInterface.Side(feeMethodsSidesKindsHowToCalls[5]), 
    SaleKindInterface.SaleKind(feeMethodsSidesKindsHowToCalls[6]), addrs[11], 
    AuthenticatedProxy.HowToCall(feeMethodsSidesKindsHowToCalls[7]), 
    calldataSell, replacementPatternSell, addrs[12], staticExtradataSell,
    ERC20(addrs[13]), uints[13], uints[14], uints[15], uints[16], uints[17])
  */

  let sellOrder = orders.handleOrder(
    call.inputs.addrs[7], seller.id, sellTaker.id,
    call.inputs.uints[9], call.inputs.uints[10],
    call.inputs.uints[11], call.inputs.uints[12], call.inputs.addrs[10],
    call.inputs.feeMethodsSidesKindsHowToCalls[4],
    call.inputs.feeMethodsSidesKindsHowToCalls[5],
    call.inputs.feeMethodsSidesKindsHowToCalls[6],
    call.inputs.addrs[11].toHexString(), call.inputs.feeMethodsSidesKindsHowToCalls[7],
    call.inputs.calldataSell, call.inputs.replacementPatternSell,
    call.inputs.addrs[12], call.inputs.staticExtradataSell,
    paymentToken.id, call.inputs.uints[13], call.inputs.uints[14],
    call.inputs.uints[15], call.inputs.uints[16], call.inputs.uints[17]
  )
  sellOrder.minute = minute.id
  sellOrder.hour = hour.id
  sellOrder.day = day.id
  sellOrder.week = week.id
  sellOrder.transaction = transaction.id
  sellOrder.block = blockId
  sellOrder.matchedOrder = buyOrder.id
  sellOrder.save()

  buyOrder.matchedOrder = sellOrder.id
  buyOrder.save()


  // TODO calc amounts

  // // sellMaker === buyTaker
  let sellerAmount = shared.helpers.calcOrderAmount(
    buyOrder.basePrice!,
    buyOrder.takerProtocolFee!,
    buyOrder.takerRelayerFee!
  )

  let buyerAmount = shared.helpers.calcOrderAmount(
    buyOrder.basePrice!,
    buyOrder.makerProtocolFee!,
    buyOrder.makerRelayerFee!
  )

  let saleTarget = call.inputs.addrs[11]
  let isBundleSale = saleTarget.toHexString() === orders.constants.WYVERN_ATOMICIZER_ADDRESS

  if (isBundleSale) {
    let decoded = abi.decodeBatchNftData(
      buyOrder.callData!, sellOrder.callData!, buyOrder.replacementPattern!
    );

    mappingHelpers.handleBundleSale(
      decoded, transaction.id, paymentToken.id, sellerAmount, timestamp
    )


  } else {
    let decoded = abi.decodeSingleNftData(
      buyOrder.callData!, sellOrder.callData!, buyOrder.replacementPattern!
    );
    mappingHelpers.handleSingleSale(
      decoded, transaction.id, call.inputs.addrs[11], paymentToken.id, sellerAmount, timestamp
    )

  }




  // TODO nft token change owner

  let minuteVolume = volumes.minute.increaseVolume(asset.id, paymentToken.id, minute.id, minuteEpoch, sellerAmount)
  minuteVolume.save()

  let hourVolume = volumes.hour.increaseVolume(asset.id, paymentToken.id, hour.id, hourEpoch, sellerAmount)
  hourVolume.save()

  let dayVolume = volumes.day.increaseVolume(asset.id, paymentToken.id, day.id, dayEpoch, sellerAmount)
  dayVolume.save()

  let weekVolume = volumes.week.increaseVolume(asset.id, paymentToken.id, week.id, weekEpoch, sellerAmount)
  weekVolume.save()


  erc20tx.order = buyOrder.id
  erc20tx.minute = minute.id
  erc20tx.hour = hour.id
  erc20tx.day = day.id
  erc20tx.week = week.id
  erc20tx.transaction = transaction.id
  erc20tx.block = blockId
  erc20tx.minuteVolume = minuteVolume.id
  erc20tx.hourVolume = hourVolume.id
  erc20tx.dayVolume = dayVolume.id
  erc20tx.weekVolume = weekVolume.id
  erc20tx.save()
}


