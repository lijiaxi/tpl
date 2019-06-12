<style lang="stylus" scoped>
/deep/
  .van-field__label
    white-space nowrap
  .van-cell__value.van-cell__value--alone
    background-color #f6f6f6
    padding 6px
  .van-radio-group
    flex 1
    display flex
    justify-content space-between
.body
  padding-bottom 30px
.img-item
  width 60px 
  height 60px
  border-radius 8px
  border 1PX solid #e5e5e5
  color #e5e5e5
  flex-direction column
  margin-right 6px
  flex-grow 0
  &:last-child
    margin-right 0
.upload-img
  width 100%
  height 100%
.icon-delete
  position absolute
  right -10px
  top -10px
.btn-submit
  width 100%
  background #e77918
  color #fff
</style>

<template>
  <div class="main_box pr">
    <vue-better-scroll
      class="wrapper mgt10"
      ref="scroll"
      :scrollbar="{
        fade: true
      }"
    >
      <div class="body">
        <div class="panel mgb8">
          <div class="flex panel-header mg4">
            <van-icon class="mgr4" name='friends-o' />
            个人信息
          </div>
          <div class="bgw">
            <van-cell-group>
              <van-field
                v-model="order.name"
                clearable
                label="联系人"
                input-align='right'
                maxlength='10'
                placeholder="请输入联系人"
              />
              <van-field
                clearable
                v-model="order.phone"
                type='number'
                label="电话"
                maxlength='11'
                input-align='right' 
                placeholder="请输入电话"
              />
              <van-field
                clearable
                v-model="order.furniture"
                label="家私"
                input-align='right' 
                placeholder="请输入家私"
              />
            </van-cell-group>
          </div>
        </div>
        <div class="panel">
          <div class="flex panel-header mg4">
            <van-icon class="mgr4" name='hotel-o' />
            房源信息
          </div>
          <div class="bgw">
            <van-cell-group>
              <van-field
                v-model="order.communityName"
                clearable
                label="小区名称"
                input-align='right'
                maxlength='10'
                placeholder="请输入联系人"
              />
              <van-cell @click="show = true" title="房源(省、市、区)" :value="order.address ? order.address : '请选择地址'" is-link/>
              <van-field
                v-model="order.address"
                type="textarea"
                placeholder="请输入详细地址"
                rows="4"
              />
              <van-field
                v-model="order.acreage"
                clearable
                label="面积"
                type='number'
                input-align='right'
                maxlength='4'
                placeholder="平"
              />
              <van-cell @click="houseShow = true" title="户型" :value="order.structure ? order.structure : '请选择户型'" is-link/>
              <van-field
                v-model="order.floor"
                clearable
                label="楼层"
                input-align='right'
                maxlength='3'
                type='number'
                placeholder="层"
              />
              <van-field
                v-model="order.price"
                clearable
                label="租金"
                input-align='right'
                maxlength='8'
                type='number'
                placeholder="元/月"
              />
              <van-cell @click="payShow = true" title="付款方式" :value="order.payType ? order.payType : '请选择付款方式'" is-link/>
              <van-panel title="描述" >
                <van-field
                  v-model="order.description"
                  type="textarea"
                  placeholder="请输入描述"
                  rows="4"
                />
              </van-panel>
              <van-panel title="上传房源图片" >
                <div class="pd12 flex">
                  <div class="img-item flex-center" v-show="files.length < 5">
                    <van-uploader
                      accept="image/png, image/jpeg"
                      multiple
                      :after-read="onRead">
                      <van-icon
                        color='#e5e5e5'
                        size='24px'
                        name="photograph" />
                    </van-uploader>
                    <span style="color:#000">{{files.length}}/5</span>
                  </div>
                  <div class="img-item flex-center pr" v-for="img in files">
                    <img class="upload-img" :src="img.url" alt="">
                    <van-icon
                      @click="onRemove(img)"
                      class="icon-delete" 
                      name="close"
                      size='28px'
                      color='#ed4014' />
                  </div>
                </div>
              </van-panel>
            </van-cell-group>
          </div>
        </div>
        <div class="bgw flex flex-between pd12 mg12-y">
          <span class="mgr20">房源有效期</span>
          <van-radio-group v-model="order.onlineTime">
            <van-radio checked-color='#e77918' :name="7">7天</van-radio>
            <van-radio checked-color='#e77918' :name="15">15天</van-radio>
            <van-radio checked-color='#e77918' :name="30">30天</van-radio>
          </van-radio-group>
        </div>
        <van-button
          @click="onSubmit"
          class="btn-submit"
          :loading='loading'
          type="default">发布</van-button>
      </div>
    </vue-better-scroll>
    <van-popup v-model="show" position="bottom" >
      <div class="popup-wrapper">
        <van-area 
          @cancel='show = false'
          @confirm='confirm'
          title="房源(省、市、区)" 
          :area-list="areaList" />
      </div>
    </van-popup>
    <van-popup v-model="houseShow" position="bottom" >
      <div class="popup-wrapper">
        <van-picker 
          show-toolbar  
          :columns="columns" 
          @confirm="onChange"
          @cancel='houseShow = false'
        />
      </div>
    </van-popup>
    <van-popup v-model="payShow" position="bottom" >
      <div class="popup-wrapper">
        <van-picker 
          show-toolbar  
          :columns="payTypes" 
          @confirm="onTypeChange"
          @cancel='payShow = false'
        />
      </div>
    </van-popup>
  </div>
</template>

<script>
import VueBetterScroll from '@/components/better-scroll';
import Qrcode from '@/components/Qrcode'
import areaList from '@/utils/area';
import { imgRotate } from '@/utils';
import * as api from '@/service';
import { validatePhone } from '@/utils/validate'
import UTILS from '@/vendor'
const citys = {
  '一室': ['一厅', '二厅', '三厅'],
  '二室': ['一厅', '二厅', '三厅'],
  '三室': ['一厅', '二厅', '三厅'],
  '四室': ['一厅', '二厅', '三厅'],
  '五室': ['一厅', '二厅', '三厅'],
};
export default {
  components: {
    VueBetterScroll,
    Qrcode
  },
  data() {
    return {
      order: {
        onlineTime: 7,
        name: '',
        phone: '',
        address: '',
        payType: '',
        acreage: '',
        structure: '',
        floor: '',
        price: '',
        description: '',
        communityName: '',
        furniture: '',
        // imagesUrl: ''
      },
      rules: {
        name: [
          { validator: val => { return !val.trim() }, msg: '请输入联系人' }
        ],
        phone:  [
          { validator: val => { return !validatePhone(val) }, msg: '请输入正确的手机号码' }
        ],
        address: [
          { validator: val => { return !val.trim() }, msg: '请输入地址' }
        ],
        payType: [
          { validator: val => { return !val.trim() }, msg: '请输入选择付款方式' }
        ],
        acreage: [
          { validator: val => { return !val.trim() }, msg: '请输入面积' }
        ],
        structure: [
          { validator: val => { return !val.trim() }, msg: '请选择户型' }
        ],
        floor: [
          { validator: val => { return !val.trim() }, msg: '请输入楼层' }
        ],
        price: [
          { validator: val => { return !val.trim() }, msg: '请输入租金价格' }
        ],
        description: [
          { validator: val => { return !val.trim() }, msg: '请输入描述' }
        ],
        communityName: [
          { validator: val => { return !val.trim() }, msg: '请输入小区名称' }
        ],
        furniture: [
          { validator: val => { return !val.trim() }, msg: '请输入家具' }
        ],
      },
      radio: '1',
      value: '',
      show: false,
      houseShow: false,
      payShow: false,
      areaList: areaList,
      files: [],
      address: '',
      columns: [
        {
          values: Object.keys(citys),
          className: 'column1'
        },
        {
          values: citys['一室'],
          className: 'column2',
        }
      ],
      house: '',
      payType: '',
      payTypes: ['押3付1', '押2付1', '押1付1'],
      loading: false,
      options: { 
        text: 'https://www.nbdlc.com/',
        width: 100,
        height: 100
      }
    };
  },
  methods: {
    confirm(val) {
      this.order.address = val.map(item => item.name).join('')
      this.show = false
    },
    async onRead(files) {
      if(Array.isArray(files)) {
        if (files.length > 5) {
          this.$notify({
            message: '最多只能上传5张',
            duration: 2000,
            background: '#ed4014'
          });
          return
        }
        files = await Promise.all(files.map(imgRotate))
        let current = this.files.length
        let isMax = current + files.length
        if (isMax > 5) {
          this.$notify({
            message: '最多只能上传5张',
            duration: 2000,
            background: '#ed4014'
          });
          return
        }
        this.files = [...this.files, ...files]
      } else {
        let res = await imgRotate(files)
        this.files.push(res)
      }
    },
    onRemove(img) {
      let index = this.files.findIndex(item => item === img)
      this.files.splice(index, 1)
    },
    onChange(values) {
      this.order.structure = values.join('')
      this.houseShow = false
    },
    onTypeChange(values) {
      this.order.payType = values
      this.payShow = false
    },
    async addHouse() {
      this.loading = true
      try {
        const {data} = await api.addHouse(this.order)
        this.$notify({
          message: '发布成功',
          duration: 2000,
          background: '#2d8cf0'
        });
        setTimeout(() => {
          this.$router.replace({
            name: 'success'
          })
        }, 1200);
      } catch (error) {
        this.loading = false
      }
    },
    onSubmit() {
      try {
        let isVliad = Object.keys(this.valid)
        if (isVliad.length) {
          this.$toast.fail(this.valid[isVliad[0]].msg);
          return
        } else {
          if (!this.files.length) {
            this.$toast.fail('请上传房源图片');
            return
          }
          this.$dialog.confirm({
            title: '提示',
            message: '确定发布房源？'
          }).then(async() => {
            await this.uploadAll()
            this.addHouse()
          })
        }
      } catch (error) {
        this.$toast.fail(error.errMsg || error.msg || error);
      }
    },
    async uploadAll() {
      let res = await Promise.all(this.files.map(async ({file}) => {
        let formData = new FormData()
        formData.append('file', file)
        formData.append('filename', 'img')
        return await api.upload(formData)
      }))
      this.order.imagesUrl = res.map(item => {
        return item.data.data.url
      }).join(',')
    },
  },
  computed: {
    valid() {
      return Object.entries(this.rules).reduce((rule, next) => {
        let [key, validators] = next
        let ret = validators.reduce((v, n) => {
          let {validator, ...other} = n
          return validator(this.order[key]) ? { ...v, ...other } : {}
        }, {})
        let res = {...rule, ...{ [key]: { ...ret}}}
        return Object.values(ret).length ? {...rule, ...{ [key]: { ...ret}}} : rule
      }, {})
    }
  },
  created() {

  },
  async mounted() {
    let res = await UTILS.scan()
    console.log(res);
  }
};
</script>

<style lang='stylus' scoped>
.main_box{
  margin 15px
  height 100%
}
</style>
