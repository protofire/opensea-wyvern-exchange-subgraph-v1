import { BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { globalState, timeSeries } from ".";
import { Block, Transaction } from "../../generated/schema";

export namespace metadata {

	export class MetadataResult {
		blockId: string
		txId: string
		constructor(
			_blockId: string,
			_txId: string
		) {
			this.blockId = _blockId
			this.txId = _txId
		}
	}

	export function handleEvmMetadata(
		evmBlock: ethereum.Block,
		evmTransaction: ethereum.Transaction,
		timeSeriesResult: timeSeries.HandleTimeSeriesResult
	): MetadataResult {
		let block = blocks.getOrCreateBlock(evmBlock.timestamp, evmBlock.number)
		block.minute = timeSeriesResult.minute.id
		block.hour = timeSeriesResult.hour.id
		block.day = timeSeriesResult.day.id
		block.week = timeSeriesResult.week.id
		block.save()

		let transaction = transactions.getOrCreateTransactionMeta(
			block.id,
			evmTransaction.hash,
			evmTransaction.from,
			evmTransaction.gasPrice,
		)
		transaction.minute = timeSeriesResult.minute.id
		transaction.hour = timeSeriesResult.hour.id
		transaction.day = timeSeriesResult.day.id
		transaction.week = timeSeriesResult.week.id
		transaction.save()

		return new MetadataResult(
			block.id, transaction.id
		)
	}

	export namespace blocks {
		export function getOrCreateBlock(
			timestamp: BigInt, number: BigInt
		): Block {
			let id = number.toString()
			let block = Block.load(id)
			if (block == null) {
				block = new Block(id)
				block.timestamp = timestamp
				block.number = number
				// block.erc721TransactionsCount = integer.ZERO
				globalState.helpers.updateGlobal_blocks_Counter()

			}
			return block as Block
		}
	}

	export namespace transactions {
		export function getOrCreateTransactionMeta(
			blockId: string, hash: Bytes,
			from: Bytes, gasPrice: BigInt
		): Transaction {
			let txId = hash.toHex()
			let meta = Transaction.load(txId)
			if (meta == null) {
				meta = new Transaction(txId)
				meta.block = blockId
				meta.hash = hash
				meta.from = from
				meta.gasPrice = gasPrice
				globalState.helpers.updateGlobal_transactions_Counter()

			}
			return meta as Transaction
		}

	}
}