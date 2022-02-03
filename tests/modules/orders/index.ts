import { BigInt, Bytes, TypedMap, Value } from "@graphprotocol/graph-ts";
/*
test data
// https://opensea.io/assets/0x4fece400c0d3db0937162ab44bab34445626ecfe/1626
{
  "data": {
	"buys": [
	  {
		"callData": "0x23b872dd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000054ce028ca35f385bb8b98e064a7f5e2cd9b1a1640000000000000000000000000000000000000000000000000000000000001626",
		"id": "0x13b0e81aaa55dac7e678cc20cb67583041f0b0e3ec9a8d021759c0b620ba7303",
		"maker": {
		  "address": "0x54ce028ca35f385bb8b98e064a7f5e2cd9b1a164"
		},
		"replacementPattern": "0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
		"taker": {
		  "address": "0x123456cdf1d0d765b81de80ae3f5926bd0cc0e0c"
		},
		"target": {
		  "address": "0x4fece400c0d3db0937162ab44bab34445626ecfe"
		}
	  }
	],
	"sells": [
	  {
		"callData": "0x23b872dd000000000000000000000000123456cdf1d0d765b81de80ae3f5926bd0cc0e0c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001626",
		"id": "0xd084a7ac22013d1605720e72b027e3bc313f0212d226674b2624260eab72834e",
		"maker": {
		  "address": "0x123456cdf1d0d765b81de80ae3f5926bd0cc0e0c"
		},
		"replacementPattern": "0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000",
		"taker": {
		  "address": "0x0000000000000000000000000000000000000000"
		},
		"target": {
		  "address": "0x4fece400c0d3db0937162ab44bab34445626ecfe"
		}
	  }
	]
  }
}

*/


export namespace orders {
	export namespace helpers {
		export function decodeData(transferFromData: string): string[] {
			let TRAILING_0x = 2;
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