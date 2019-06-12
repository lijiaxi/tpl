/**
 *   分页、刷新、过滤、导出部分混合
 */
export default {
  data() {
    return {
      downloadLoading: false,
      listQuery: {
        offset: 1,
        limit: 10,
      },
      total: 0,
      list: null,
    }
  },
  methods: {
    handleFilter() {
      this.listQuery.offset = 1
      this.fetchData()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.listQuery.offset = val
      this.fetchData()
    },
    onRefreash() {
      Object.assign(this.$data, this.$options.data())
      this.fetchData()
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
  }
}