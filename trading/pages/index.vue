<template>
  <div>
    <h1 class="text-3xl font-semibold text-center">
      <span class="italic">Nano-</span>Trading Dashboard
    </h1>
    <div>{{ $fetchState.error }}</div>
  </div>
</template>

<script>
export default {
  async fetch () {
    const { data, error } = await this.$supabase
      .from('markets')
      .select()

    if (error) {
      throw new Error(error.message)
    }
    this.$store.commit('setMarkets', data)
  },
  mounted () {
    this.enableSync()
  },
  methods: {
    enableSync () {
      this.$supabase
        .from('markets')
        .on('INSERT', ({ new: market }) => {
          this.$store.commit('addMarket', market)
        })
        .subscribe()
    }
  }
}
</script>
