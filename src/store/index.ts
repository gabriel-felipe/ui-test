import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)



export default new Vuex.Store({
  state: {
    expanded: false
  },
  mutations: {
    setExpanded(state, expanded) {
      state.expanded = expanded
    }
  },
  actions: {
  },
  modules: {
  }
})
