import { Address, BigInt, Bytes, log, TypedMap } from "@graphprotocol/graph-ts";
import { address, integer } from "@protofire/subgraph-toolkit";
import { Order } from "../../generated/schema";
import { shared } from "./";
import { globalState } from "./globalState";
import { metadata } from "./metadata";
import { timeSeries } from "./timeSeries";

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

		export const WYVERN_ATOMICIZER_ADDRESS = "0xc99f70bfd82fb7c8f8191fdfbfb735606b15e5c5"

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
		export function calculateMatchPrice(buy: Order, sell: Order, now: BigInt): BigInt {
			/* Calculate sell price. */
			let sellPrice = calculateFinalPrice(
				sell.side!, sell.saleKind!, sell.basePrice!,
				sell.extra!, sell.listingTime!, sell.expirationTIme!, now)

			/* Calculate buy price. */
			let buyPrice = calculateFinalPrice(
				buy.side!, buy.saleKind!, buy.basePrice!,
				buy.extra!, buy.listingTime!, buy.expirationTIme!, now)

			/* Maker/taker priority. */
			let isMissingSellFeeRecipient = (address.isZeroAddress(Address.fromString(sell.feeRecipient!)))
			return isMissingSellFeeRecipient ? buyPrice : sellPrice

		}

		function calculateFinalPrice(
			side: string, saleKind: string, basePrice: BigInt, extra: BigInt,
			listingTime: BigInt, expirationTime: BigInt, now: BigInt
		): BigInt {
			if (saleKind == SALE_KIND_FIXEDPRICE) {
				return basePrice;
			} else if (saleKind == SALE_KIND_DUTCHAUCTION) {
				let diff = (extra.times(now.minus(listingTime))).div(expirationTime.minus(listingTime))
				if (side == SIDE_SELL) {
					/* Sell-side - start price: basePrice. End price: basePrice - extra. */
					return basePrice.div(diff)
				}
				// else...
				/* Buy-side - start price: basePrice. End price: basePrice + extra. */
				return basePrice.plus(diff)
			}
			return integer.ZERO
		}


		export function getFeeMethod(feeMethod: i32): string {
			let key = shared.helpers.i32ToString(feeMethod)
			// log.info("getFeeMethod said: {}", [key])
			return shared.helpers.getPropById(key, constants.getFeeTypes())
		}

		export function getSaleKind(kind: i32): string {
			let key = shared.helpers.i32ToString(kind)
			// log.info("getSaleKind said: {}", [key])
			return shared.helpers.getPropById(key, constants.getSaleKinds())
		}

		export function getHowToCall(call: i32): string {
			let callAsString = shared.helpers.i32ToString(call)
			// log.info("getHowToCall said: {}", [callAsString])
			return shared.helpers.getPropById(callAsString, constants.getOrderCalls())
		}

		export function getOrderSide(side: i32): string {
			let sideAsString = shared.helpers.i32ToString(side)
			// log.info("getOrderSide said: {}", [sideAsString])
			return shared.helpers.getPropById(sideAsString, constants.getOrderSides())
		}
	}

	export function safeLoadOrder(id: string): Order {
		let entity = Order.load(id)
		if (!entity) {
			log.critical("safeLoadOrder :: Missing order for id", [id])
		}
		return entity!
	}

	export function getOrCreateOrder(id: string): Order {
		let entity = Order.load(id)
		if (entity == null) {
			entity = new Order(id)
			// entity.status = ORDER_STATUS_NONE
			// entity.yieldStatus = YIELD_STATUS_NONE
			entity.cancelled = false
		}
		return entity as Order
	}
	/*
		* struct Order {
			* // Exchange address, intended as a versioning mechanism.
			* address exchange;
			* // Order maker address.
			* address maker;
			* // Order taker address, if specified.
			* address taker;
			* // Maker relayer fee of the order, unused for taker order.
			* uint makerRelayerFee;
			* // Taker relayer fee of the order, or maximum taker fee for a taker order.
			* uint takerRelayerFee;
			* // Maker protocol fee of the order, unused for taker order.
			* uint makerProtocolFee;
			* // Taker protocol fee of the order, or maximum taker fee for a taker order.
			* uint takerProtocolFee;
			* // Order fee recipient or zero address for taker order.
			* address feeRecipient;
			* // Fee method (protocol token or split fee).
			* FeeMethod feeMethod;
			* // Side (buy/sell).
			* SaleKindInterface.Side side;
			* // Kind of sale.
			* SaleKindInterface.SaleKind saleKind;
			* // Target.
			* address target;
			* // HowToCall.
			* AuthenticatedProxy.HowToCall howToCall;
			* // Calldata.
			* bytes calldata;
			* // Calldata replacement pattern, or an empty byte array for no replacement.
			* bytes replacementPattern;
			* // Static call target, zero-address for no static call.
			* address staticTarget;
			* // Static call extra data.
			* bytes staticExtradata;
			* // Token used to pay for the order, or the zero-address as a sentinel value for Ether.
			* address paymentToken;
			* // Base price of the order (in paymentTokens).
			* uint basePrice;
			* // Auction extra parameter - minimum bid increment for English auctions, starting/ending price difference.
			* uint extra;
			* // Listing timestamp.
			* uint listingTime;
			* // Expiration timestamp - 0 for no expiry.
			* uint expirationTime;
			* // Order salt, used to prevent duplicate hashes.
			* uint salt;
		}
	*/
	export function handleOrder(
		exchange: Address,
		maker: string,
		taker: string,
		makerRelayerFee: BigInt,
		takerRelayerFee: BigInt,
		makerProtocolFee: BigInt,
		takerProtocolFee: BigInt,
		feeRecipient: Address,
		feeMethod: i32,
		side: i32,
		saleKind: i32,
		target: string,
		howToCall: i32,
		callData: Bytes,
		replacementPattern: Bytes,
		staticTarget: Address,
		staticExtradata: Bytes,
		paymentToken: string,
		basePrice: BigInt,
		extra: BigInt,
		listingTime: BigInt,
		expirationTIme: BigInt,
		salt: BigInt,
	): Order {
		let orderSide = helpers.getOrderSide(side)
		let id = salt.toHexString()
		let entity = getOrCreateOrder(id)
		entity.exchange = exchange
		entity.maker = maker
		entity.taker = taker
		entity.makerRelayerFee = makerRelayerFee
		entity.takerRelayerFee = takerRelayerFee
		entity.makerProtocolFee = makerProtocolFee
		entity.takerProtocolFee = takerProtocolFee
		entity.feeRecipient = feeRecipient.toHex() // todo use accounts helper
		entity.feeMethod = helpers.getFeeMethod(feeMethod)
		entity.side = orderSide
		entity.saleKind = helpers.getSaleKind(saleKind)
		entity.target = target
		entity.howToCall = helpers.getHowToCall(howToCall)
		entity.callData = callData
		entity.replacementPattern = replacementPattern
		entity.staticTarget = staticTarget
		entity.staticExtradata = staticExtradata
		entity.paymentToken = paymentToken // todo use token value
		entity.basePrice = basePrice
		entity.extra = extra
		entity.listingTime = listingTime
		entity.expirationTIme = expirationTIme
		entity.salt = salt
		globalState.helpers.updateGlobal_orders_Counter()
		return entity as Order
	}

	export function cancelOrder(id: string): Order {
		let entity = getOrCreateOrder(id)
		entity.cancelled = true
		return entity as Order
	}

	export namespace mutations {

		export function setTimeSeriesRelationships(
			order: Order,
			timeSeriesResult: timeSeries.HandleTimeSeriesResult,
		): Order {
			order.minute = timeSeriesResult.minute.id
			order.hour = timeSeriesResult.hour.id
			order.day = timeSeriesResult.day.id
			order.week = timeSeriesResult.week.id
			return order
		}

		export function setMetadataRelationships(
			order: Order,
			metadataResult: metadata.MetadataResult
		): Order {
			order.transaction = metadataResult.txId
			order.block = metadataResult.blockId
			return order
		}

		export function setAsFilled(order: Order): Order {
			let _order = order
			// _order.status = ORDER_STATUS_FILLED
			return _order
		}
	}
}