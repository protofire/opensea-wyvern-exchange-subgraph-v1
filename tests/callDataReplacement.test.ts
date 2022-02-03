
import { log } from "matchstick-as"
import { orders } from "./modules"


export function testCallDataReplacement(): void {
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