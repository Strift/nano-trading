import Vue from 'vue'
import { DateTime } from 'luxon'
import { orderBy } from 'lodash'

const sortByActivationDate = (markets, sorting) => {
  return orderBy(markets, [
    market => DateTime.fromISO(market.activation_date).toMillis()
  ], sorting)
}

export const state = () => ({
  now: null,
  markets: []
})

export const mutations = {
  refreshNow (state) {
    state.now = DateTime.now()
  },
  setMarkets (state, markets) {
    state.markets = markets
  },
  addMarket (state, market) {
    state.markets.push(market)
  },
  updateMarket (state, market) {
    const index = state.markets.findIndex(m => m.id === market.id)
    Vue.set(state.markets, index, market)
  }
}

export const getters = {
  pastMarkets (state) {
    return state.now === null
      ? []
      : sortByActivationDate(state.markets.filter((market) => {
        return DateTime.fromISO(market.activation_date).toMillis() - state.now.toMillis() < 0
      }), 'desc')
  },
  futureMarkets (state) {
    return state.now === null
      ? []
      : sortByActivationDate(state.markets.filter((market) => {
        return DateTime.fromISO(market.activation_date).toMillis() - state.now.toMillis() > 0
      }), 'asc')
  }
}
