import { BigInt } from "@graphprotocol/graph-ts";
import { globalState, shared } from ".";
import { Day, Hour, Minute, Week } from "../../generated/schema";

export namespace timeSeries {

	class TimeSerieInfo {
		id: string
		epoch: BigInt
		constructor(
			_id: string,
			_epoch: BigInt
		) {
			this.id = _id
			this.epoch = _epoch
		}
	}
	export class HandleTimeSeriesResult {
		minute: TimeSerieInfo
		hour: TimeSerieInfo
		day: TimeSerieInfo
		week: TimeSerieInfo

		constructor(
			_minute: TimeSerieInfo,
			_hour: TimeSerieInfo,
			_day: TimeSerieInfo,
			_week: TimeSerieInfo
		) {
			this.minute = _minute
			this.hour = _hour
			this.day = _day
			this.week = _week
		}
	}

	export function handleTimeSeries(timestamp: BigInt): HandleTimeSeriesResult {

		let minute = timeSeries.minutes.getOrCreateMinute(
			shared.date.truncateMinutes(timestamp)
		)
		minute.save()

		let hour = timeSeries.hours.getOrCreateHour(
			shared.date.truncateHours(timestamp)
		)
		hour.save()

		let day = timeSeries.days.getOrCreateDay(
			shared.date.truncateDays(timestamp)
		)
		day.save()

		let week = timeSeries.weeks.getOrCreateWeek(
			shared.date.truncateWeeks(timestamp)
		)
		week.save()

		return new HandleTimeSeriesResult(
			new TimeSerieInfo(minute.id, minute.epoch),
			new TimeSerieInfo(hour.id, hour.epoch),
			new TimeSerieInfo(day.id, day.epoch),
			new TimeSerieInfo(week.id, week.epoch)
		)
	}

	export namespace minutes {
		export function getOrCreateMinute(epoch: BigInt): Minute {
			let id = "minute-".concat(epoch.toString())
			let entity = Minute.load(id)
			if (entity == null) {
				entity = new Minute(id)
				entity.epoch = epoch
				globalState.helpers.updateGlobal_minutes_Counter
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
				globalState.helpers.updateGlobal_hours_Counter
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
				globalState.helpers.updateGlobal_days_Counter
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
				globalState.helpers.updateGlobal_weeks_Counter
			}
			return entity as Week
		}
	}
}
