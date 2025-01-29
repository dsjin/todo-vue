<script setup lang="ts">
import {
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  ref,
  type DefineProps,
  type Ref,
} from 'vue'

interface Props {
  options?: IntersectionObserverInit
}

const props = defineProps<Props>()
const emits = defineEmits<{
  intersect: []
}>()
const observer: Ref<IntersectionObserver | undefined> = ref(undefined)
const element: Ref<Element | undefined> = ref(undefined)
onMounted(() => {
  observer.value = new IntersectionObserver(([entry]) => {
    if (entry && entry.isIntersecting) {
      emits('intersect')
    }
  }, props.options)
  observer.value.observe(element.value!!)
})
onBeforeUnmount(() => {
  observer.value?.unobserve(element.value!!)
})
</script>
<template>
  <div class="observer" ref="element" />
</template>
