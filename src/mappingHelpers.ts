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
		let nftId = decoded.token
		let contract = assets.getOrCreateAsset(contractAddress)
		contract.save()
		// transfer

		let sale = sales.getOrCreateSale(
			contract.id, nftId.toHexString(), paymentTokenId, timestamp.toString()
		)
		sale.save()

		let buyer = accounts.getOrCreateAccount(to, transactionId)
		buyer.lastUpdatedAt = transactionId
		buyer.save()

		let seller = accounts.getOrCreateAccount(from, transactionId)
		seller.lastUpdatedAt = transactionId
		seller.save()


		handleNftTransfer(
			contract.address!, seller.id, buyer.id, nftId, paymentTokenId,
			paymentAmount, timestamp, transactionId, sale.id
		)

		handleErc20Transfer(
			seller.id, buyer.id, paymentTokenId,
			paymentAmount, sale.id, timestamp,
		)

	}


	export function handleBundleSale(
		decoded: abi.Decoded_atomicize_Result,
		transactionId: string, paymentTokenId: string,
		paymentAmount: BigInt, timestamp: BigInt
	): void {

		for (let i = 0; i < decoded.transfers.length; i++) {
			let from = decoded.transfers[i].from
			let to = decoded.transfers[i].to
			let nftId = decoded.transfers[i].token
			let contractAddress = decoded.addressList[i]

			let buyer = accounts.getOrCreateAccount(to, transactionId)
			buyer.lastUpdatedAt = transactionId
			buyer.save()

			let seller = accounts.getOrCreateAccount(from, transactionId)
			seller.lastUpdatedAt = transactionId
			seller.save()


			let contract = assets.getOrCreateAsset(contractAddress)
			contract.save()

			let nft = nfts.changeNftOwner(nftId, contract.id, buyer.id)
			nft.save()
		}

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

	function handleNftTransfer(
		contractAddress: Address, seller: string, buyer: string, nftId: BigInt,
		paymentTokenId: string, paymentAmount: BigInt, timestamp: BigInt,
		transactionId: string, saleId: string

	): void {

		let contract = assets.getOrCreateAsset(contractAddress)
		contract.save()

		let nft = nfts.changeNftOwner(nftId, contract.id, buyer)
		nft.save()

		let nftTransaction = nfts.getOrCreateNftTransfer(
			nft.id, timestamp, seller, buyer, saleId
		)
		nftTransaction.save()
	}

	function handleErc20Transfer(
		buyerId: string, sellerId: string,
		paymentTokenId: string, paymentAmount: BigInt,
		saleId: string, timestamp: BigInt
	): void {

		let sellerBalance = balances.increaseBalanceAmount(
			sellerId,
			paymentTokenId,
			paymentAmount
		)
		sellerBalance.save()


		let buyerBalance = balances.decreaseBalanceAmount(
			buyerId,
			paymentTokenId,
			paymentAmount
		)
		buyerBalance.save()

		let erc20Transaction = tokens.getOrCreateErc20Transaction(
			timestamp, paymentTokenId, buyerId, sellerId, paymentAmount, saleId
		)
		erc20Transaction.save()
	}


}
