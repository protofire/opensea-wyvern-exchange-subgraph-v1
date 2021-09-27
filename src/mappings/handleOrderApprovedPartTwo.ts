import {
	OrderApprovedPartTwo
} from "../../generated/openseaWyvernExchange/openseaWyvernExchange"

import {
	balances,
	orders,
	shared,
	tokens,
} from "../modules"

export function handleOrderApprovedPartTwo(event: OrderApprovedPartTwo): void {
	shared.helpers.handleEvmMetadata(event)
	// TODO event entity

	let token = tokens.getOrCreateToken(event.params.paymentToken)
	token.save()

	let order = orders.getOrCreateOrder(event.params.hash.toHex())
	order = orders.handleOrderPartTwo(event.params, order, token.id)
	order.save()

	let totalTakerAmount = shared.helpers.calcTotalTakerAmount(order)
	let takerBalance = balances.increaseBalanceAmount(order.taker, order.paymentToken, totalTakerAmount)
	takerBalance.save()
}
