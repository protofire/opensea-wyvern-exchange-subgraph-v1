import { Bytes } from "@graphprotocol/graph-ts"
import { Token } from "../../generated/schema"

export namespace tokens {
	export function getOrCreateToken(address: Bytes): Token {
		let id = address.toHex()
		let entity = Token.load(id)
		if (entity == null) {
			entity = new Token(id)
			entity.address = address
		}
		return entity as Token
	}
}