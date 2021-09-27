import {
	OrderCancelled,
	OrdersMatched,
	OwnershipRenounced,
	OwnershipTransferred
} from "../../generated/openseaWyvernExchange/openseaWyvernExchange"
import {
	orders,
	shared
} from "../modules"


export * from "./handleOrderApprovedPartOne"
export * from "./handleOrderApprovedPartTwo"


export function handleOrderCancelled(event: OrderCancelled): void {
	shared.helpers.handleEvmMetadata(event)
	// TODO event entity
	let order = orders.cancelOrder(event.params.hash.toHex())
	order.save()
}

export function handleOrdersMatched(event: OrdersMatched): void {
	shared.helpers.handleEvmMetadata(event)
	// TODO event entity

}

export function handleOwnershipRenounced(event: OwnershipRenounced): void {
	// shared.helpers.handleEvmMetadata(event)
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
	// shared.helpers.handleEvmMetadata(event)
}
