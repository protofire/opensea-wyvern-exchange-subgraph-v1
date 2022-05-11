import { log } from "matchstick-as"
import { decoder } from "./modules"
import { abi, shared } from "../src/modules"

export function testDecoderUpgrade(): void {
	let buyCalldata = decoder.helpers.hexToBytes("0x23b872dd00000000000000000000000000000000000000000000000000000000000000000000000000000000000000007e1dcf785f0353bf657c38ab7865c1f184efe2080000000000000000000000000000000000000000000000000000000002fb1796")
	let buyReplacementPattern = decoder.helpers.hexToBytes("0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")
	let sellCalldata = decoder.helpers.hexToBytes("0x23b872dd0000000000000000000000008c5fc43ad00cc53e11f61bece329ddc5e3ea092900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002fb1796")
	let decodedResult = abi.decodeSingleNftData(
		buyCalldata,
		sellCalldata,
		buyReplacementPattern
	)

	log.info(
		"\ntestDecoderUpgrade :: abi decoded\n · · · method( {} )\n · · · from( {}) \n · · · to( {})\n · · · id( {}) ",
		[decodedResult.method, decodedResult.from.toHexString(), decodedResult.to.toHexString(), decodedResult.token.toString()]
	)
	let orderDecoded = decoder.helpers.decodeData(decoder.helpers.guardedArrayReplace(
		buyCalldata, sellCalldata, buyReplacementPattern
	))
	log.info(
		"\ntestDecoderUpgrade :: order decoded\n · · · method( {} )\n · · · from( {}) \n · · · to( {})\n · · · id( {}) ",
		[orderDecoded[0], orderDecoded[1], orderDecoded[2], shared.helpers.hexToBigInt(orderDecoded[3]).toString()]
	)
}