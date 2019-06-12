<template>
  <div class="address_container">
    <el-select v-model="provice" placeholder="请选择省" clearable @change='getProvices'>
      <el-option
        v-for="p in proviceArr"
        :key="p.AREA_ID"
        :label="p.NAME"
        :value="p.AREA_ID">
      </el-option>
    </el-select>
    <el-select v-model="city" v-if="level > 1" placeholder="请选择市" clearable @change='getCites'>
      <el-option
        v-for="c in cityArr"
        :key="c.AREA_ID"
        :label="c.NAME"
        :value="c.AREA_ID">
      </el-option>
    </el-select>
    <el-select v-model="area" v-if="level > 2" placeholder="请选择地区" clearable @change="getAreas">
      <el-option
        v-for="a in areaArr"
        :key="a.AREA_ID"
        :label="a.NAME"
        :value="a.AREA_ID">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { address } from '@/utils/getAddress'
export default {
  props: {
    proviceId: {
      type: [String, Number],
      default: ''
    },
    cityId: {
      type: [String, Number],
      default: ''
    },
    areaId: {
      type: [String, Number],
      default: ''
    },
    level: {
      type: [String, Number],
      default: 3
    }
  },
  data() {
    return {
      proviceArr: [],
      cityArr: [],
      areaArr: [],
      provice: '',
      city: '',
      area: '',
      p: '',
      c: '',
      a: ''
    }
  },
  watch: {
    proviceId: {
      immediate: true,
      deep: true,
      handler (nv, ov) {
        this.provice = nv ? nv == 'undefined' ? '' : parseInt(nv, 10) : ''
        this.renderCities()
      }
    },
    cityId: {
      immediate: true,
       deep: true,
      handler (nv, ov) {
       
          this.city = nv ? nv == 'undefined' ? '' : parseInt(nv, 10) : ''
          this.renderAreas()
      
       
      }
    },
    areaId: {
       deep: true,
      immediate: true,
      handler (nv, ov) {
        
        this.area = nv ? nv == 'undefined' ? '' : parseInt(nv, 10) : ''
      }
    }
  },
  mounted () {
  
    this.$nextTick(() => {
      this.proviceArr = address.filter(item => item.FID == '0')

    })
   
  },
  methods: {
    getCites (val) {
      
      this.$nextTick(() => { 
        if (val) {
          this.a= this.cityArr.filter(item => item.AREA_ID == val)[0].NAME
          this.$emit('update:cityId', val)
        } else {
          let temp = this.provice  || -1
          this.cityArr = address.filter(item => item.FID == temp )
          this.area = ''
          this.a = ''
          this.areaArr = []
          this.$emit('update:cityId', '')
        }
        this.getAreas()
      })
      this.$emit('change', [this.p, this.a, this.c])
    },
    getAreas (val) {
     
      if (val) {
        this.c = this.areaArr.filter(item => item.AREA_ID == val)[0].NAME
        this.$emit('update:areaId', val)
      } else {
        let temp = this.city  || -1
        this.areaArr = []
        this.c = ''
        this.areaArr = address.filter(item => item.FID == temp)     
        this.$emit('update:areaId', '')
      }
      this.$emit('change', [this.p, this.a, this.c])
    },
    getProvices (val) {
      this.p = this.proviceArr.filter(item => item.AREA_ID == val)[0].NAME
      this.$emit('update:proviceId', val)
      this.$emit('change', [this.p, this.a, this.c])
      this.city = ''
      this.area = ''
      this.cityArr = []
      this.areaArr = []
      this.provice = val
      this.getCites()
    },
    renderCities () {
      if (!this.provice) {
        return
      }
      this.cityArr = address.filter(item => item.FID == this.provice)
    },
    renderAreas () {
      if (!this.city) {
        return
      }
      this.areaArr = address.filter(item => item.FID == this.city)
    }
  },
}
</script>
<style lang="scss" scoped>
.address_container {
  display:flex
}
  
</style>
