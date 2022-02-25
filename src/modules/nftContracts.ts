import { Bytes } from "@graphprotocol/graph-ts"
import { NftContract } from "../../generated/schema"

export namespace nftContracts {
	export function loadNftContract(id: string): NftContract {
		let entity = NftContract.load(id)
		return entity as NftContract
	}
	export function getOrCreateNftContract(address: Bytes): NftContract {
		let id = address.toHex()
		let entity = NftContract.load(id)
		if (entity == null) {
			entity = new NftContract(id)
			entity.address = address
		}
		return entity as NftContract
	}
}