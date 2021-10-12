import { BigInt } from "@graphprotocol/graph-ts"
import { integer } from "@protofire/subgraph-toolkit"
import { MinuteVolume, HourVolume } from "../../../generated/schema"

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

		export function increaseMinuteVolume(
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

		export function increaseMinuteVolume(
			assetId: string, tokenId: string, timeUnitId: string,
			epoch: BigInt, tokenAmount: BigInt
		): HourVolume {
			let entity = getOrCreateHourVolume(assetId, tokenId, timeUnitId, epoch)
			entity.tokenAmount = entity.tokenAmount.plus(tokenAmount)
			entity.ordersAmount = entity.ordersAmount.plus(integer.ONE)
			return entity as HourVolume
		}
	}
}