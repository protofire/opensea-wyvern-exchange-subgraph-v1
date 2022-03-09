import { globalState } from "."
import { Sale } from "../../generated/schema"

export namespace sales {
	export namespace helpers {
		export function createSaleId(timestamp: string): string {
			return `sale-${timestamp}`
		}
	}
	export function getOrCreateSale(
		timestamp: string, paymentTokenId: string
	): Sale {
		let id = helpers.createSaleId(timestamp)
		let entity = Sale.load(id)
		if (entity == null) {
			entity = new Sale(id)
			entity.token = paymentTokenId
			globalState.helpers.updateGlobal_sales_Counter()
		}
		return entity as Sale
	}
}