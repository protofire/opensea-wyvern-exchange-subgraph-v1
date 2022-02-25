import { BigInt } from "@graphprotocol/graph-ts"
import { integer } from "@protofire/subgraph-toolkit"
import { MinuteVolume, HourVolume, DayVolume, WeekVolume } from "../../generated/schema"
import { timeSeries } from "./";
export namespace volumes {

	export class VolumesResult {
		minuteVolumeId: string
		hourVolumeId: string
		dayVolumeId: string
		weekVolumeId: string
		constructor(
			_minuteVolumeId: string,
			_hourVolumeId: string,
			_dayVolumeId: string,
			_weekVolumeId: string
		) {
			this.minuteVolumeId = _minuteVolumeId
			this.hourVolumeId = _hourVolumeId
			this.dayVolumeId = _dayVolumeId
			this.weekVolumeId = _weekVolumeId
		}
	}

	export function handleErc20Volumes(
		paymentTokenId: string, erc20Amount: BigInt,
		timeSeriesResult: timeSeries.HandleTimeSeriesResult
	): VolumesResult {

		let minuteVolume = volumes.minute.increaseVolume(
			paymentTokenId, timeSeriesResult.minute.id,
			timeSeriesResult.minute.epoch.toString(), erc20Amount
		)
		minuteVolume.save()

		let hourVolume = volumes.hour.increaseVolume(
			paymentTokenId, timeSeriesResult.hour.id,
			timeSeriesResult.hour.epoch.toString(), erc20Amount
		)
		hourVolume.save()

		let dayVolume = volumes.day.increaseVolume(
			paymentTokenId, timeSeriesResult.day.id,
			timeSeriesResult.day.epoch.toString(), erc20Amount,
		)
		dayVolume.save()

		let weekVolume = volumes.week.increaseVolume(
			paymentTokenId, timeSeriesResult.week.id,
			timeSeriesResult.week.epoch.toString(), erc20Amount,
		)
		weekVolume.save()

		return new VolumesResult(
			minuteVolume.id, hourVolume.id,
			dayVolume.id, weekVolume.id
		)

	}
	export function handleNftVolumes(
		nftContractId: string, timeSeriesResult: timeSeries.HandleTimeSeriesResult
	): VolumesResult {

		let minuteVolume = volumes.minute.increaseVolume(
			nftContractId, timeSeriesResult.minute.id,
			timeSeriesResult.minute.epoch.toString(), integer.ONE
		)
		minuteVolume.save()

		let hourVolume = volumes.hour.increaseVolume(
			nftContractId, timeSeriesResult.minute.id,
			timeSeriesResult.minute.epoch.toString(), integer.ONE
		)
		hourVolume.save()

		let dayVolume = volumes.day.increaseVolume(
			nftContractId, timeSeriesResult.minute.id,
			timeSeriesResult.minute.epoch.toString(), integer.ONE
		)
		dayVolume.save()

		let weekVolume = volumes.week.increaseVolume(
			nftContractId, timeSeriesResult.minute.id,
			timeSeriesResult.minute.epoch.toString(), integer.ONE
		)
		weekVolume.save()

		return new VolumesResult(
			minuteVolume.id, hourVolume.id,
			dayVolume.id, weekVolume.id
		)
	}

	export namespace minute {
		export function getOrCreateMinuteVolume(
			contractId: string, timeUnitId: string, epoch: string
		): MinuteVolume {
			let id = helpers.getVolumeId("minute", contractId, epoch)
			let entity = MinuteVolume.load(id)
			if (entity == null) {
				entity = new MinuteVolume(id)
				entity.contract = contractId
				entity.amount = integer.ZERO
				entity.transactionAmount = integer.ZERO
				entity.timeUnit = timeUnitId
			}
			return entity as MinuteVolume
		}

		export function increaseVolume(
			contractId: string, timeUnitId: string, epoch: string, tokenAmount: BigInt,
		): MinuteVolume {
			let entity = getOrCreateMinuteVolume(contractId, timeUnitId, epoch)
			entity.amount = entity.amount.plus(tokenAmount)
			entity.transactionAmount = entity.transactionAmount.plus(tokenAmount)
			return entity as MinuteVolume
		}
	}
	export namespace hour {
		export function getOrCreateHourVolume(
			contractId: string, timeUnitId: string, epoch: string
		): HourVolume {
			let id = helpers.getVolumeId("hour", contractId, epoch)
			let entity = HourVolume.load(id)
			if (entity == null) {
				entity = new HourVolume(id)
				entity.contract = contractId
				entity.amount = integer.ZERO
				entity.transactionAmount = integer.ZERO
				entity.timeUnit = timeUnitId
				entity.timeUnit = timeUnitId
			}
			return entity as HourVolume
		}

		export function increaseVolume(
			contractId: string, timeUnitId: string, epoch: string, tokenAmount: BigInt,
		): HourVolume {
			let entity = getOrCreateHourVolume(contractId, timeUnitId, epoch)
			entity.amount = entity.amount.plus(tokenAmount)
			entity.transactionAmount = entity.transactionAmount.plus(tokenAmount)
			return entity as HourVolume
		}
	}
	export namespace day {
		export function getOrCreateDayVolume(
			contractId: string, timeUnitId: string, epoch: string
		): DayVolume {
			let id = helpers.getVolumeId("day", contractId, epoch)
			let entity = DayVolume.load(id)
			if (entity == null) {
				entity = new DayVolume(id)
				entity.contract = contractId
				entity.amount = integer.ZERO
				entity.transactionAmount = integer.ZERO
				entity.timeUnit = timeUnitId
			}
			return entity as DayVolume
		}

		export function increaseVolume(
			contractId: string, timeUnitId: string, epoch: string, tokenAmount: BigInt,
		): DayVolume {
			let entity = getOrCreateDayVolume(contractId, timeUnitId, epoch)
			entity.amount = entity.amount.plus(tokenAmount)
			entity.transactionAmount = entity.transactionAmount.plus(tokenAmount)
			return entity as DayVolume
		}
	}
	export namespace week {
		export function getOrCreateWeekVolume(
			contractId: string, timeUnitId: string, epoch: string
		): WeekVolume {
			let id = helpers.getVolumeId("week", contractId, epoch)
			let entity = WeekVolume.load(id)
			if (entity == null) {
				entity = new WeekVolume(id)
				entity.contract = contractId
				entity.amount = integer.ZERO
				entity.transactionAmount = integer.ZERO
				entity.timeUnit = timeUnitId
			}
			return entity as WeekVolume
		}

		export function increaseVolume(
			contractId: string, timeUnitId: string, epoch: string, tokenAmount: BigInt,
		): WeekVolume {
			let entity = getOrCreateWeekVolume(contractId, timeUnitId, epoch)
			entity.amount = entity.amount.plus(tokenAmount)
			entity.transactionAmount = entity.transactionAmount.plus(tokenAmount)
			return entity as WeekVolume
		}
	}
	export namespace helpers {
		export function getVolumeId(
			prefix: string, contractId: string, epoch: string
		): string {
			return `${prefix}-${contractId}-${epoch}`
		}
	}
}