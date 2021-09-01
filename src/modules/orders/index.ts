import { Order } from "../../../generated/schema";

export namespace orders {
	export function getOrCreateOrder(id: string): Order {
		let entity = Order.load(id)
		if (entity == null) {
			entity = new Order(id)
		}
		return entity as Order
	}
}