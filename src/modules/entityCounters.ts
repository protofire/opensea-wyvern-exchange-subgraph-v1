import { integer } from "@protofire/subgraph-toolkit"
import { EntityCounter } from "../../generated/schema"

export namespace entityCounters {

	export function loadOrCreateEntityCounter(
		parentId: string, name: string
	): EntityCounter {
		let id = helpers.getCounterparentId(parentId, name)
		let entity = EntityCounter.load(id)
		if (entity == null) {
			entity = new EntityCounter(id)
			entity.amount = integer.ZERO
			entity.name = name
		}
		return entity as EntityCounter
	}

	export function handleCounter(parentId: string, name: string): void {
		let entity = loadOrCreateEntityCounter(parentId, name)
		entity = mutations.increaseCounterAmount(entity)
		entity.save()
	}

	export namespace helpers {
		export function getCounterparentId(
			parentparentId: string, name: string
		) {
			return `${parentparentId}-${name}`
		}
	}

	export namespace mutations {
		export function increaseCounterAmount(entity: EntityCounter): EntityCounter {
			entity.amount = entity.amount.plus(integer.ONE)
			return entity as EntityCounter
		}
	}
}