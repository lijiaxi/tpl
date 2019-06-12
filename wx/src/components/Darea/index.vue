<template>
  <div >
      <Area 
        :area-list="areaList" 
        @confirm='onConfirm'
        @cancel='onCancel'
      />
  </div>
</template>

<script>
import { Area } from 'vant';
import areaList from '@/utils/area';
import { addressData, getAreaIdByName, getAreaId } from '@/utils/getAddress';
export default {
  data() {
    return {
      areaList: areaList
    };
  },
  methods: {
    onConfirm(value) {
      let p, c, a, p_id, c_id, a_id,areaNum=[];
      p = value[0].name
      c = value[1].name
      a = value[2].name
      try {
        p_id = getAreaIdByName(p)
        c_id = getAreaIdByName(c)
        a_id = getAreaId(c_id).filter(item => {
          return item.NAME == a
        })[0].AREA_ID
      } catch (error) {
        console.warn('省市区地址不一致，请更改数据');
      }
      this.$emit('onConfirm', 
        [
          {name: p, code: p_id},
          {name: c, code: c_id},
          {name: a, code:a_id}
      ]
      )
    },
    onCancel () {
      this.$emit('onCancel')
    }
  },
  components: {
    Area 
  }
};
</script>

<style scoped lang='stylus'>

</style>
