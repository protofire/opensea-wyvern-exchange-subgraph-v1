import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { shared } from "..";

export namespace abi {

	class Decoded_atomicize_Result {
		method: string
		addressList: Array<string>
		transfers: Array<Decoded_TransferFrom_Result>
		constructor(
			_method: string,
			_addressList: Array<string>,
			_transfers: Array<Decoded_TransferFrom_Result>,
		) {
			this.method = _method
			this.addressList = _addressList
			this.transfers = _transfers
		}
	}

	class Decoded_TransferFrom_Result {
		method: string
		from: string
		to: string
		token: string
		constructor(
			_method: string,
			_from: string,
			_to: string,
			_token: string,
		) {
			this.method = _method
			this.from = _from
			this.to = _to
			this.token = _token

		}
	}

	export function decodedBatchNftData(
		buyCallData: Bytes, sellCallData: Bytes, replacementPattern: Bytes
	): Decoded_atomicize_Result {
		/**
		 * 
		 * atomicize(address[],uint256[],uint256[],bytes)
		 * 
		 * The calldata input is formated as:
		 * Format =>  0x | METHOD_ID (atomicize)  |   ?   | NB_TOKEN | ADDRESS_LIST
		 * Size   =>  W  |           X            | Y * 4 |     Y    |    Y * Z
		 * ... continues ...
		 * Format => ... |  METADATA_AND_PARAMS_CHUNKS | TRANSFERS_CALLDATA  
		 * Size   => ... |    ( ( M + P ) * 2 ) + P    |        T * Z       
		 * 
		 *      Where :
		 * 	
		 * 			- W = 16 bits (2 hex chars)
		 *          - X = 32 bits (8 hex chars)
		 *          - Y = 256 bits (64 hex chars)
		 *          - Z = value stored in "NB_TOKEN" section (amount of transfers),
		 * 					each address has a "Y" length
		 * 			- M = Metadata chunk of length "Y"
		 * 			- P = Params chunk of length "Y * Z"
		 * 			- T = "TransferFrom" call data of length X + (Y * 3)
		 * 
		 */

		let mergedCallData = guardedArrayReplace(buyCallData, sellCallData, replacementPattern)
		return decodeAbi_Atomicize_Method(mergedCallData)
	}

	function decodeAbi_Atomicize_Method(callData: string,): Decoded_atomicize_Result {
		const TRAILING_0x = 2
		const METHOD_ID_LENGTH = 8
		const UINT_256_LENGTH = 64

		let indexStartNbToken = TRAILING_0x + METHOD_ID_LENGTH + UINT_256_LENGTH * 4;
		let indexStopNbToken = indexStartNbToken + UINT_256_LENGTH;
		let nbTokenStr = callData.substring(indexStartNbToken, indexStopNbToken);
		let nbToken = shared.helpers.hexToBigInt(nbTokenStr).toI32()
		let addressList = new Array<string>();

		let methodId = callData.substring(TRAILING_0x, TRAILING_0x + METHOD_ID_LENGTH);

		// Get the associated NFT contracts
		let offset = indexStopNbToken;
		for (let i = 0; i < nbToken; i++) {
			let addrs = callData.substring(offset, offset + UINT_256_LENGTH);
			addressList.push(addrs);

			// Move forward in the call data
			offset += UINT_256_LENGTH;
		}

		const METADATA_AND_PARAMS_CHUNK_LENGTH = UINT_256_LENGTH + nbToken * UINT_256_LENGTH
		const CHUNKS_SECTION = METADATA_AND_PARAMS_CHUNK_LENGTH * 2 + UINT_256_LENGTH
		offset += CHUNKS_SECTION

		// Get the "TransferFrom" method calls
		const TRANSFER_CALL_DATA_LENGTH = METHOD_ID_LENGTH + UINT_256_LENGTH * 3;

		let transfersList = new Array<Decoded_TransferFrom_Result>()

		for (let i = 0; i < nbToken; i++) {
			let transferFromData = callData.substring(offset, offset + TRANSFER_CALL_DATA_LENGTH);
			let decoded = decodeAbi_transferFrom_Method(transferFromData, false)
			transfersList.push(decoded);

			// Move forward in the call data
			offset += TRANSFER_CALL_DATA_LENGTH;
		}


		return new Decoded_atomicize_Result(
			methodId,
			addressList,
			transfersList
		)
	}

	// TODO: return a typed map
	export function decodeSingleNftData(
		buyCallData: Bytes, sellCallData: Bytes, replacementPattern: Bytes
	): Decoded_TransferFrom_Result {
		/**
		 * 
		 * transferFrom(address,address,uint256)
		 * 
		 * The calldata input is formated as:
		 * Format =>  0x | METHOD_ID (transferFrom) | FROM | TO | TOKEN_ID
		 * Size   =>  W  |            X             |   Y  |  Y |    Y
		 *      Where :
		 * 			- W = 16 bits (2 hex chars) | 0 
		 *          - X = 32 bits (8 hex chars)
		 *          - Y = 256 bits (64 hex chars)
		 * 
		 * 
		 */

		let mergedCallData = guardedArrayReplace(buyCallData, sellCallData, replacementPattern)
		return decodeAbi_transferFrom_Method(mergedCallData)

	}

	function decodeAbi_transferFrom_Method(callData: string, trailing0x = true): Decoded_TransferFrom_Result {
		let TRAILING_0x = trailing0x ? 2 : 0;
		const METHOD_ID_LENGTH = 8;
		const UINT_256_LENGTH = 64;
		let senderIdStart = TRAILING_0x + METHOD_ID_LENGTH
		let recieverIdStart = TRAILING_0x + METHOD_ID_LENGTH + UINT_256_LENGTH
		let tokenIdStart = TRAILING_0x + METHOD_ID_LENGTH + (UINT_256_LENGTH * 2)

		let methodId = callData.substring(TRAILING_0x, TRAILING_0x + METHOD_ID_LENGTH);
		let senderId = callData.substring(senderIdStart, senderIdStart + UINT_256_LENGTH);
		let recieverId = callData.substring(recieverIdStart, recieverIdStart + UINT_256_LENGTH);
		let tokenId = callData.substring(tokenIdStart)

		return new Decoded_TransferFrom_Result(
			methodId,
			senderId,
			recieverId,
			tokenId
		)
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
}