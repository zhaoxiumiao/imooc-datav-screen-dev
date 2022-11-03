<template>
  <div class="test" @click="increment">{{ message }}</div>
  <div>Pinia Number{{ numberStore.number }} {{ numberStore.secret }}</div>
</template>

<script setup name="xxx" lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { useNumberStore } from '@/store/number'
  const numberStore = useNumberStore()
  const route = useRoute()
  const message = ref<string>('hello world')
  console.log(route.fullPath, 'route')

  const increment = () => {
    message.value += '1'
    numberStore.number++
  }
  onMounted(() => {
    console.log(111)
  })
</script>

<style scoped lang="scss">
  .test {
    color: red;
  }
</style>
