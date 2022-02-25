import { BigInt } from "@graphprotocol/graph-ts";
import { Day, Hour, Minute, Week } from "../../generated/schema";

export namespace timeSeries {
	export namespace minutes {
		export function getOrCreateMinute(epoch: BigInt): Minute {
			let id = "minute-".concat(epoch.toString())
			let entity = Minute.load(id)
			if (entity == null) {
				entity = new Minute(id)
				entity.epoch = epoch
			}
			return entity as Minute
		}
	}
	export namespace hours {
		export function getOrCreateHour(epoch: BigInt): Hour {
			let id = "hour-".concat(epoch.toString())
			let entity = Hour.load(id)
			if (entity == null) {
				entity = new Hour(id)
				entity.epoch = epoch
			}
			return entity as Hour
		}
	}
	export namespace days {
		export function getOrCreateDay(epoch: BigInt): Day {
			let id = "day-".concat(epoch.toString())
			let entity = Day.load(id)
			if (entity == null) {
				entity = new Day(id)
				entity.epoch = epoch
			}
			return entity as Day
		}
	}
	export namespace weeks {
		export function getOrCreateWeek(epoch: BigInt): Week {
			let id = "week-".concat(epoch.toString())
			let entity = Week.load(id)
			if (entity == null) {
				entity = new Week(id)
				entity.epoch = epoch
			}
			return entity as Week
		}
	}
}
