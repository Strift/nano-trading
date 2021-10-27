<template>
  <div class="relative my-16 space-y-16">
    <div class="absolute top-0 left-0">
      <button class="px-3 py-1 text-xs font-semibold tracking-wider uppercase border rounded-md border-brand text-brand hover:bg-brand hover:text-white" @click="addMarket('baron_tower')">
        🐼 Towers
      </button>
      <button class="px-3 py-1 text-xs font-semibold tracking-wider uppercase border rounded-md border-brand text-brand hover:bg-brand hover:text-white" @click="addMarket('baron_win')">
        🐼 Winner
      </button>
      <input v-model.number="nextMarketDelayInSeconds" type="number" class="inline-flex h-6 px-3 border rounded w-14 border-gray text-gray-dark">
    </div>
    <h1 class="text-3xl font-semibold text-center text-brand">
      <span class="italic">Nano-</span>Trading Dashboard
    </h1>
    <div class="text-gray">
      <div v-if="$fetchState.pending" class="text-center">
        Loading...
      </div>
      <div v-else-if="$fetchState.error" class="text-center">
        {{ $fetchState.error }}
      </div>
      <div v-else class="space-y-20">
        <transition
          enter-active-class="animate__animated animate__pulse"
          mode="out-in"
        >
          <FutureMarket
            v-if="nextMarket"
            :id="nextMarket.id"
            :value="marketInputValue(nextMarket)"
            :name="marketName(nextMarket)"
            :input-title="marketInputTitle(nextMarket)"
            :activation-date="nextMarket.activation_date"
            :selections="marketSelections(nextMarket)"
            class="mx-auto shadow-md"
            @enable="enableMarket(nextMarket)"
            @input="updateMarketInputValue(nextMarket, $event)"
          />
          <div v-else class="my-20 text-4xl font-thin text-center text-gray">
            Mela. No nano-markets waiting. 👌
          </div>
        </transition>
        <div class="text-lg font-semibold text-center text-gray-dark">
          Past markets
        </div>
        <transition-group
          tag="div"
          class="space-y-12"
          enter-active-class="animate__animated animate__fadeInDown"
          leave-active-class="animate__animated animate__fadeOut"
          mode="out-in"
        >
          <PastMarket
            v-for="market in pastMarkets"
            :id="market.id"
            :key="market.id"
            :value="marketInputValue(market)"
            :name="marketName(market)"
            :input-title="marketInputTitle(market)"
            :selections="marketSelections(market)"
            :enabled="market.enabled"
            class="mx-auto shadow-md"
          />
        </transition-group>
      </div>
    </div>
    <div class="text-center text-gray-dark">
      {{ markets.length }} nano-betting markets so far.
    </div>
  </div>
</template>

<script>
import { DateTime } from 'luxon'
import { mapState, mapGetters } from 'vuex'

export default {
  data: () => ({
    refreshIntervalId: null,
    nextMarketDelayInSeconds: 5
  }),
  async fetch () {
    const { data, error } = await this.$supabase
      .from('markets')
      .select()

    if (error) {
      throw new Error(error.message)
    }
    this.$store.commit('setMarkets', data)
  },
  computed: {
    ...mapState(['markets']),
    ...mapGetters(['futureMarkets', 'pastMarkets']),
    nextMarket () {
      return this.futureMarkets[0]
    }
  },
  mounted () {
    this.enableSync()
    this.refreshIntervalId = setInterval(() => {
      this.$store.commit('refreshNow')
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(this.refreshIntervalId)
  },
  methods: {
    enableSync () {
      this.$supabase
        .from('markets')
        .on('INSERT', ({ new: market }) => {
          this.$store.commit('addMarket', market)
        })
        .subscribe()
      this.$supabase
        .from('markets')
        .on('UPDATE', ({ new: market }) => {
          this.$store.commit('updateMarket', market)
        })
        .subscribe()
    },
    marketInputValue (market) {
      return market.supremacy_enabled
        ? market.supremacy
        : market.totals
    },
    async updateMarketInputValue (market, value) {
      const field = market.supremacy_enabled
        ? 'supremacy'
        : 'totals'
      const patch = {}
      patch[field] = value
      const { data, error } = await this.$supabase
        .from('markets')
        .update(patch)
        .eq('id', market.id)
      // this.$store.commit('updateMarket', data[0])
    },
    marketInputTitle (market) {
      return market.supremacy_enabled
        ? 'Supremacy'
        : 'Totals'
    },
    marketName (market) {
      return market.name === 'baron_tower'
        ? 'Baron power play — Towers'
        : 'Baron power play — DWG winner'
    },
    marketSelections (market) {
      return market.name === 'baron_tower'
        ? [
            { label: '1', value: 3.47 },
            { label: '2', value: 3.47 },
            { label: '3', value: 3.47 },
            { label: '4', value: 3.47 }
          ]
        : [
            { label: 'Yes', value: 50 },
            { label: 'No', value: 50 }
          ]
    },
    async enableMarket (market) {
      const { data, error } = await this.$supabase
        .from('markets')
        .update({
          enabled: true
        })
        .eq('id', market.id)
      // this.$store.commit('updateMarket', data[0])
    },
    async addMarket (name) {
      const { data, error } = await this.$supabase
        .from('markets')
        .insert({
          name,
          supremacy_enabled: name === 'baron_win',
          totals_enabled: name === 'baron_win',
          activation_date: DateTime.now().plus({ seconds: this.nextMarketDelayInSeconds }).toJSON()
        })
    }
  }
}
</script>
