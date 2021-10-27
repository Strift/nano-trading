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
            disabled
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
        <span v-if="enabled" class="inline-flex items-center px-2 text-sm text-green-500 bg-green-100 rounded">Active</span>
        <span v-else class="inline-flex items-center px-2 text-sm text-red-500 bg-red-100 rounded">Inactive</span>
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

export default {
  props: {
    title: PropTypes.string.defaultValue('Micro bet'),
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    inputTitle: PropTypes.string.isRequired,
    selections: PropTypes.arrayOf(PropTypes.object),
    enabled: PropTypes.bool
  },
  computed: {
    isPositive () {
      return this.value > 0
    },
    isNegative () {
      return this.value < 0
    },
    timer () {
      return ''
    }
  }
}
</script>
