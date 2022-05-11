import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { log } from "matchstick-as";

export namespace abi {


	export class Decoded_atomicize_Result {
		method: string
		addressList: Array<Address>
		transfers: Array<Decoded_TransferFrom_Result>
		constructor(
			_method: string,
			_addressList: Array<Address>,
			_transfers: Array<Decoded_TransferFrom_Result>,
		) {
			this.method = _method
			this.addressList = _addressList
			this.transfers = _transfers
		}
	}

	export class Decoded_TransferFrom_Result {
		method: string
		from: Address
		to: Address
		token: BigInt
		constructor(
			_method: string,
			_from: Address,
			_to: Address,
			_token: BigInt,
		) {
			this.method = _method
			this.from = _from
			this.to = _to
			this.token = _token
		}

		public toStringArray(): string[] {
			return [this.method, this.from.toHexString(), this.to.toHexString(), this.token.toString()]
		}

		/*
		* toString method to be used for debbuging only
		*/
		public toString(): string {
			return this.toLogFormattedString()
		}

		public toLogFormattedString(): string {
			return `\n · · · · · · method( ${this.method} )\n · · · · · · from( ${this.from.toHexString()} ) \n · · · · · · to( ${this.to.toHexString()} )\n · · · · · · id( ${this.token} ) `
		}
	}

	export function checkFunctionSelector(functionSelector: string): boolean {
		log.info("@@checkFunctionSelector\n selector ( {} ) \n", [functionSelector])

		return functionSelector == "0x23b872dd" || functionSelector == "0x23b872dd" || functionSelector == "0x42842e0e" || functionSelector == "0xf242432a"
	}

	export function checkCallDataFunctionSelector(callData: Bytes): boolean {
		let functionSelector = changetype<Bytes>(callData.subarray(0, 4)).toHexString()
		log.info("@@checkCallDataFunctionSelector\n selector ( {} ) \n data ( {} )", [functionSelector, callData.toHexString()])
		return checkFunctionSelector(functionSelector)
	}

	export function decodeBatchNftData(
		buyCallData: Bytes, sellCallData: Bytes, replacementPattern: Bytes
	): Decoded_atomicize_Result {
		/**
		 * 
		 * atomicize(address[],uint256[],uint256[],bytes)
		 * 
		 * The calldata input is formated as:
		 * Format =>   METHOD_ID (atomicize)  |   ?   | ADDRESS_LIST_LENGTH | ADDRESS_LIST
		 * Size   =>             X            | Y * 4 |          Y          |    Y * Z
		 * ... continues ...
		 * Format =>   ADDRESS_LIST_LENGTH |  ADDRESS_LIST
		 * Size   =>           Y           |     Y * Z
		 * ... continues ...
		 * Format =>   VALUES_LIST_LENGTH  |  VALUES_LIST
		 * Size   =>           Y           |     Y * Z
		 * ... continues ...
		 * Format =>   CALLDATAS_LENGTHS_LIST_LENGTH  |  CALLDATAS_LENGTHS_LIST
		 * Size   =>                Y                 |        Y * Z
		 * ... continues ...
		 * Format => ... |  CALLDATAS_LENGTH  |  CALL_DATAS  
		 * Size   => ... |          Y         |     2 * L
		 * 
		 *      Where : 
		 *          - X = 32 bits (8 hex chars) (4 Bytes)
		 *          - Y = 256 bits (64 hex chars) (32 Bytes) 
		 *          - Z = value stored in "ADDRESS_LIST_LENGTH" section (amount of array entries),
		 * 					each address has a "Y" length
		 * 			- L = value stored in "CALLDATAS_LENGTH" section (amount of bytes),
		 * 					the total length of the callDatas Bytes bundle
		 */


		let mergedCallData = guardedArrayReplace(buyCallData, sellCallData, replacementPattern);
		return decodeAbi_Atomicize_Method(mergedCallData)
	}

	export function decodeAbi_Atomicize_Method(_callData: Bytes,): Decoded_atomicize_Result {

		let dataWithoutFunctionSelector: Bytes = changetype<Bytes>(
			_callData.subarray(4)
		);


		// As function encoding is not handled yet by the lib, we first need to reach the offset of where the
		// actual params are located. As they are all dynamic we can just fetch the offset of the first param
		// and then start decoding params from there as known sized types
		let offset: i32 = ethereum
			.decode("uint256", changetype<Bytes>(dataWithoutFunctionSelector))!
			.toBigInt()
			.toI32();

		// Get the length of the first array. All arrays must have same length so fetching only this one is enough
		let arrayLength: i32 = ethereum
			.decode(
				"uint256",
				changetype<Bytes>(dataWithoutFunctionSelector.subarray(offset))
			)!
			.toBigInt()
			.toI32();
		offset += 1 * 32;


		// Now that we know the size of each params we can decode them one by one as know sized types
		// function atomicize(address[] addrs,uint256[] values,uint256[] calldataLengths,bytes calldatas)
		let decodedAddresses: Address[] = ethereum
			.decode(
				`address[${arrayLength}]`,
				changetype<Bytes>(dataWithoutFunctionSelector.subarray(offset))
			)!
			.toAddressArray();
		offset += arrayLength * 32;

		offset += 1 * 32;
		// We don't need those values, just move the offset forward
		// let decodedValues: BigInt[] = ethereum.decode(
		//   `uint256[${arrayLength}]`,
		//   changetype<Bytes>(dataWithoutFunctionSelector.subarray(offset))
		// )!.toBigIntArray();
		offset += arrayLength * 32;

		offset += 1 * 32;
		let decodedCalldataIndividualLengths = ethereum
			.decode(
				`uint256[${arrayLength}]`,
				changetype<Bytes>(dataWithoutFunctionSelector.subarray(offset))
			)!
			.toBigIntArray()
			.map<i32>(e => e.toI32());
		offset += arrayLength * 32;

		let decodedCallDatasLength = ethereum
			.decode(
				"uint256",
				changetype<Bytes>(dataWithoutFunctionSelector.subarray(offset))
			)!
			.toBigInt()
			.toI32();
		offset += 1 * 32;

		let callDatas: Bytes = changetype<Bytes>(
			dataWithoutFunctionSelector.subarray(
				offset,
				offset + decodedCallDatasLength
			)
		);

		let addressList = new Array<Address>()
		let transfersList = new Array<abi.Decoded_TransferFrom_Result>()

		let calldataOffset = 0;
		for (let i = 0; i < decodedAddresses.length; i++) {
			let callDataLength = decodedCalldataIndividualLengths[i];
			let calldata: Bytes = changetype<Bytes>(
				callDatas.subarray(calldataOffset, calldataOffset + callDataLength)
			);

			// Sometime the call data is not a transferFrom (ie: https://etherscan.io/tx/0xe8629bfc57ab619a442f027c46d63e1f101bd934232405fa8e8eaf156bfca848)
			// Ignore if not transferFrom
			if (checkCallDataFunctionSelector(calldata)) {
				addressList.push(decodedAddresses[i]);
				let decoded = abi.decodeAbi_transferFrom_Method(calldata)
				transfersList.push(decoded)
			}

			calldataOffset += callDataLength;
		}
		let functionSelector = Bytes.fromUint8Array(_callData.subarray(0, 4)).toHex().slice(2)

		return new Decoded_atomicize_Result(
			functionSelector,
			addressList,
			transfersList
		)

	}

	export function decodeSingleNftData(
		buyCallData: Bytes, sellCallData: Bytes, replacementPattern: Bytes
	): Decoded_TransferFrom_Result {
		/**
		 * 
		 * transferFrom(address,address,uint256)
		 * 
		 * The calldata input is formated as:
		 * Format =>  METHOD_ID (transferFrom) | FROM | TO | TOKEN_ID
		 * Size   =>             X             |   Y  |  Y |    Y
		 *      Where :
		 *          - X = 32 bits (8 hex chars) (4 Bytes) 
		 *          - Y = 256 bits (64 hex chars) (32 Bytes)
		 * 
		 * 
		 */

		let mergedCallData = guardedArrayReplace(buyCallData, sellCallData, replacementPattern)
		return decodeAbi_transferFrom_Method(mergedCallData)

	}

	export function decodeAbi_transferFrom_Method(callData: Bytes): Decoded_TransferFrom_Result {
		/**
		 * callData as bytes doesn't have a trailing 0x but represents a hex string
		 * first 4 Bytes cointains 8 hex chars for the function selector
		 * 0.5 Bytes == 4 bits == 1 hex char
		 */


		let dataWithoutFunctionSelector = Bytes.fromUint8Array(callData.subarray(4))



		let decoded = ethereum.decode(
			"(address,address,uint256)", dataWithoutFunctionSelector
		)!.toTuple()

		let functionSelector = Bytes.fromUint8Array(callData.subarray(0, 4)).toHex().slice(2)
		let senderAddress = decoded[0].toAddress()
		let recieverAddress = decoded[1].toAddress()
		let tokenId = decoded[2].toBigInt()

		return new Decoded_TransferFrom_Result(
			functionSelector,
			senderAddress,
			recieverAddress,
			tokenId
		)
	}

	export function guardedArrayReplace(_array: Bytes, _replacement: Bytes, _mask: Bytes): Bytes {
		// Sometime the replacementPattern is empty, meaning that both arrays (buyCallData and sellCallData) are identicall and
		// no merging is necessary. In such a case randomly return the first array (buyCallData)
		if (_mask.length == 0) {
			return _array;
		}

		// copies Bytes Array to avoid buffer overwrite
		let array = Bytes.fromUint8Array(_array.slice(0))
		let replacement = Bytes.fromUint8Array(_replacement.slice(0))
		let mask = Bytes.fromUint8Array(_mask.slice(0))

		array.reverse();
		replacement.reverse();
		mask.reverse();

		let bigIntgArray = BigInt.fromUnsignedBytes(array);
		let bigIntReplacement = BigInt.fromUnsignedBytes(replacement);
		let bigIntMask = BigInt.fromUnsignedBytes(mask);

		// array |= replacement & mask;
		bigIntReplacement = bigIntReplacement.bitAnd(bigIntMask);
		bigIntgArray = bigIntgArray.bitOr(bigIntReplacement);
		return changetype<Bytes>(Bytes.fromBigInt(bigIntgArray).reverse());

	}
}
