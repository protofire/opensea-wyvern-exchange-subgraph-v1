import { test } from "matchstick-as";
import { testCallDataReplacement } from "./callDataReplacement.test"



function runTests(): void {
	test(
		"testCallDataReplacement # 1",
		testCallDataReplacement
	)
}
runTests()