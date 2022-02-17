import { Address, BigInt, Bytes, log, TypedMap } from "@graphprotocol/graph-ts";
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

		// function _getCompleteNftIdFromCallData(atomicizeCallData: string): string[] {
		// 	const TRAILING_0x = 2;
		// 	const METHOD_ID_LENGTH = 8;
		// 	const UINT_256_LENGTH = 64;

		// 	let indexStartNbToken = TRAILING_0x + METHOD_ID_LENGTH + UINT_256_LENGTH * 4;
		// 	let indexStopNbToken = indexStartNbToken + UINT_256_LENGTH;
		// 	let nbTokenStr = atomicizeCallData.substring(indexStartNbToken, indexStopNbToken);
		// 	let nbToken = parseI32(nbTokenStr, 16);

		// 	// Get the associated NFT contracts
		// 	let nftContractsAddrsList: string[] = [];
		// 	let offset = indexStopNbToken;
		// 	for (let i = 0; i < nbToken; i++) {
		// 		let addrs = atomicizeCallData.substring(offset, offset + UINT_256_LENGTH);
		// 		nftContractsAddrsList.push(addrs);

		// 		// Move forward in the call data
		// 		offset += UINT_256_LENGTH;
		// 	}

		// 	/**
		// 	 * After reading the contract addresses involved in the bundle sale
		// 	 * there are 2 chunks of params of length nbToken * UINT_256_LENGTH.
		// 	 * 
		// 	 * Those chunks are each preceded by a "chunk metadata" of length UINT_256_LENGTH
		// 	 * Finalluy a last "chunk metadata" is set of length UINT_256_LENGTH. (3 META_CHUNKS)
		// 	 *  
		// 	 * 
		// 	 * After that we are reading the abiencoded data representing the transferFrom calls
		// 	 */
		// 	const LEFT_CHUNKS = 2;
		// 	const NB_META_CHUNKS = 3;
		// 	offset += nbToken * UINT_256_LENGTH * LEFT_CHUNKS + NB_META_CHUNKS * UINT_256_LENGTH;

		// 	// Get the NFT token IDs
		// 	const TRANSFER_FROM_DATA_LENGTH = METHOD_ID_LENGTH + UINT_256_LENGTH * 3;
		// 	let tokenIdsList: string[] = [];
		// 	for (let i = 0; i < nbToken; i++) {
		// 		let transferFromData = atomicizeCallData.substring(offset, offset + TRANSFER_FROM_DATA_LENGTH);
		// 		let tokenIdstr = _getSingleTokenIdFromTransferFromCallData(transferFromData, false);
		// 		tokenIdsList.push(tokenIdstr);

		// 		// Move forward in the call data
		// 		offset += TRANSFER_FROM_DATA_LENGTH;
		// 	}

		// 	// Build the complete Nfts Ids (NFT contract - Token ID)
		// 	let completeNftIdsList: string[] = [];
		// 	for (let i = 0; i < nftContractsAddrsList.length; i++) {
		// 		let contractAddrsStr = nftContractsAddrsList[i];
		// 		let tokenIdStr = tokenIdsList[i];

		// 		completeNftIdsList.push(contractAddrsStr + '-' + tokenIdStr);
		// 	}

		// 	return completeNftIdsList;
		// }

		export function decodedBatchNftData(
			buyCallData: Bytes, sellCallData: Bytes, replacementPattern: Bytes
		): string {
			let mergedCallData = guardedArrayReplace(
				buyCallData, sellCallData, replacementPattern
			)
			return "foo"
		}
		// TODO: return a typed map
		export function decodeSingleNftData(
			buyCallData: Bytes, sellCallData: Bytes, replacementPattern: Bytes
		): string[] {
			/**
			 * The calldata input is formated as:
			 * Format => METHOD_ID (transferFrom) | FROM | TO | TOKEN_ID
			 * Size   =>            X             |   Y  |  Y |    Y
			 *      Where :
			 *          - X = 32 bits (8 hex chars)
			 *          - Y = 256 bits (64 hex chars)
			 * 
			 * +2 | 0 chars for the "0x" leading part
			 */

			let mergedCallData = guardedArrayReplace(buyCallData, sellCallData, replacementPattern)
			return [
				decodeMethodId(mergedCallData),
				decodeSenderId(mergedCallData),
				decodeRecieverId(mergedCallData),
				decodeTokenId(mergedCallData)
			];
		}

		function decodeTokenId(callData: string): string {
			let TRAILING_0x = 2;
			const METHOD_ID_LENGTH = 8;
			const UINT_256_LENGTH = 64;
			return callData.substring(TRAILING_0x + METHOD_ID_LENGTH + UINT_256_LENGTH * 2)
		}

		function decodeRecieverId(callData: string): string {
			let TRAILING_0x = 2;
			const METHOD_ID_LENGTH = 8;
			const UINT_256_LENGTH = 64;
			let recieverIdStart = TRAILING_0x + METHOD_ID_LENGTH + UINT_256_LENGTH
			return callData.substring(recieverIdStart, recieverIdStart + UINT_256_LENGTH);
		}

		function decodeSenderId(callData: string): string {
			let TRAILING_0x = 2;
			const METHOD_ID_LENGTH = 8;
			let senderIdStart = TRAILING_0x + METHOD_ID_LENGTH
			return callData.substring(senderIdStart, senderIdStart + 64);
		}

		function decodeMethodId(callData: string): string {
			let TRAILING_0x = 2;
			const METHOD_ID_LENGTH = 8;
			return callData.substring(TRAILING_0x, TRAILING_0x + METHOD_ID_LENGTH);
		}

		function guardedArrayReplace(array: Bytes, replacement: Bytes, mask: Bytes): string {
			array.reverse();
			replacement.reverse();
			mask.reverse();

			let bigIntgArray = BigInt.fromUnsignedBytes(array);
			let bigIntReplacement = BigInt.fromUnsignedBytes(replacement);
			let bigIntMask = BigInt.fromUnsignedBytes(mask);

			// array |= replacement & mask;
			bigIntReplacement = bigIntReplacement.bitAnd(bigIntMask);
			bigIntgArray = bigIntgArray.bitOr(bigIntReplacement);
			let callDataHexString = bigIntgArray.toHexString();
			return callDataHexString;
		}

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
	 struct Order {
			// Exchange address, intended as a versioning mechanism.
			address exchange;
			// Order maker address.
			address maker;
			// Order taker address, if specified.
			address taker;
			// Maker relayer fee of the order, unused for taker order.
			uint makerRelayerFee;
			// Taker relayer fee of the order, or maximum taker fee for a taker order.
			uint takerRelayerFee;
			// Maker protocol fee of the order, unused for taker order.
			uint makerProtocolFee;
			// Taker protocol fee of the order, or maximum taker fee for a taker order.
			uint takerProtocolFee;
			// Order fee recipient or zero address for taker order.
			address feeRecipient;
			// Fee method (protocol token or split fee).
			FeeMethod feeMethod;
			// Side (buy/sell).
			SaleKindInterface.Side side;
			// Kind of sale.
			SaleKindInterface.SaleKind saleKind;
			// Target.
			address target;
			// HowToCall.
			AuthenticatedProxy.HowToCall howToCall;
			// Calldata.
			bytes calldata;
			// Calldata replacement pattern, or an empty byte array for no replacement.
			bytes replacementPattern;
			// Static call target, zero-address for no static call.
			address staticTarget;
			// Static call extra data.
			bytes staticExtradata;
			// Token used to pay for the order, or the zero-address as a sentinel value for Ether.
			address paymentToken;
			// Base price of the order (in paymentTokens).
			uint basePrice;
			// Auction extra parameter - minimum bid increment for English auctions, starting/ending price difference.
			uint extra;
			// Listing timestamp.
			uint listingTime;
			// Expiration timestamp - 0 for no expiry.
			uint expirationTime;
			// Order salt, used to prevent duplicate hashes.
			uint salt;
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
		return entity as Order
	}

	export function cancelOrder(id: string): Order {
		let entity = getOrCreateOrder(id)
		entity.cancelled = true
		return entity as Order
	}

	export namespace mutations {
		export function setAsFilled(order: Order): Order {
			let _order = order
			// _order.status = ORDER_STATUS_FILLED
			return _order
		}
	}
}