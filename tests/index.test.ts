import { test } from "matchstick-as";
import {
	testCallDataReplacement_0x4fece400c0d3db0937162ab44bab34445626ecfe_1626,
	testCallDataReplacement_0xdceaf1652a131f32a821468dc03a92df0edd86ea_2fb1796,
	testDecoderUpgrade,
	test_decode_transferFrom_noTrail,
	testBatch
} from "./callDataReplacement.test"



function runTests(): void {
	test(
		"testCallDataReplacement_0x4fece400c0d3db0937162ab44bab34445626ecfe_1626",
		testCallDataReplacement_0x4fece400c0d3db0937162ab44bab34445626ecfe_1626
	)
	test(
		"testCallDataReplacement_0xdceaf1652a131f32a821468dc03a92df0edd86ea_2fb1796",
		testCallDataReplacement_0xdceaf1652a131f32a821468dc03a92df0edd86ea_2fb1796
	)
	test(
		"testDecoderUpgrade",
		testDecoderUpgrade
	)
	test(
		"test_decode_transferFrom_noTrail",
		test_decode_transferFrom_noTrail
	)
	test(
		"testBatch",
		testBatch
	)
}
runTests()