import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Transaction } from "../../../generated/schema";


export namespace transactions {
	export function getOrCreateTransactionMeta(
		blockId: string, hash: Bytes,
		from: Bytes, gasPrice: BigInt
	): Transaction {
		let txId = hash.toHex()
		let meta = Transaction.load(id)
		if (meta == null) {
			meta = new Transaction(id)
			meta.block = blockId
			meta.hash = hash
			meta.from = from
			meta.gasPrice = gasPrice
		}
		return meta as Transaction
	}

}