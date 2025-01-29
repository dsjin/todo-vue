<script setup lang="ts">
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'
</script>
<template>
  <div
    class="flex items-center justify-between w-full px-3 rounded-md bg-gray-300 py-5"
    :class="$attrs.class"
  >
    <div class="overflow-hidden w-full">
      <Skeleton height="2.25rem"></Skeleton>
    </div>
    <div class="w-15">
      <Button
        icon="pi pi-ellipsis-v"
        class="text-lg z-50"
        text
        severity="secondary"
        disabled
      />
    </div>
  </div>
</template>
<style></style>
