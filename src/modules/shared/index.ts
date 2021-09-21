import { BigInt } from '@graphprotocol/graph-ts'
import { ethereum } from "@graphprotocol/graph-ts";
import { blocks, transactions } from "../index";

export let SECONDS_IN_MINUTE = 60 * 60
export let SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60
export let SECONDS_IN_DAY = SECONDS_IN_HOUR * 24
export let SECONDS_IN_WEEK = SECONDS_IN_DAY * 7
export namespace shared {
	export namespace helpers {
		export function handleEvmMetadata(event: ethereum.Event): void {
			let blockId = event.block.number.toString()
			let txHash = event.transaction.hash

			let block = blocks.services.getOrCreateBlock(blockId, event.block.timestamp, event.block.number)
			block.save()

			let transaction = transactions.getOrCreateTransactionMeta(
				txHash.toHexString(),
				blockId,
				txHash,
				event.transaction.from,
				event.transaction.gasPrice,
			)
			transaction.save()
		}
		export function i32ToString(int32: i32): string {
			let val = BigInt.fromI32(int32).toString()
			// log.info("@@@@@@  i32 to hex: " + hex, [])
			return val
		}
	}
	export namespace date {
		export let ONE_MINUTE = BigInt.fromI32(SECONDS_IN_MINUTE)
		export let ONE_HOUR = BigInt.fromI32(SECONDS_IN_MINUTE)
		export let ONE_DAY = BigInt.fromI32(SECONDS_IN_HOUR)
		export let ONE_WEEK = BigInt.fromI32(SECONDS_IN_DAY)

		export function truncateDate(timestamp: BigInt, interval: BigInt): BigInt {
			return timestamp.div(interval).times(interval)
		}

		// export function truncateSeconds(timestamp: BigInt): BigInt {
		// 	return truncateDate(timestamp, ONE_MINUTE)
		// }

		export function truncateMinutes(timestamp: BigInt): BigInt {
			return truncateDate(timestamp, ONE_MINUTE)
		}

		export function truncateHours(timestamp: BigInt): BigInt {
			return truncateDate(timestamp, ONE_HOUR)
		}

		export function truncateDays(timestamp: BigInt): BigInt {
			return truncateDate(timestamp, ONE_DAY)
		}

		export function truncateWeeks(timestamp: BigInt): BigInt {
			return timestamp.div(ONE_WEEK).times(ONE_WEEK)
		}
	}

}