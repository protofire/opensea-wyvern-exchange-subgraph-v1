# OpenSea: Wyvern Exchange
_Made by Protoire.io under MIT License_

"The world’s first and largest digital marketplace for crypto collectibles and non-fungible tokens (NFTs). Buy, sell, and discover exclusive digital items."
 > https://opensea.io/

This subgraph custom approach based on the orders book and assets management trough an time series entities model and it's complemented w/ a layer of metadata such as block and transaction information. 

The main functionality of this subgraph is to index the openSea sales (matched order) the nft tokens, their owners, the erc20 tokens used to pay for them an the nft and erc20 transactions associated.

Future updates:
- Open listings 

Thys subgraph rely's on this contract:
- OpenSea WyvernExchange: 0x7Be8076f4EA4A4AD08075C2508e481d6C946D12b

TODO: relationship diagrams

## Relationship diagram
Simple lookup table for relationship between entities.

### Reference:

| **Name**       | **Indicator** 
|------------------|-------------
| Account          | x           
| Derived	       |     D
| Many To One      |     OTM
| One To One   	   |     OTO
| Not related      |     -

### Table:

| **entity**       | **Account** | **Balance** | **Erc20Token** | **Erc20Transaction** | **Nft** | **NftContract** | **NftTransaction** | **Sale** | **Order** | **MinuteVolume** | **HourVolume** | **DayVolume** | **WeekVolume** | **Minute** | **Hour** | **Day** | **Week** | **Block** | **Transaction** |
|------------------|-------------|-------------|----------------|----------------------|---------|-----------------|--------------------|----------|-----------|------------------|----------------|---------------|----------------|------------|----------|---------|----------|-----------|-----------------|
| Account          | x           | D           | -              | D                    | D       | -               | D                  | -        | D         | -                | -              | -             | -              | -          | -        | -       | -        | -         | -               |
| Balance          | MTO         | x           | MTO            | D                    | -       | -               | -                  | -        | -         | -                | -              | -             | -              | -          | -        | -       | -        | -         | -               |
| Erc20Token       | -           | D           | x              | D                    | -       | -               | -                  | D        | D         | D                | D              | D             | D              | -          | -        | -       | -        | -         | -               |
| Erc20Transaction | MTO         | MTO         | MTO            | x                    | -       | -               | -                  | OTO      | -         | MTO              | MTO            | MTO           | MTO            | MTO        | MTO      | MTO     | MTO      | MTO       | MTO             |
| Nft              | MTO         | -           | -              | -                    | x       | MTO             | D                  | -        | -         | -                | -              | -             | -              | -          | -        | -       | -        | -         | -               |
| NftContract      | -           | -           | -              | -                    | D       | x               | -                  | -        | -         | D                | D              | D             | D              | -          | -        | -       | -        | -         | -               |
| NftTransaction   | MTO         | -           | -              | -                    | MTO     | MTO             | x                  | MTO      | -         | MTO              | MTO            | MTO           | MTO            | MTO        | MTO      | MTO     | MTO      | MTO       | MTO             |
| Sale             | -           | -           | MTO            | D                    | -       | -               | D                  | x        | D         | -                | -              | -             | -              | MTO        | MTO      | MTO     | MTO      | MTO       | MTO             |
| Order            | MTO         | -           | MTO            | -                    | -       | MTO             | -                  | MTO      | x         | -                | -              | -             | -              | MTO        | MTO      | MTO     | MTO      | MTO       | MTO             |
| MinuteVolume     | -           | -           | MTO            | D                    | -       | MTO             | D                  | -        | -         | x                | -              | -             | -              | MTO        | -        | -       | -        | -         | -               |
| HourVolume       | -           | -           | MTO            | D                    | -       | MTO             | D                  | -        | -         | -                | x              | -             | -              | -          | MTO      | -       | -        | -         | -               |
| DayVolume        | -           | -           | MTO            | D                    | -       | MTO             | D                  | -        | -         | -                | -              | x             | -              | -          | -        | MTO     | -        | -         | -               |
| WeekVolume       | -           | -           | MTO            | D                    | -       | MTO             | D                  | -        | -         | -                | -              | -             | x              | -          | -        | -       | MTO      | -         | -               |
| Minute           | -           | -           | -              | D                    | -       | -               | D                  | D        | D         | D                | -              | -             | -              | x          | -        | -       | -        |           |                 |
| Hour             | -           | -           | -              | D                    | -       | -               | D                  | D        | D         | -                | D              | -             | -              | -          | x        | -       | -        |           |                 |
| Day              | -           | -           | -              | D                    | -       | -               | D                  | D        | D         | -                | -              | D             | -              | -          | -        | x       | -        |           |                 |
| Week             | -           | -           | -              | D                    | -       | -               | D                  | D        | D         | -                | -              | -             | D              | -          | -        | -       | x        |           |                 |
| Block            | -           | -           | -              | D                    | -       | -               | D                  | D        | D         | -                | -              | -             | -              |            |          |         |          | x         | D               |
| Transaction      | -           | -           | -              | D                    | -       | -               | D                  | D        | D         | -                | -              | -             | -              |            |          |         |          | MTO       | x               |


# Entities description

## Account

This entity store information about EVM's wallets (EOA or smart contract), the ones that will trade and hold the assets.
Is an entity that only stores the wallet's public address.

### Derived relationships

#### Orders:

- makerOrders: orders were this account added liquidity to the market

- takerOrders: orders where this account extracted liquidity from the market

#### Erc20Tokens:

- balances: a many to many relationship betwen a Erc20Token and some account with some amount of tokens

#### Erc20Transactions:

- outgoingErc20Transaction: er20 tokens deposited into the market in maker Orders 

- incomingErc20Transaction: er20 tokens retired from the market in taker Orders 

#### Nfts

- nfts: nft tokens owned by this account

#### NftTransactions:

- incomingNftTransactions: Nft's sent to this account (adquisition)
- outgoingNftTransactions: Nft's sent form this account (transfer)

### Example:

```graphql
	# TODO
{
  accounts{
    address
  }
}
```

___

## Balance

This entity stores an amount of tokens and represents a Many to Many relationship betwen Accounts and Erc20Tokens since each Account can hold many tokens and each Erc20Token can be held by many accounts.

### Stored relationships:

#### Account: 

- account: The Account that holds some amount of some token

#### Erc20Token: 

- token: The Erc20Token that is being held by the Account

### Derived relationships:

#### Erc20Transactions:

- increasingTransactions: erc20Transactions that increased the amount of tokens for this balance

- decreasingTransactions: erc20Transactions that decreased  the amount of tokens for this balance

### Example:

```graphql
	# TODO
{
  balances{
    amount
  }
}
```

___

## Interface: SmartContract

This interface provides a common place for defining both erc20 contracts and nftContracts. It only contains information aboutocntract's address and provides relationships with other entities

### Stored relationships:

- No relationships are stored in entities with this interface

### Derived relationships:

- Orders: the orders where this contract was traded (as a payment token or as an nft)

- Volumes: All of the volume-kind entities where this contract was traded


### Example:

```graphql
	# All erc20 and Nft contracts with their owners 
{
	smartContracts {
		address
		... on Erc20Token{
			balances {
				accounts {
					address
				}
			}
		}
		... on NftContract{
			id
			nfts {
				owner {
					address
				}
			}
		}
	}
}
```
___
## Erc20Token

OpenSea allows the users to pay in a wide diversity of erc20 tokens and the Token entitiy represent them and it's relations with entities such as: volumes, orders & erc20Tranasctions. Those entities are related to time series and accounts entities.


### Stored relationships:

- No relationships are stored this kind of entity

### Derived relationships:

#### Accounts:

- balances: a many to many relationship betwen a Erc20Token and some account with some amount of tokens

#### SmartContractTransacitons:

- tokenTransactions: Transactions that transfered tokens from this contract between Accounts

#### Sales

- Sales: Sales where this token was used as a payment token

#### Orders

- orders: Orders where this contract's address is stored as payment Token

#### Volumes

- MinuteVolume, HourVolume, DayVolume, WeekVolume: Volume entities representing the total value and transactions for a given timeframe
### Example:

```graphql
	# The whole list of owners of some token and the amount they hold
{
  Erc20Token (where: {
	address: "0xSomeErc20ContractAddres"
  }){
		balances {
			amount
			account {
				address
			}
		}
		
	}
}
```
___

## NftContract

A given nft contract containning NFTs, provides a relationship between accounts trough the "Asset owner entity" and orders opened under this "target".


### Stored relationships:

- No relationships are stored this kind of entity

#### Derived relationships:

#### SmartContractTransacitons:

- tokenTransactions: Transactions that transfered some token from this contract between Accounts

#### Orders

- orders: Orders where this contract's address is stored as target

#### Volumes

- MinuteVolume, HourVolume, DayVolume, WeekVolume: Volume entities representing the total amount of tokens and transactions for a given timeframe

### Example:

```graphql
	# the whole list of owners fro a given nft contract
{
  NftContract (where: {
	address: "0xSomeNftContractAddres"
  }) {
	  nfts {
		  id
		  owners {
			  address
		  }
	  }
  }
}
```
___
## Interface SmartContractTransaction

This interface provides and standard approach to represent interactions with nft or erc20 contracts in the context of the openSea marketplace. Contains information about the sale where this transaction was triggered, the Accounts involved, the contract that stores the tokens transfered and the time when the transaction was made.

Is one of the main pieces of this subgraph because relate to many other entities. It's like some sort of highway where you can go between any entitiy. 

### Stored relationships:

#### Accounts

- from: The account that sent the tokens
- to: The account that recieved the tokens

#### SmartContracts

- contract: the erc20 or nftContract where the transfered tokens are stored

#### Sales

- sale: the Sale (as two succesfully matched orders) where this transacción was triggered. Each sale relates one erc20 SmartContractTransaction and can relate to one or many Nft SmartContractTransactions

#### Metadata

- Block: the block entity where this transaction was sent

- Transaction: the transaction entity where this transaction was sent

#### TimeSeries 

- Minute, Hour, Day, Week: Time units where this transaction was sent (allow us to know the transactions for each day)

#### Volumes

- All of the volume-kind entities where this transaction was included (allow us to know which transactions the amount of tokens traded for a given timeframe)
### Derived relationships:

- No relationship are derived to this entity
### Example:

```graphql
	# all of the erc20 and nft transactions made by some Account
{
	SmartContractTransactions(
		where:{
			from: "0xSomeAccountAddress"
		}
	) {
		... on Erc20Transaction{
			amount
			contract {
				address
			}
		}
		... on NftTransaction{
			nft{
				id
			}
			contract{
				address
			}
		}
	}
}
```
___

## Erc20Transaction

The Erc20Transaction entity will be created each time an erc20 is traded in for of a payment for a Sale (two succesfully matched orders). Be aware that a Sale will create always a single erc20Transaction since both regular and bundle orders have only one payment.

### Stored relationships:

- Same es "smartContractTransaction interface" 

#### Balances

- increasedBalance: The Balance entity that increased the value of it's "amount" field (to track the growth of the Account's balance).
- decreasedBalance: The Balance entity that increased the value of it's "amount" field.

### Derived relationships:

- No relationship are derived to this entity

### Example:

```graphql
	# List the transactions for a given ercToken
{
	erc20Transactions (
		where: {
			contract: "0xSomeErc20Address"
		}
	){
		from {
			address
		}
		to {
			address
		}
	}
}
```
___

## NftTransaction

The NftTransaction entity will be created each time an Nft is traded in as resilt of a Sale (two succesfully matched orders). Be aware that a Sale can create one or many NftTransactions since a sale can be single or bundle asset. 

### Stored relationships:

- Same es "smartContractTransaction interface" 

### Derived relationships:

- No relationship are derived to this entity

### Example:

```graphql
	# All of the nfts sold by some Account
{
	nftTransactions(
		where:{
			from: "0xSomeAccountAddress"
		}
	){
		timestamp
		nft{
			id
		}
	}
}
```
___

## Nft

This entity represents an Nft from a erc721 or a erc1155 smart contract.
Contains a very simple information about the tokenId, the account that holds it and the contract qhere it's stored.

### Stored relationships:

#### Accounts
- owner: an account that owns this Nft

#### NftContracts
- contract: an standar erc721 or erc1155 where this nft is stored.

### Derived relationships:

#### NftTransactions

- nftTransactions: All of the transactions where this Nft change it's owner

### Example:

```graphql
	# current and past owners for some Nft
{
  nft (
	_id: "someNftId" # where `${contractAddres}-${tokenID}`
  ){
	owner{
		address
	}
	nftTransactions{
		from{
			address
		}
	}
  }
}
```
___

## Sale

### Stored relationships:


### Derived relationships:

### Example:

```graphql
	# TODO
{
  
}
```
___


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

# Interface Time-series

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

### Stored relationships:


### Derived relationships:

### Example:

```graphql
	# TODO
{
  
}
```
___

## Interface Volume 



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

### Stored relationships:


### Derived relationships:

### Example:

```graphql
	# TODO
{
  
}
```
___

## Interface Metadata

### Stored relationships:


### Derived relationships:

### Example:

```graphql
	# TODO
{
  
}
```
___

### Transaction

Transactions excetuted in the Ethereum virtual machine. These transacctions are meant to be included in blocks. Relates to time series entities, orders and blocks. Also contains information like hash, gas price, eth.

### Block

Each piece of the blockchains, contins a number and a timestamp and is related to orders, transactions and time series entities.

# Example queries

## Orders

```graphql
	# Returns a list of succesfully catched by the subgraph sorted by listingTime
{
	orders(
		first: 15
		where: {
			yieldStatus: PART_TWO
		}
		orderDirection: desc
		orderBy: listingTime, 
	) {
		id
		callData
		target { 
			address
		}
	}
}
```
## Time Series

```graphql
	# For minutes returns a list of block's numbers
	# For days returns a list of order's Volume
{
   timeUnits{
	   ...on Minute {
		   block: {
			   number
		   }
	   }
	   ...on Day {
			volume: {
		   		ordersAmount
	   		}
	   }
   }
}
```

## Volume

```graphql
	# Minute volume for ether
{
   timeUnits{
	   #token
	   ...on MinuteVolume (
		   where: {
			   token: {
				   address: "0x000..."
			   }
		   }
	   ) {
		   tokenAmount
	   	}
	   }
   }
}
```