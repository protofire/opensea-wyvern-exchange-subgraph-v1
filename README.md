# OpenSea: Wyvern Exchange
_Made by Protoire.io under MIT License_

"The world’s first and largest digital marketplace for crypto collectibles and non-fungible tokens (NFTs). Buy, sell, and discover exclusive digital items."
 > https://opensea.io/

This subgraph custom approach based on the orders book and assets management trough an time series entities model and it's complemented w/ a layer of metadata such as block and transaction information. 

Thys subgraph rely's on this contract:
- OpenSea WyvernExchange: 0x7Be8076f4EA4A4AD08075C2508e481d6C946D12b

## Order

	- OrderApprovedPartOne(indexed bytes32,address,indexed address,address,uint256,uint256,uint256,uint256,indexed address,uint8,uint8,uint8,address)

	- OrderApprovedPartTwo(indexed bytes32,uint8,bytes,bytes,address,bytes,address,uint256,uint256,uint256,uint256,uint256,bool)

	- OrderCancelled(indexed bytes32)

	- OrdersMatched(bytes32,bytes32,indexed address,indexed address,uint256,indexed bytes32)

This entity hold data about open and matched orders. Represents the whole order data as stored in the WyvernExchange contract.

The contract yields the data on two events to achieve this: OrderApprovedPartOne and OrderApprovedPartTwo. 

multi-event yield condition requires to add the following enum to the order schema:

	enum ContractOrderYieldStatus {
		# entity created w/ no data
		NONE 

		# entity after OrderApprovedPartOne
		PART_ONE 

		# entity after OrderApprovedPartTwo
		PART_TWO
	}

This Order entity is the starting point for building the whole subgraph

# Time-series

Each Order is yield in the context of a transaction inside an specific block. Each block contains an unix timestamp which can be divided to obtain the Minute, Hour, Day and Week epoch. Those entities are based on the time unit entity 

	interface TimeUnit {
		"internal id used for indexation"
		id: ID!

		"timestamp division of the starting point"
		epoch: BigInt!

		"orders filled at this time candle"
		orders: [Order!]!

		"blocks signed at this thime candle"
		blocks: [Block!]

		"transactions created at this thime candle"
		transactions: [Transaction!]!

		"related volume entity"
		volume: Volume!
	}

This allows the subgraph to index the information metadata based (block or transaction) or time based relating Vollumen, Blocks, Transactions and orders with an specific date.

## Volume 

Every asset exchange calculates the volume known as the amount of something traded at some point in time. For this subgraph "Volume" is the interface where volumes are stored and matched with an specific time unit such as “minuteVolume”.

This entity creates relationships between entities suchs as: erc20Transactions, tokens, assets, orders. Giving values for payments and assets volume.

	type MinuteVolume implements Volume @entity {
		"internal id used for indexation"
		id: ID! # Set to `minute-${asset.id}-${token-id}-${epoch}`

		"traded asset"
		asset: Asset!

		"amount of traded orders for this asset in a given time frame"
		ordersAmount: BigInt!

		"derived list of orders traded for this asset in a given time frame"
		orders: [Order!]! @derivedFrom(field: "minuteVolume")

		"erc20 token used to pay for this asset"
		token: Token!

		"derived list of Erc20Transactions for this token in a given time frame"
		erc20Transactions: [Erc20Transaction!]! @derivedFrom(field: "minuteVolume")

		"amount of tokens traded for this assets in a given time frame"
		tokenAmount: BigInt!

		"related time serie entitiy, ej dailyVolume for x day is related to x dayCandle"
		timeUnit: TimeUnit!
	}

## Token

OpenSea allows the users to pay in a wide diversity of erc20 tokens and the Token entitiy represent them and it's relations with entities such as: volumes, orders & erc20Tranasctions. Those entities are related to time series and accounts entities.

## Erc20Transaction

Any time an erc20 is traded an Erc20Transaction entity will be created. This entitiy has many relationships suchs as volume entities, time series, orders, accounts, blocks and transactions(evm).
Allowing this subgraph to be source for many kinds of data visualizations.

## Balance

The Balance entitiy is used to represent this many-tomany relationship between accounts and tokens since an account can hold many erc20 tokens and a erc20 token can be owned by multiple accounts. This entity also relates to each Erc20Transaction so this subgraph can shown the wallet size of a given user in any given time.

	type Balance @entity {
		"internal id used for indexation"
		id: ID!

		"balance's owner"
		account: Account!

		"related token"
		token: Token!

		"token's amount"
		amount: BigInt!

		erc20Transactions: [Erc20Transaction!]! @derivedFrom(field: "balance")
	}


## Account

This entity store information about EVM's wallets, the ones that will trade and hold the assets.
Is an entity that only stores the wallet's public address.

Relates to orders in two ways:

- makerOrders: orders were this account added liquidity to the market

- takerOrders: orders where this account extracted liquidity from the market

Related to erc20Transactions in two ways:

- outgoingErc20Transaction: er20 tokens deposited into the market in maker Orders 

- incomingErc20Transaction: er20 tokens retired from the market in taker Orders 

The account also contains useful information such as assets owned by the account in the form of AssetOwner's entities, tokens owned in the form of Balance's entities.

## Asset



## Token

	Generated(indexed uint256,indexed address,string)

The Token entity provides an standard erc-721 token interface wich also holds the uri, an string representation of the nft's art.

## Other entities

In order to provide additional info, the Block and TransactionMeta entities are added. The first one contains info about block number's and timestamp. The other one contains information about chain's transacion such as hash, gasUsed, etc.

## Example Queries


```graphql
# working with Transactions
{
   Transactions
	   id
	   type
	   ...on Mint{
		   to {
			   address
		   }
	   }
	   ...on Burn{
		   form {
			   address
		   }
	   }
	   ...on Transfer{
		   from{
			   address
		   }
		   to{
			   address
		   }
	   }
   }
}
```


```graphql
# working with accounts
{
   accounts{
	   sent{
		   token {
			   uri
		   }
	   }
	   recieved {
		   block {
			   number
		   }
	   }
	   approved {
		   token {
			   id
		   }
	   }
   }	  
}
```


```graphql
# working with Tokens
{
   tokens{
	   owner {
		   address
	   }
	   burned
	   uri
   }
}
```