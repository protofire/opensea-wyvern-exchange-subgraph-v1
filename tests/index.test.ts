import { test } from "matchstick-as";
import {
	decodeSingleSale_0x4fece400c0d3db0937162ab44bab34445626ecfe_1626,
	decodeSingleSale_0xdceaf1652a131f32a821468dc03a92df0edd86ea_2fb1796
} from "./decodeSingleSale.test";
import {
	testDecoderUpgrade,
} from "./callDataReplacement.test"
import {
	decodeBatchSale,
} from "./decodeBatchSale.test"



function runTests(): void {
	test(
		"decodeSingleSale_0x4fece400c0d3db0937162ab44bab34445626ecfe_1626",
		decodeSingleSale_0x4fece400c0d3db0937162ab44bab34445626ecfe_1626
	)
	test(
		"decodeSingleSale_0xdceaf1652a131f32a821468dc03a92df0edd86ea_2fb1796",
		decodeSingleSale_0xdceaf1652a131f32a821468dc03a92df0edd86ea_2fb1796
	)
	test(
		"testDecoderUpgrade",
		testDecoderUpgrade
	)
	test(
		"decodeBatchSale",
		decodeBatchSale
	)
	// test(
	// 	"test_decode_transferFrom_noTrail",
	// 	test_decode_transferFrom_noTrail
	// )
	// test(
	// 	"testBatch",
	// 	testBatch
	// )
}
runTests()