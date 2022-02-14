import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { bytes } from "@protofire/subgraph-toolkit";
import { log } from "matchstick-as";

export namespace orders {
	export namespace helpers {


		export function decodeBatch(callData: string): string[] {
			const TRAILING_0x = 2
			const METHOD_ID_LENGTH = 8
			const UINT_256_LENGTH = 64

			let indexStartNbToken = TRAILING_0x + METHOD_ID_LENGTH + UINT_256_LENGTH * 4;
			let indexStopNbToken = indexStartNbToken + UINT_256_LENGTH;
			let nbTokenStr = callData.substring(indexStartNbToken, indexStopNbToken);

			log.warning("nbTokenStr ={}", [nbTokenStr])
			return [nbTokenStr]
		}

		export function decodeData(transferFromData: string): string[] {
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

			let method = transferFromData.substring(TRAILING_0x, methodIdEnd);
			let from = transferFromData.substring(methodIdEnd, fromEnd);
			let to = transferFromData.substring(fromEnd, toEnd);
			let tokenIdHexStr = transferFromData.substring(toEnd);
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

		export function guardedArrayReplace(array: Bytes, replacement: Bytes, mask: Bytes): string {
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
}