import { Bytes } from "@graphprotocol/graph-ts"
import { Asset } from "../../generated/schema"

export namespace assets {
	export function loadAsset(id: string): Asset {
		let entity = Asset.load(id)
		return entity as Asset
	}
	export function getOrCreateAsset(address: Bytes): Asset {
		let id = address.toHex()
		let entity = Asset.load(id)
		if (entity == null) {
			entity = new Asset(id)
			entity.address = address
		}
		return entity as Asset
	}
}