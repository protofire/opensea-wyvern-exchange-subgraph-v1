import {
  AtomicMatch_Call,
  OrderCancelled,
} from "../generated/openseaWyvernExchange/openseaWyvernExchange"
import { mappingHelpers } from "./mappingHelpers"

import {
  abi,
  accounts,
  erc20Tokens,
  metadata,
  orders,
  shared,
  timeSeries,
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

/
export function handleAtomicMatch_(call: AtomicMatch_Call): void {
  let timestamp = call.block.timestamp
  let timeSeriesResult = timeSeries.handleTimeSeries(timestamp)

  let metadataResult = metadata.handleEvmMetadata(
    call.block, call.transaction, timeSeriesResult
  )


  // buyMaker === someoneElse
  // sellMaker === buyTaker
  // sellTaker === Address.zero

  let buyMakerAddress = call.inputs.addrs[1]
  let sellMakerAddress = call.inputs.addrs[8]
  let buyTakerAddress = call.inputs.addrs[2]
  let sellTakerAddress = call.inputs.addrs[9]



  //TODO relate filled orders
  //TODO add counters


  let sellTaker = accounts.getOrCreateAccount(sellTakerAddress, metadataResult.txId)
  sellTaker.save()


  let paymentToken = erc20Tokens.getOrCreateToken(call.inputs.addrs[6])
  paymentToken.save()

  // TIME SERIES


  /*
  Order(addrs[0], addrs[1], addrs[2], uints[0], uints[1], uints[2], uints[3], addrs[3], 
    FeeMethod(feeMethodsSidesKindsHowToCalls[0]), SaleKindInterface.Side(feeMethodsSidesKindsHowToCalls[1]),
    SaleKindInterface.SaleKind(feeMethodsSidesKindsHowToCalls[2]), addrs[4], 
    AuthenticatedProxy.HowToCall(feeMethodsSidesKindsHowToCalls[3]), 
    calldataBuy, replacementPatternBuy, addrs[5], staticExtradataBuy, 
    ERC20(addrs[6]), uints[4], uints[5], uints[6], uints[7], uints[8]),
  
  */

  let buyOrder = orders.handleOrder(
    call.inputs.addrs[0], call.inputs.addrs[1].toHexString(), call.inputs.addrs[2].toHexString(),
    call.inputs.uints[0], call.inputs.uints[1],
    call.inputs.uints[2], call.inputs.uints[3], call.inputs.addrs[3],
    call.inputs.feeMethodsSidesKindsHowToCalls[0],
    call.inputs.feeMethodsSidesKindsHowToCalls[1],
    call.inputs.feeMethodsSidesKindsHowToCalls[2],
    call.inputs.addrs[4], call.inputs.feeMethodsSidesKindsHowToCalls[3],
    call.inputs.calldataBuy, call.inputs.replacementPatternBuy,
    call.inputs.addrs[5], call.inputs.staticExtradataBuy,
    paymentToken.id, call.inputs.uints[4], call.inputs.uints[5],
    call.inputs.uints[6], call.inputs.uints[7], call.inputs.uints[8]
  )
  buyOrder = orders.mutations.setTimeSeriesRelationships(
    buyOrder, timeSeriesResult
  )
  buyOrder = orders.mutations.setMetadataRelationships(
    buyOrder, metadataResult
  )
  buyOrder.save()

  // TODO relate order with sales


  /*
  Order(addrs[7], addrs[8], addrs[9], uints[9], uints[10], uints[11], uints[12], addrs[10],
    FeeMethod(feeMethodsSidesKindsHowToCalls[4]), SaleKindInterface.Side(feeMethodsSidesKindsHowToCalls[5]), 
    SaleKindInterface.SaleKind(feeMethodsSidesKindsHowToCalls[6]), addrs[11], 
    AuthenticatedProxy.HowToCall(feeMethodsSidesKindsHowToCalls[7]), 
    calldataSell, replacementPatternSell, addrs[12], staticExtradataSell,
    ERC20(addrs[13]), uints[13], uints[14], uints[15], uints[16], uints[17])
  */

  let sellOrder = orders.handleOrder(
    call.inputs.addrs[7], call.inputs.addrs[8].toHexString(), sellTaker.id,
    call.inputs.uints[9], call.inputs.uints[10],
    call.inputs.uints[11], call.inputs.uints[12], call.inputs.addrs[10],
    call.inputs.feeMethodsSidesKindsHowToCalls[4],
    call.inputs.feeMethodsSidesKindsHowToCalls[5],
    call.inputs.feeMethodsSidesKindsHowToCalls[6],
    call.inputs.addrs[11], call.inputs.feeMethodsSidesKindsHowToCalls[7],
    call.inputs.calldataSell, call.inputs.replacementPatternSell,
    call.inputs.addrs[12], call.inputs.staticExtradataSell,
    paymentToken.id, call.inputs.uints[13], call.inputs.uints[14],
    call.inputs.uints[15], call.inputs.uints[16], call.inputs.uints[17]
  )
  sellOrder = orders.mutations.setTimeSeriesRelationships(
    sellOrder, timeSeriesResult
  )
  sellOrder = orders.mutations.setMetadataRelationships(
    sellOrder, metadataResult
  )
  sellOrder.save()





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
      decoded, metadataResult.txId, paymentToken.id, sellerAmount, timestamp
    )


  } else {
    let decoded = abi.decodeSingleNftData(
      buyOrder.callData!, sellOrder.callData!, buyOrder.replacementPattern!
    );
    mappingHelpers.handleSingleSale(
      decoded, metadataResult.txId, call.inputs.addrs[11], paymentToken.id, sellerAmount, timestamp
    )

  }
}


