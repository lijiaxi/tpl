export const state = () => ({
  list: null
})

export const mutations = {
  getList (state, links) {
    state.list = links
  }
}