import { BigInt } from '@graphprotocol/graph-ts'

export let SECONDS_IN_MINUTE = 60 * 60
export let SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60
export let SECONDS_IN_DAY = SECONDS_IN_HOUR * 24
export let SECONDS_IN_WEEK = SECONDS_IN_DAY * 7
export namespace shared {
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