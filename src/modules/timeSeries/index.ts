import { BigInt } from "@graphprotocol/graph-ts";
import { Day, Hour, Minute, Week } from "../../../generated/schema";

export namespace timeSeries {
	export namespace minutes {
		export function getOrCreateMinute(epoch: BigInt): Minute {
			let id = epoch.toString()
			let entity = Minute.load(id)
			if (entity == null) {
				entity = new Minute(id)
			}
			return entity as Minute
		}
	}
	export namespace hours {
		export function getOrCreateHour(epoch: BigInt): Hour {
			let id = epoch.toString()
			let entity = Hour.load(id)
			if (entity == null) {
				entity = new Hour(id)
			}
			return entity as Hour
		}
	}
	export namespace days {
		export function getOrCreateDay(epoch: BigInt): Day {
			let id = epoch.toString()
			let entity = Day.load(id)
			if (entity == null) {
				entity = new Day(id)
			}
			return entity as Day
		}
	}
	export namespace weeks {
		export function getOrCreateWeek(epoch: BigInt): Week {
			let id = epoch.toString()
			let entity = Week.load(id)
			if (entity == null) {
				entity = new Week(id)
			}
			return entity as Week
		}
	}
}
