import { integer } from "@protofire/subgraph-toolkit";
import { BigInt, log } from "@graphprotocol/graph-ts";
import { Block } from "../../../generated/schema";


export namespace blocks {
	export namespace services {

		export function getOrCreateBlock(
			id: string, timestamp: BigInt, number: BigInt
		): Block {
			let block = Block.load(id)
			if (block == null) {
				block = new Block(id)
				block.timestamp = timestamp
				block.number = number
				// block.erc721TransactionsCount = integer.ZERO
			}
			return block as Block
		}
	}
	export namespace helpers {

		// export function increaseErc721TransactionsCount(entity: Block): Block {
		// 	entity.erc721TransactionsCount = entity.erc721TransactionsCount.plus(integer.ONE)
		// 	return entity as Block
		// }
	}
}