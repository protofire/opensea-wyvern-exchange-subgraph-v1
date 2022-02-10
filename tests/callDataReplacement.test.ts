
import { log } from "matchstick-as"
import { orders } from "./modules"

export function testCallDataReplacement_0x4fece400c0d3db0937162ab44bab34445626ecfe_1626(): void {
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
	let buyCalldata = orders.helpers.hexToBytes("0x23b872dd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000054ce028ca35f385bb8b98e064a7f5e2cd9b1a1640000000000000000000000000000000000000000000000000000000000001626")
	let buyReplacementPattern = orders.helpers.hexToBytes("0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")

	let sellCalldata = orders.helpers.hexToBytes("0x23b872dd000000000000000000000000123456cdf1d0d765b81de80ae3f5926bd0cc0e0c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001626")
	let sellReplacementPattern = orders.helpers.hexToBytes("0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000")

	let buyMergedData: string
	let sellMergedData: string

	if (buyReplacementPattern.length > 0) {
		buyMergedData = orders.helpers.guardedArrayReplace(buyCalldata, sellCalldata, buyReplacementPattern);
	}
	if (sellReplacementPattern.length > 0) {
		sellMergedData = orders.helpers.guardedArrayReplace(sellCalldata, buyCalldata, sellReplacementPattern);
	}
	// require(ArrayUtils.arrayEq(buyCalldata, sell.calldata));
	let decodedBuy = orders.helpers.decodeData(buyMergedData)
	log.info(
		"testCallDataReplacement :: guardedArrayReplace \n · · · buyMergedData( {} )\n · · · sellMergedData( {})",
		[buyMergedData, sellMergedData]
	)

	log.info(
		"testCallDataReplacement :: decodeData\n · · · method( {} )\n · · · from( {}) \n · · · to( {})\n · · · id( {}) ",
		[decodedBuy[0], decodedBuy[1], decodedBuy[2], decodedBuy[3]]
	)

	log.info(
		"testCallDataReplacement :: idAsInt\n · · · idAsHex( {})\n · · · idAsInt( {}) ",
		[decodedBuy[3], orders.helpers.hexToBigInt(decodedBuy[3]).toString()]
	)
}


export function testCallDataReplacement_0xdceaf1652a131f32a821468dc03a92df0edd86ea_2fb1796(): void {

	/*
	{
	  "data": {
		"buys": [
		  {
			"block": {
			  "number": "6949658"
			},
			"callData": "0x23b872dd00000000000000000000000000000000000000000000000000000000000000000000000000000000000000007e1dcf785f0353bf657c38ab7865c1f184efe2080000000000000000000000000000000000000000000000000000000002fb1796",
			"id": "0x10016680a0b0e922ecba9f6f6f1f4d6fc257c615e46d0ee8b56559c813bbba19",
			"maker": {
			  "address": "0x7e1dcf785f0353bf657c38ab7865c1f184efe208"
			},
			"replacementPattern": "0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
			"taker": {
			  "address": "0x8c5fc43ad00cc53e11f61bece329ddc5e3ea0929"
			},
			"target": {
			  "address": "0xdceaf1652a131f32a821468dc03a92df0edd86ea"
			}
		  }
		],
		"sells": [
		  {
			"callData": "0x23b872dd0000000000000000000000008c5fc43ad00cc53e11f61bece329ddc5e3ea092900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002fb1796",
			"id": "0x4add6a629d58a5f9022e4e252d336d4bc2f31a53df6114c5032efa76a4533892",
			"maker": {
			  "address": "0x8c5fc43ad00cc53e11f61bece329ddc5e3ea0929"
			},
			"replacementPattern": "0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000",
			"taker": {
			  "address": "0x0000000000000000000000000000000000000000"
			},
			"target": {
			  "address": "0xdceaf1652a131f32a821468dc03a92df0edd86ea"
			}
		  }
		]
	  }
	}
	*/

	let buyCalldata = orders.helpers.hexToBytes("0x23b872dd00000000000000000000000000000000000000000000000000000000000000000000000000000000000000007e1dcf785f0353bf657c38ab7865c1f184efe2080000000000000000000000000000000000000000000000000000000002fb1796")
	let buyReplacementPattern = orders.helpers.hexToBytes("0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")

	let sellCalldata = orders.helpers.hexToBytes("0x23b872dd0000000000000000000000008c5fc43ad00cc53e11f61bece329ddc5e3ea092900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002fb1796")
	let sellReplacementPattern = orders.helpers.hexToBytes("0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000")

	let buyMergedData: string
	let sellMergedData: string

	if (buyReplacementPattern.length > 0) {
		buyMergedData = orders.helpers.guardedArrayReplace(buyCalldata, sellCalldata, buyReplacementPattern);
	}
	if (sellReplacementPattern.length > 0) {
		sellMergedData = orders.helpers.guardedArrayReplace(sellCalldata, buyCalldata, sellReplacementPattern);
	}
	// require(ArrayUtils.arrayEq(buyCalldata, sell.calldata));
	let decodedBuy = orders.helpers.decodeData(buyMergedData)
	log.info(
		"testCallDataReplacement :: guardedArrayReplace \n · · · buyMergedData( {} )\n · · · sellMergedData( {})",
		[buyMergedData, sellMergedData]
	)

	log.info(
		"testCallDataReplacement :: decodeData\n · · · method( {} )\n · · · from( {}) \n · · · to( {})\n · · · id( {}) ",
		[decodedBuy[0], decodedBuy[1], decodedBuy[2], decodedBuy[3]]
	)

	log.info(
		"testCallDataReplacement :: idAsInt\n · · · idAsHex( {})\n · · · idAsInt( {}) ",
		[decodedBuy[3], orders.helpers.hexToBigInt(decodedBuy[3]).toString()]
	)
}