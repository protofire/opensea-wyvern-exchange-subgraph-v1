import { OrderApprovedPartOne } from "../../../generated/schema"


export namespace events {
	export function getOrCreateOrderApprovedPartOne(id: string): OrderApprovedPartOne {
		let entity = OrderApprovedPartOne.load(id)
		if (entity == null) {
			entity = new OrderApprovedPartOne(id)
		}
		return entity as OrderApprovedPartOne
	}
}