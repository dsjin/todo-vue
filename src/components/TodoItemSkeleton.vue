<script setup lang="ts">
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Skeleton from 'primevue/skeleton'
</script>
<template>
  <div class="flex items-center">
    <Checkbox class="mr-2" disabled />
    <div class="overflow-hidden mr-2 w-full">
      <Skeleton height="15px"></Skeleton>
    </div>
    <Button icon="pi pi-trash" severity="danger" size="small" text disabled />
  </div>
</template>
