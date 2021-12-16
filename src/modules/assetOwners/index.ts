import { AssetOwner } from "../../../generated/schema"

export namespace assetOwners {
	export function getOrCreateAssetOwner(
		assetId: string, ownerId: string
	): AssetOwner {
		let id = assetId.concat("-").concat(ownerId)
		let entity = AssetOwner.load(id)
		if (entity == null) {
			entity = new AssetOwner(id)
			entity.owner = ownerId
			entity.asset = assetId
		}
		return entity as AssetOwner
	}
}