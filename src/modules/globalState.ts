import { entityCounters } from "."
import { GlobalState } from "../../generated/schema"

export namespace globalState {
	export namespace constants {
		export const GLOBAL_STATE_ID = "0x0"
	}
	export function loadOrCreateGlobalState(): GlobalState {
		let entity = GlobalState.load(constants.GLOBAL_STATE_ID)
		if (entity == null) {
			entity = new GlobalState(constants.GLOBAL_STATE_ID)
			let counters = entityCounters.loadOrCreateEntityCounter(constants.GLOBAL_STATE_ID, "globalState-counters")
			counters.save()
			entity.counters = counters.id

			let accounts = entityCounters.loadOrCreateEntityCounter(constants.GLOBAL_STATE_ID, "globalState-accounts")
			accounts.save()
			entity.accounts = accounts.id

			let balances = entityCounters.loadOrCreateEntityCounter(constants.GLOBAL_STATE_ID, "globalState-balances")
			balances.save()
			entity.balances = balances.id

			let erc20tokens = entityCounters.loadOrCreateEntityCounter(constants.GLOBAL_STATE_ID, "globalState-erc20tokens")
			erc20tokens.save()
			entity.erc20tokens = erc20tokens.id

			let erc20transactions = entityCounters.loadOrCreateEntityCounter(constants.GLOBAL_STATE_ID, "globalState-erc20transactions")
			erc20transactions.save()
			entity.erc20transactions = erc20transactions.id

			let nfts = entityCounters.loadOrCreateEntityCounter(constants.GLOBAL_STATE_ID, "globalState-nfts")
			nfts.save()
			entity.nfts = nfts.id

			let nftcontracts = entityCounters.loadOrCreateEntityCounter(constants.GLOBAL_STATE_ID, "globalState-nftContracts")
			nftcontracts.save()
			entity.nftContracts = nftcontracts.id

			let nfttransactions = entityCounters.loadOrCreateEntityCounter(constants.GLOBAL_STATE_ID, "globalState-nftTransactions")
			nfttransactions.save()
			entity.nftTransactions = nfttransactions.id

			let sales = entityCounters.loadOrCreateEntityCounter(constants.GLOBAL_STATE_ID, "globalState-sales")
			sales.save()
			entity.sales = sales.id

			let orders = entityCounters.loadOrCreateEntityCounter(constants.GLOBAL_STATE_ID, "globalState-orders")
			orders.save()
			entity.orders = orders.id

			let blocks = entityCounters.loadOrCreateEntityCounter(constants.GLOBAL_STATE_ID, "globalState-blocks")
			blocks.save()
			entity.blocks = blocks.id

			let transactions = entityCounters.loadOrCreateEntityCounter(constants.GLOBAL_STATE_ID, "globalState-transactions")
			transactions.save()
			entity.transactions = transactions.id

			let minuteVolumes = entityCounters.loadOrCreateEntityCounter(constants.GLOBAL_STATE_ID, "globalState-minuteVolumes")
			minuteVolumes.save()
			entity.minuteVolumes = minuteVolumes.id

			let hourVolumes = entityCounters.loadOrCreateEntityCounter(constants.GLOBAL_STATE_ID, "globalState-hourVolumes")
			hourVolumes.save()
			entity.hourVolumes = hourVolumes.id

			let dayVolumes = entityCounters.loadOrCreateEntityCounter(constants.GLOBAL_STATE_ID, "globalState-dayVolumes")
			dayVolumes.save()
			entity.dayVolumes = dayVolumes.id

			let weekVolumes = entityCounters.loadOrCreateEntityCounter(constants.GLOBAL_STATE_ID, "globalState-weekVolumes")
			weekVolumes.save()
			entity.weekVolumes = weekVolumes.id

			let minutes = entityCounters.loadOrCreateEntityCounter(constants.GLOBAL_STATE_ID, "globalState-minutes")
			minutes.save()
			entity.minutes = minutes.id

			let hours = entityCounters.loadOrCreateEntityCounter(constants.GLOBAL_STATE_ID, "globalState-hours")
			hours.save()
			entity.hours = hours.id

			let days = entityCounters.loadOrCreateEntityCounter(constants.GLOBAL_STATE_ID, "globalState-days")
			days.save()
			entity.days = days.id

			let weeks = entityCounters.loadOrCreateEntityCounter(constants.GLOBAL_STATE_ID, "globalState-weeks")
			weeks.save()
			entity.weeks = weeks.id
		}
		return entity as GlobalState
	}

	export namespace helpers {
		export function updateGlobal_counters_Counter(): void {
			entityCounters.increaseAndSaveCounter(constants.GLOBAL_STATE_ID, "globalState-counters")
		}
		export function updateGlobal_accounts_Counter(): void {
			entityCounters.increaseAndSaveCounter(constants.GLOBAL_STATE_ID, "globalState-accounts")
		}
		export function updateGlobal_balances_Counter(): void {
			entityCounters.increaseAndSaveCounter(constants.GLOBAL_STATE_ID, "globalState-balances")
		}
		export function updateGlobal_erc20tokens_Counter(): void {
			entityCounters.increaseAndSaveCounter(constants.GLOBAL_STATE_ID, "globalState-erc20tokens")
		}
		export function updateGlobal_erc20transactions_Counter(): void {
			entityCounters.increaseAndSaveCounter(constants.GLOBAL_STATE_ID, "globalState-erc20transactions")
		}
		export function updateGlobal_nfts_Counter(): void {
			entityCounters.increaseAndSaveCounter(constants.GLOBAL_STATE_ID, "globalState-nfts")
		}
		export function updateGlobal_nftContracts_Counter(): void {
			entityCounters.increaseAndSaveCounter(constants.GLOBAL_STATE_ID, "globalState-nftContracts")
		}
		export function updateGlobal_nftTransactions_Counter(): void {
			entityCounters.increaseAndSaveCounter(constants.GLOBAL_STATE_ID, "globalState-nftTransactions")
		}
		export function updateGlobal_sales_Counter(): void {
			entityCounters.increaseAndSaveCounter(constants.GLOBAL_STATE_ID, "globalState-sales")
		}
		export function updateGlobal_orders_Counter(): void {
			entityCounters.increaseAndSaveCounter(constants.GLOBAL_STATE_ID, "globalState-orders")
		}
		export function updateGlobal_blocks_Counter(): void {
			entityCounters.increaseAndSaveCounter(constants.GLOBAL_STATE_ID, "globalState-blocks")
		}
		export function updateGlobal_transactions_Counter(): void {
			entityCounters.increaseAndSaveCounter(constants.GLOBAL_STATE_ID, "globalState-transactions")
		}
		export function updateGlobal_minuteVolumes_Counter(): void {
			entityCounters.increaseAndSaveCounter(constants.GLOBAL_STATE_ID, "globalState-minuteVolumes")
		}
		export function updateGlobal_hourVolumes_Counter(): void {
			entityCounters.increaseAndSaveCounter(constants.GLOBAL_STATE_ID, "globalState-hourVolumes")
		}
		export function updateGlobal_dayVolumes_Counter(): void {
			entityCounters.increaseAndSaveCounter(constants.GLOBAL_STATE_ID, "globalState-dayVolumes")
		}
		export function updateGlobal_weekVolumes_Counter(): void {
			entityCounters.increaseAndSaveCounter(constants.GLOBAL_STATE_ID, "globalState-weekVolumes")
		}
		export function updateGlobal_minutes_Counter(): void {
			entityCounters.increaseAndSaveCounter(constants.GLOBAL_STATE_ID, "globalState-minutes")
		}
		export function updateGlobal_hours_Counter(): void {
			entityCounters.increaseAndSaveCounter(constants.GLOBAL_STATE_ID, "globalState-hours")
		}
		export function updateGlobal_days_Counter(): void {
			entityCounters.increaseAndSaveCounter(constants.GLOBAL_STATE_ID, "globalState-days")
		}
		export function updateGlobal_weeks_Counter(): void {
			entityCounters.increaseAndSaveCounter(constants.GLOBAL_STATE_ID, "globalState-weeks")
		}
	}
}