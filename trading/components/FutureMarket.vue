<template>
  <BaseCard class="max-w-md">
    <template slot="header">
      <div class="flex justify-between">
        <div class="font-semibold text-black">
          {{ title }} <span class="text-xs text-gray-dark">#{{ id }}</span>
        </div>
        <div>
          <label for="input" class="mr-3 text-gray">{{ inputTitle }}</label>
          <input
            id="input"
            :value="value"
            :class="{ 'bg-red-100': isNegative, 'bg-green-100': isPositive }"
            type="number"
            class="px-2 border rounded border-gray w-14 h-7 placeholder-gray text-gray-dark focus:outline-none"
            placeholder="0"
            @input="$emit('input', Number($event.target.value))"
          >
        </div>
      </div>
    </template>
    <template slot="default">
      <div class="flex justify-between">
        <div class="text-black">
          {{ name }}
        </div>
        <div class="flex">
          <span v-if="disable" class="text-red-400">Market disabled ({{ Number.parseFloat(timer()).toFixed(1) }}s)</span>
          <div v-else>
            <span v-if="now" class="mr-2">Active in {{ Number.parseFloat(timer()).toFixed(1) }}s</span>
            <button
              class="px-2 text-red-400 rounded-full hover:text-red-600 hover:bg-red-100"
              @click="disable = true"
            >
              Disable
            </button>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3 mt-3">
        <div
          v-for="selection in selections"
          :key="selection.label"
          class="flex justify-between px-3 py-1 text-black rounded bg-gray-lighter"
        >
          <div>{{ selection.label }}</div>
          <div class="font-semibold">
            {{ selection.value }}
          </div>
        </div>
      </div>
    </template>
  </BaseCard>
</template>

<script>
import PropTypes from '@znck/prop-types'
import { DateTime } from 'luxon'

export default {
  props: {
    title: PropTypes.string.defaultValue('Micro bet'),
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    inputTitle: PropTypes.string.isRequired,
    selections: PropTypes.arrayOf(PropTypes.object),
    activationDate: PropTypes.string
  },
  data: () => ({
    disable: false,
    autoEnabled: false,
    now: null,
    intervalId: null
  }),
  computed: {
    isPositive () {
      return this.value > 0
    },
    isNegative () {
      return this.value < 0
    },
    isPast () {
      return DateTime.fromISO(this.activationDate) - DateTime.now().toMillis() < 0
    }
  },
  watch: {
    now (nowValue) {
      if (this.timer() <= 0 && !this.autoEnabled) {
        this.autoEnable()
      }
    }
  },
  mounted () {
    this.now = DateTime.now()
    this.intervalId = setInterval(() => {
      this.now = DateTime.now()
    }, 100)
  },
  beforeDestroy () {
    clearInterval(this.intervalId)
  },
  methods: {
    autoEnable () {
      if (!this.disable) {
        this.$emit('enable')
        this.autoEnabled = true
      }
    },
    timer () {
      return (DateTime.fromISO(this.activationDate).toMillis() - this.now.toMillis()) / 1000
    }
  }
}
</script>
