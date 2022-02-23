import { BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { bytes } from "@protofire/subgraph-toolkit";
import { log, logStore } from "matchstick-as";

export namespace decoder {
	export namespace helpers {
		export function decodeBatchData(mergedCallData: string): string[] {
			const TRAILING_0x = 2
			const METHOD_ID_LENGTH = 8
			const UINT_256_LENGTH = 64

			let methodIdEnd = TRAILING_0x + METHOD_ID_LENGTH

			let indexStartNbToken = TRAILING_0x + METHOD_ID_LENGTH + UINT_256_LENGTH * 4;
			let indexStopNbToken = indexStartNbToken + UINT_256_LENGTH;
			let nbTokenStr = mergedCallData.substring(indexStartNbToken, indexStopNbToken);
			let nbToken = hexToBigInt(nbTokenStr).toI32()

			let method = mergedCallData.substring(TRAILING_0x, methodIdEnd);


			log.warning("nbTokenStr ={}", [nbTokenStr])
			return [nbTokenStr]
		}



		export function decodeData(_mergedCallData: Bytes): string[] {
			const TRAILING_0x = 2;
			const METHOD_ID_LENGTH = 8;
			const UINT_256_LENGTH = 64;

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


			let methodIdEnd = TRAILING_0x + METHOD_ID_LENGTH
			let fromEnd = methodIdEnd + UINT_256_LENGTH
			let toEnd = methodIdEnd + (UINT_256_LENGTH * 2)
			let mergedCallData = _mergedCallData.toHexString()
			let method = mergedCallData.substring(TRAILING_0x, methodIdEnd);
			let from = mergedCallData.substring(methodIdEnd, fromEnd);
			let to = mergedCallData.substring(fromEnd, toEnd);
			let tokenIdHexStr = mergedCallData.substring(toEnd);
			// let tokenId = (tokenIdHexStr, 16);
			// let tokenIdStr: string = tokenId.toString();

			return [
				method,
				from,
				to,
				tokenIdHexStr
			];
		}

		export function hexToBytes(str: string): Bytes {
			return Bytes.fromByteArray(Bytes.fromHexString(str))
		}

		export function hexToBigInt(str: string): BigInt {
			return bytes.toSignedInt(hexToBytes(str))
		}

		export function strToBigInt(str: string): BigInt {
			return BigInt.fromString(str)
		}

		export function guardedArrayReplace(array: Bytes, replacement: Bytes, mask: Bytes): Bytes {
			array.reverse();
			replacement.reverse();
			mask.reverse();

			let bigIntgArray = BigInt.fromUnsignedBytes(array);
			let bigIntReplacement = BigInt.fromUnsignedBytes(replacement);
			let bigIntMask = BigInt.fromUnsignedBytes(mask);

			// array |= replacement & mask;
			bigIntReplacement = bigIntReplacement.bitAnd(bigIntMask);
			bigIntgArray = bigIntgArray.bitOr(bigIntReplacement);
			// let callDataHexString = bigIntgArray.toHexString();
			// return callDataHexString;
			// let callDataHexString = bigIntgArray.toHexString();
			return changetype<Bytes>(Bytes.fromBigInt(bigIntgArray).reverse());

		}
	}
}