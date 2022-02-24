import { Sale } from "../../generated/schema"

export namespace sales {
	export namespace helpers {
		export function createSaleId(
			contractId: string, nftId: string, timestamp: string
		): string {
			return `${contractId}-${nftId}-${timestamp}`
		}
	}
	export function getOrCreateSale(
		contractId: string, nftId: string,
		paymentTokenId: string, timestamp: string
	): Sale {
		let id = helpers.createSaleId(contractId, nftId, timestamp)
		let entity = Sale.load(id)
		if (entity == null) {
			entity = new Sale(id)
			entity.nft = nftId
			entity.contract = contractId
			entity.token = paymentTokenId
		}
		return entity as Sale
	}
}