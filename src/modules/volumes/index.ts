import { BigInt } from "@graphprotocol/graph-ts"
import { integer } from "@protofire/subgraph-toolkit"
import { MinuteVolume, HourVolume, DayVolume, WeekVolume } from "../../../generated/schema"

export namespace volumes {
	export namespace minute {
		export function getOrCreateMinuteVolume(
			assetId: string, tokenId: string, timeUnitId: string, epoch: BigInt
		): MinuteVolume {
			let id = assetId.concat("-").concat(tokenId).concat("-").concat(epoch.toString())
			let entity = MinuteVolume.load(id)
			if (entity == null) {
				entity = new MinuteVolume(id)
				entity.asset = assetId
				entity.ordersAmount = integer.ZERO
				entity.token = tokenId
				entity.tokenAmount = integer.ZERO
				entity.timeUnit = timeUnitId
			}
			return entity as MinuteVolume
		}

		export function increaseVolume(
			assetId: string, tokenId: string, timeUnitId: string,
			epoch: BigInt, tokenAmount: BigInt
		): MinuteVolume {
			let entity = getOrCreateMinuteVolume(assetId, tokenId, timeUnitId, epoch)
			entity.tokenAmount = entity.tokenAmount.plus(tokenAmount)
			entity.ordersAmount = entity.ordersAmount.plus(integer.ONE)
			return entity as MinuteVolume
		}
	}
	export namespace hour {
		export function getOrCreateHourVolume(
			assetId: string, tokenId: string, timeUnitId: string, epoch: BigInt
		): HourVolume {
			let id = assetId.concat("-").concat(tokenId).concat("-").concat(epoch.toString())
			let entity = HourVolume.load(id)
			if (entity == null) {
				entity = new HourVolume(id)
				entity.asset = assetId
				entity.ordersAmount = integer.ZERO
				entity.token = tokenId
				entity.tokenAmount = integer.ZERO
				entity.timeUnit = timeUnitId
			}
			return entity as HourVolume
		}

		export function increaseVolume(
			assetId: string, tokenId: string, timeUnitId: string,
			epoch: BigInt, tokenAmount: BigInt
		): HourVolume {
			let entity = getOrCreateHourVolume(assetId, tokenId, timeUnitId, epoch)
			entity.tokenAmount = entity.tokenAmount.plus(tokenAmount)
			entity.ordersAmount = entity.ordersAmount.plus(integer.ONE)
			return entity as HourVolume
		}
	}
	export namespace day {
		export function getOrCreateDayVolume(
			assetId: string, tokenId: string, timeUnitId: string, epoch: BigInt
		): DayVolume {
			let id = assetId.concat("-").concat(tokenId).concat("-").concat(epoch.toString())
			let entity = DayVolume.load(id)
			if (entity == null) {
				entity = new DayVolume(id)
				entity.asset = assetId
				entity.ordersAmount = integer.ZERO
				entity.token = tokenId
				entity.tokenAmount = integer.ZERO
				entity.timeUnit = timeUnitId
			}
			return entity as DayVolume
		}

		export function increaseVolume(
			assetId: string, tokenId: string, timeUnitId: string,
			epoch: BigInt, tokenAmount: BigInt
		): DayVolume {
			let entity = getOrCreateDayVolume(assetId, tokenId, timeUnitId, epoch)
			entity.tokenAmount = entity.tokenAmount.plus(tokenAmount)
			entity.ordersAmount = entity.ordersAmount.plus(integer.ONE)
			return entity as DayVolume
		}
	}
	export namespace week {
		export function getOrCreateWeekVolume(
			assetId: string, tokenId: string, timeUnitId: string, epoch: BigInt
		): WeekVolume {
			let id = assetId.concat("-").concat(tokenId).concat("-").concat(epoch.toString())
			let entity = WeekVolume.load(id)
			if (entity == null) {
				entity = new WeekVolume(id)
				entity.asset = assetId
				entity.ordersAmount = integer.ZERO
				entity.token = tokenId
				entity.tokenAmount = integer.ZERO
				entity.timeUnit = timeUnitId
			}
			return entity as WeekVolume
		}

		export function increaseVolume(
			assetId: string, tokenId: string, timeUnitId: string,
			epoch: BigInt, tokenAmount: BigInt
		): WeekVolume {
			let entity = getOrCreateWeekVolume(assetId, tokenId, timeUnitId, epoch)
			entity.tokenAmount = entity.tokenAmount.plus(tokenAmount)
			entity.ordersAmount = entity.ordersAmount.plus(integer.ONE)
			return entity as WeekVolume
		}
	}
}