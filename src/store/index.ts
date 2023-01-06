import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)



export default new Vuex.Store({
  state: {
    expanded: false,
    stickyCount: 0,
    lastStuck: null as string | null,
  },
  mutations: {
    lastStuck(state, key) {
      state.lastStuck = key
    },
    sticky(state, key) {
      state.stickyCount += 1
      state.lastStuck = key
      window.setTimeout(() => {
        const lasts = Array.from(
            document.querySelectorAll('.title.sticky')
        );
        const last = lasts.pop();
        if (last) {
          state.lastStuck = last.getAttribute("data-key");
        } else {
          state.lastStuck = null
        }
      }, 50)
    },
    unsticky(state) {
      state.stickyCount -= 1
      window.setTimeout(() => {
        const last = Array.from(
            document.querySelectorAll('.title.sticky')
        ).pop();
        if (last) {
          state.lastStuck = last.getAttribute("data-key");
        } else {
          state.lastStuck = null
        }
      }, 50)
    },
    setExpanded(state, expanded) {
      state.expanded = expanded
    }
  },
  actions: {
  },
  modules: {
  }
})
