export default {
  methods: {
    en2cn (key) {
      let word
      switch (key) {
        case 'realName':
          word = '持卡人姓名'
          break;
        case 'bankCard':
          word = '银行卡号'
          break;
        case 'bankName':
          word = '银行名称'
          break;
        case 'branchName':
          word = '所属支行'
          break;
        default:
          break;
      }
      return word
    },
  },
  computed: {
    validator() {
      let validKey = Object.entries(this.query).filter(arr => { 
        return !arr[1]
      })[0]
      if (validKey) { 
        return {
          valid: false,
          msg: `请输入${this.en2cn(validKey[0])}`
        }
      }
      return {
        valid: true,
        msg: 'ok'
      }
    }
  }
}