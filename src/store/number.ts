import { defineStore } from 'pinia'

export const useNumberStore = defineStore('number', {
  state: () => ({
    number: 100
  }),
  actions: {}
})
