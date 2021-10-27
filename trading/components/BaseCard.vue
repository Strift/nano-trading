<template>
  <div class="bg-white py-5 rounded-md">
    <div class="border-b border-gray-light px-5 pb-3">
      <slot name="header" />
    </div>
    <div class="px-5 pt-3">
      <slot name="default" />
    </div>
  </div>
</template>
