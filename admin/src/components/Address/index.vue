<template>
  <div class="address_container">
    <el-select v-model="provice" placeholder="请选择省" clearable filterable @change='getProvices'>
      <el-option
        v-for="p in proviceArr"
        :key="p.AREA_ID"
        :label="p.NAME"
        :value="p[label]">
      </el-option>
    </el-select>
    <el-select v-model="city" v-if="level > 1" placeholder="请选择市" filterable clearable @change='getCites'>
      <el-option
        v-for="c in cityArr"
        :key="c.AREA_ID"
        :label="c.NAME"
        :value="c[label]">
      </el-option>
    </el-select>
    <el-select v-model="area" v-if="level > 2" placeholder="请选择地区" filterable clearable @change="getAreas">
      <el-option
        v-for="a in areaArr"
        :key="a.AREA_ID"
        :label="a.NAME"
        :value="a[label]">
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    address: {
      type: Array
    },
    label: {
      type: String,
      default: ''
    },
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
  mounted () {
    this.$nextTick(() => {
      this.proviceArr = this.address.filter(item => item.FID == '0')
      this.provice = this.proviceId
      this.city = this.cityId
      this.area = this.areaId
    })
  },
  watch: {
    proviceId (nv, ov) {
      this.provice = nv
    },
    cityId (nv, ov) {
      this.city = nv
    },
    areaId (nv, ov) {
      this.area = nv
    }
  },
  methods: {
    getCites (val) { 
      if (val) {
        this.a = this.cityArr.filter(item => item[this.label] == val)[0].AREA_ID     
      } else {
        let temp = this.p  || -1
        this.cityArr = this.address.filter(item => item.FID == temp )
        this.area = ''
        this.a = ''
        this.areaArr = []
      }
      this.getAreas()
      this.$emit('change', [this.provice, this.city, this.area])
    },
    getAreas (val) { 
      if (val) {
        this.c = this.areaArr.filter(item => item[this.label] == val)[0].AREA_ID
      } else {
        let temp = this.a  || -1
        this.areaArr = []
        this.c = ''
        this.areaArr = this.address.filter(item => item.FID == temp)
      }
       this.$emit('change', [this.provice, this.city, this.area])
    },
    getProvices (val) {
      if (val) {
        this.p = this.proviceArr.filter(item => item[this.label] == val)[0].AREA_ID
      } else {
        this.p = ''
      } 
      this.city = ''
      this.area = ''
      this.cityArr = []
      this.areaArr = []
      this.getCites()
      this.$emit('change', [this.provice, this.city, this.area])
    }
  },
}
</script>
<style lang="scss" scoped>
.address_container {
  display:flex
}
  
</style>
