import { log, TypedMap } from "@graphprotocol/graph-ts";
import { OrderApprovedPartOne__Params, OrderApprovedPartTwo__Params } from "../../../generated/openseaWyvernExchange/openseaWyvernExchange";
import { Order } from "../../../generated/schema";
import { shared } from "..";

export namespace orders {

	export let ORDER_STATUS_NONE = "NONE"
	export let ORDER_STATUS_OPEN = "OPEN"
	export let ORDER_STATUS_FILLED = "FILLED"

	export let YIELD_STATUS_NONE = "NONE"
	export let YIELD_STATUS_PART_ONE = "PART_ONE"
	export let YIELD_STATUS_PART_TWO = "PART_TWO"

	export let FEE_METHOD_PROTOCOL_FEE = "ProtocolFee"
	export let FEE_METHOD_SPLIT_FEE = "SplitFee"

	export let SIDE_BUY = "Buy"
	export let SIDE_SELL = "Sell"

	export let SALE_KIND_FIXEDPRICE = "FixedPrice"
	export let SALE_KIND_DUTCHAUCTION = "DutchAuction"

	export namespace constants {
		export function getOrderSides(): TypedMap<string, string> {
			let BUY = "0"
			let SELL = "1"
			let GENERATION_NAMES = new TypedMap<string, string>()
			GENERATION_NAMES.set(BUY, SIDE_BUY)
			GENERATION_NAMES.set(SELL, SIDE_SELL)
			return GENERATION_NAMES
		}
	}
	export namespace helpers {

		export function getFeeMethod(feeMethod: i32): string {
			log.info("getFeeMethod said: {}", [shared.helpers.i32ToString(feeMethod)])
			return FEE_METHOD_PROTOCOL_FEE
		}



		export function getOrderSide(side: i32): string {
			let sideAsString = shared.helpers.i32ToString(side)
			log.info("getOrderSide said: {}", [sideAsString])
			return shared.helpers.getPropById(sideAsString, constants.getOrderSides())
		}
		export function getSaleKind(kind: i32): string {
			log.info("getSaleKind said: {}", [shared.helpers.i32ToString(kind)])

			return SALE_KIND_FIXEDPRICE
		}
		export function getHowToCall(call: i32): string {
			log.info("getHowToCall said: {}", [shared.helpers.i32ToString(call)])

			return "DelegateCall"
		}
	}

	export function getOrCreateOrder(id: string): Order {
		let entity = Order.load(id)
		if (entity == null) {
			entity = new Order(id)
			entity.status = ORDER_STATUS_NONE
			entity.yieldStatus = YIELD_STATUS_NONE
			entity.cancelled = false
		}
		return entity as Order
	}

	export function handleOrderPartOne(
		params: OrderApprovedPartOne__Params,
		order: Order,
		assetId: string
	): Order {
		let entity = order
		entity.yieldStatus = YIELD_STATUS_PART_ONE
		entity.status = ORDER_STATUS_OPEN
		entity.hash = params.hash
		entity.exchange = params.exchange
		entity.makerRelayerFee = params.makerRelayerFee
		entity.makerProtocolFee = params.makerProtocolFee
		entity.takerRelayerFee = params.takerRelayerFee
		entity.takerProtocolFee = params.takerProtocolFee
		entity.feeRecipient = params.feeRecipient.toHex()
		// TODO TEST HELPERS
		entity.feeMethod = helpers.getFeeMethod(params.feeMethod)
		entity.side = helpers.getOrderSide(params.side)
		entity.saleKind = helpers.getSaleKind(params.saleKind)
		// 
		entity.target = assetId

		return entity as Order
	}

	export function handleOrderPartTwo(
		params: OrderApprovedPartTwo__Params,
		order: Order,
		tokenId: string
	): Order {
		let entity = order
		entity.yieldStatus = YIELD_STATUS_PART_TWO
		entity.howToCall = helpers.getHowToCall(params.howToCall)
		entity.callData = params.calldata
		entity.replacementPattern = params.replacementPattern
		entity.staticTarget = params.staticTarget
		entity.staticExtradata = params.staticExtradata
		entity.paymentToken = tokenId
		entity.basePrice = params.basePrice
		entity.extra = params.extra
		entity.listingTime = params.listingTime
		entity.expirationTIme = params.expirationTime
		entity.salt = params.salt


		return entity as Order
	}

	export function cancelOrder(id: string): Order {
		let entity = getOrCreateOrder(id)
		entity.cancelled = true
		return entity as Order
	}
}