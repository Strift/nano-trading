import { DateTime } from 'luxon'

export const state = () => ({
  markets: []
})

export const mutations = {
  setMarkets (state, markets) {
    state.markets = markets
  },
  addMarket (state, market) {
    state.markets.push(market)
  }
}

export const getters = {
  futureMarkets (state) {
    const now = DateTime.now()
    return state.markets.filter((market) => {
      const activationDate = DateTime.fromISO(market.activation_date)
      return activationDate.toMillis() - now.toMillis() > 0
    })
  }
}
