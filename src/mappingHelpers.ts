import { Address, BigInt } from "@graphprotocol/graph-ts";
import { abi, accounts, assets, balances, nfts, sales, tokens } from "./modules";

export namespace mappingHelpers {

	// TODO document
	export function handleSingleSale(
		decoded: abi.Decoded_TransferFrom_Result,
		transactionId: string, contractAddress: Address,
		paymentTokenId: string, paymentAmount: BigInt,
		timestamp: BigInt
	): void {
		let from = decoded.from
		let to = decoded.to
		let tokenId = decoded.token

		let buyer = accounts.getOrCreateAccount(to, transactionId)
		buyer.lastUpdatedAt = transactionId
		buyer.save()

		let seller = accounts.getOrCreateAccount(from, transactionId)
		seller.lastUpdatedAt = transactionId
		seller.save()

		let contract = assets.getOrCreateAsset(contractAddress)
		contract.save()

		let nft = nfts.changeNftOwner(tokenId, contract.id, buyer.id)
		nft.save()

		let sale = sales.getOrCreateSale(
			contract.id, nft.id, paymentTokenId, timestamp.toString()
		)
		sale.save()

		let nftTransaction = nfts.getOrCreateNftTransfer(
			nft.id, timestamp, seller.id, buyer.id, sale.id
		)
		nftTransaction.save()

	}

}
