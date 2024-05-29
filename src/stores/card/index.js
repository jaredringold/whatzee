import { defineStore, acceptHMRUpdate } from 'pinia'
import state from './state'
import actions from './actions'
import getters from './getters'

const useCardStore = defineStore('card', {
  state: () => state,
  actions,
  getters
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCardStore, import.meta.hot))
}

export default useCardStore
