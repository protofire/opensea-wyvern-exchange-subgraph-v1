import { BigInt } from "@graphprotocol/graph-ts"
import { integer } from "@protofire/subgraph-toolkit"
import { globalState } from "."
import { Balance } from "../../generated/schema"

export namespace balances {
	export namespace helpers {
		export function getBalanceId(accountId: string, tokenId: string): string {
			return accountId + "@" + tokenId
		}
	}
	export function getOrCreateBalance(
		ownerId: string, tokenId: string
	): Balance {
		let id = helpers.getBalanceId(ownerId, tokenId)
		let entity = Balance.load(id)
		if (entity == null) {
			entity = new Balance(id)
			entity.account = ownerId
			entity.token = tokenId
			entity.amount = integer.ZERO
			globalState.helpers.updateGlobal_balances_Counter()

		}
		return entity as Balance
	}
	export function increaseBalanceAmount(
		ownerId: string, tokenId: string, amount: BigInt
	): Balance {
		let entity = getOrCreateBalance(ownerId, tokenId)
		entity.amount = entity.amount.plus(amount)
		return entity as Balance
	}

	export function decreaseBalanceAmount(
		ownerId: string, tokenId: string, amount: BigInt
	): Balance {
		let entity = getOrCreateBalance(ownerId, tokenId)
		entity.amount = entity.amount.minus(amount)
		return entity as Balance
	}
}