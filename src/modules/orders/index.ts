import { OrderApprovedPartOne__Params, OrderApprovedPartTwo__Params } from "../../../generated/openseaWyvernExchange/openseaWyvernExchange";
import { Order } from "../../../generated/schema";

export namespace orders {

	export let TRANSACTION_STATUS_NONE = "NONE"
	export let TRANSACTION_STATUS_PART_ONE = "PART_ONE"
	export let TRANSACTION_STATUS_PART_TWO = "PART_TWO"

	export let FEE_METHOD_PROTOCOL_FEE = "ProtocolFee"
	export let FEE_METHOD_SPLIT_FEE = "SplitFee"

	export let SIDE_BUY = "Buy"
	export let SIDE_SELL = "Sell"

	export let SALE_KIND_FIXEDPRICE = "FixedPrice"
	export let SALE_KIND_DUTCHAUCTION = "DutchAuction"


	export namespace helpers {

		export function getFeeMethod(feeMethod: i32): string {
			return FEE_METHOD_PROTOCOL_FEE
		}
		export function getOrderSide(side: i32): string {
			return SIDE_BUY
		}
		export function getSaleKind(kind: i32): string {
			return SALE_KIND_FIXEDPRICE
		}
		export function getHowToCall(call: i32): string {
			return "DelegateCall"
		}
	}

	export function getOrCreateOrder(id: string): Order {
		let entity = Order.load(id)
		if (entity == null) {
			entity = new Order(id)
			entity.status = TRANSACTION_STATUS_NONE
		}
		return entity as Order
	}

	export function handleOrderPartOne(
		params: OrderApprovedPartOne__Params,
		order: Order,
		assetId: string
	): Order {
		let entity = order
		entity.status = TRANSACTION_STATUS_PART_ONE
		entity.hash = params.hash
		entity.exchange = params.exchange
		entity.maker = params.maker.toHex()
		entity.taker = params.taker.toHex()
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
	): Order {
		let entity = order
		entity.status = TRANSACTION_STATUS_PART_TWO
		entity.howToCall = helpers.getHowToCall(params.howToCall)
		entity.callData = params.calldata
		entity.replacementPattern = params.replacementPattern
		entity.staticTarget = params.staticTarget
		entity.staticExtradata = params.staticExtradata
		entity.paymentToken = params.paymentToken
		entity.basePrice = params.basePrice
		entity.extra = params.extra
		entity.listingTime = params.listingTime
		entity.expirationTIme = params.expirationTime
		entity.salt = params.salt


		return entity as Order
	}
}