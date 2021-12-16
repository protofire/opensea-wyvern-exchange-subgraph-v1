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

	export let SALE_KIND_FIXEDPRICE = "FixedPrice"
	export let SALE_KIND_DUTCHAUCTION = "DutchAuction"

	export let ORDER_CALL = "Call"
	export let ORDER_DELEGATE = "DelegateCall"

	export let SIDE_BUY = "Buy"
	export let SIDE_SELL = "Sell"

	export namespace constants {

		export function getFeeTypes(): TypedMap<string, string> {
			let PROTOCOL = "0"
			let SPLIT = "1"
			let NAMES = new TypedMap<string, string>()
			NAMES.set(PROTOCOL, FEE_METHOD_PROTOCOL_FEE)
			NAMES.set(SPLIT, FEE_METHOD_SPLIT_FEE)
			return NAMES
		}

		export function getSaleKinds(): TypedMap<string, string> {
			let FIXED = "0"
			let AUCTION = "1"
			let NAMES = new TypedMap<string, string>()
			NAMES.set(FIXED, SALE_KIND_FIXEDPRICE)
			NAMES.set(AUCTION, SALE_KIND_DUTCHAUCTION)
			return NAMES
		}

		export function getOrderCalls(): TypedMap<string, string> {
			let CALL = "0"
			let DELEGATE = "1"
			let NAMES = new TypedMap<string, string>()
			NAMES.set(CALL, ORDER_CALL)
			NAMES.set(DELEGATE, ORDER_DELEGATE)
			return NAMES
		}

		export function getOrderSides(): TypedMap<string, string> {
			let BUY = "0"
			let SELL = "1"
			let NAMES = new TypedMap<string, string>()
			NAMES.set(BUY, SIDE_BUY)
			NAMES.set(SELL, SIDE_SELL)
			return NAMES
		}
	}
	export namespace helpers {

		export function getFeeMethod(feeMethod: i32): string {
			let key = shared.helpers.i32ToString(feeMethod)
			log.info("getFeeMethod said: {}", [key])
			return shared.helpers.getPropById(key, constants.getFeeTypes())
		}



		export function getSaleKind(kind: i32): string {
			let key = shared.helpers.i32ToString(kind)
			log.info("getSaleKind said: {}", [key])
			return shared.helpers.getPropById(key, constants.getSaleKinds())
		}

		export function getHowToCall(call: i32): string {
			let callAsString = shared.helpers.i32ToString(call)
			log.info("getHowToCall said: {}", [callAsString])
			return shared.helpers.getPropById(callAsString, constants.getOrderCalls())
		}

		export function getOrderSide(side: i32): string {
			let sideAsString = shared.helpers.i32ToString(side)
			log.info("getOrderSide said: {}", [sideAsString])
			return shared.helpers.getPropById(sideAsString, constants.getOrderSides())
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