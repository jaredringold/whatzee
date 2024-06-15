import { defineStore, acceptHMRUpdate } from 'pinia'
import state from './state'
// import actions from './actions'
// import getters from './getters'

const useUIStore = defineStore('ui', {
  state: () => state
  // actions,
  // getters
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUIStore, import.meta.hot))
}

export default useUIStore
