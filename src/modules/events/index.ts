import { BigInt } from "@graphprotocol/graph-ts"
import { Erc20Transaction } from "../../../generated/schema"


export namespace events {
	export function getOrCreateErc20Transaction(
		timestamp: BigInt, tokenId: string, from: string, to: string, amount: BigInt
	): Erc20Transaction {
		let id = timestamp.toString().concat("-").concat(tokenId)
		let entity = Erc20Transaction.load(id)
		if (entity == null) {
			entity = new Erc20Transaction(id)
			entity.timestamp = timestamp
			entity.from = from
			entity.to = to
			entity.token = tokenId
			entity.amount = amount
		}
		return entity as Erc20Transaction
	}
}