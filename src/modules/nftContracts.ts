import { Bytes } from "@graphprotocol/graph-ts"
import { globalState } from "."
import { NftContract } from "../../generated/schema"

export namespace nftContracts {
	export function loadNftContract(id: string): NftContract {
		let entity = NftContract.load(id)
		return entity as NftContract
	}
	export function getOrCreateNftContract(address: Bytes): NftContract {
		let id = `nft-${address.toHexString()}`
		let entity = NftContract.load(id)
		if (entity == null) {
			entity = new NftContract(id)
			entity.address = address
			globalState.helpers.updateGlobal_nfts_Counter()

		}
		return entity as NftContract
	}
}