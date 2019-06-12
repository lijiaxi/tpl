<template>
  <div class="address_container">
    <el-cascader
      v-model="value"
      :options="options"
      @active-item-change="handleItemChange"
      :props="props"
      @change='onChange'
      :change-on-select='level == 1'
    ></el-cascader>
  </div>
</template>

<script>
import { Aus, getAddressByAreaId } from '@/utils/Australlia';
export default {
  props: {
    level: {
      type: Number,
      default: 2  //  1, 2, 3 、省、市
    }
  },
  data() {
    return {
        value: [],
        options: [],
        props: {
          value: 'id',
          label: 'name',
          children: 'cities'
        }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getProvices()
    })
  },
  methods: {
    getProvices () {
      this.options = getAddressByAreaId(0).map(item => {
        return {
          ...item,
          cities: []
        }
      })
    },
    handleItemChange([fid]) {
        let cities = getAddressByAreaId(fid)
        cities = this.getChildren(cities)
        this.options[fid - 1].cities = cities
        this.$forceUpdate()
    },
    getChildren (cities) {
      // 存放已有的首字母
      let temp = []
      let children = []
      cities.forEach(item => {
        // 获取首字母
        let upperWord = this.getUpperWord(item.name)
        // // 不在temp 存入已该字母为首的对象
        if (temp.indexOf(upperWord) === -1) {
          temp.push(upperWord)
          children.push({
            value: upperWord,
            label: upperWord,
            cities: [item]
          })
        } else {
          // 找到已该字母为首的子数组
          for (let i = 0, len = children.length; i < len; i++) {
            if (upperWord === children[i].value) {
              children[i].cities.push(item)
            }
          }
        }
      })
      return children
    },
    getUpperWord (words) {
      return words.substr(0, 1)
    },
    onChange (arr) {
      let [p, a, c] = arr
      let val
      this.$nextTick(() => {
        if (this.level === 1) {
          val = this.options[p - 1].name
          this.$emit('change', val)
        } else {
          let cities = this.options[p - 1].cities
          let city = cities.filter(i => i.label === a)[0]
          let i = city.cities.filter(i => i.id === c)[0]
          val = i.name
          this.$el.querySelector('.el-cascader__label').innerHTML =  val
          this.$emit('change', val)
        }   
      })      
    }
  },
}
</script>
<style lang="scss" scoped>
.address_container {
  display:flex
}
  
</style>
