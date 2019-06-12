<style lang="stylus" scoped>
.slider_footer
  width 100%
  background-color: rgba(25,25,25,0.5);
  padding 4px 10px
.slider_tag
  margin-left 10px
</style>

<style lang="stylus" scoped>
.links {
  flex-wrap: wrap;
  width 100%
}

.link-item {
  width: 20%;
  text-align: center;
  margin-bottom 10px
}
</style>

<template>
  <div class="_c flex1 pr">
     <div class="full-page-slide-wrapper" >
        <slide v-show="isAllReady" ref="slide" @pageEnd='finish' :loop="false" :autoPlay="false" :showDot="false">
          <!-- 首页第一屏 -->
          <div class="slide-item fullpage-item pr" :class="{'active': activeIndex == 0}">
            <div class="video_c animated" >    
              <vue-plyr
                v-show="playerReady"
                ref='plyr'
                style="height:100%"
                > 
                <video
                  x5-playsinline=""
                  webkit-playsinline="true" 
                  x-webkit-airplay="true" 
                  x5-video-player-type="h5" 
                  x5-video-player-fullscreen="" 
                  x5-video-orientation="portraint"
                  class="hide"
                  data-plyr-config='{"resetOnEnd": true}'
                  src="/dlc_video01.mp4" controls>
                  sorry, your Browser does not support        
                </video>
              </vue-plyr>
              <div v-show="!playerReady" class="skeleton flex-center">
                <v-icon  size='60' color="#fb5707">play_circle_filled</v-icon>
              </div>
            </div>
            <div class="flex1 pr">
              <canvas-rain imgSrc='/rain.png' v-if="activeIndex >=0 && activeIndex <= 1" ref="rain"></canvas-rain>
              <!-- 字幕 -->
              <div class="subtitle flex pdl20 letter-space ft20 mgt40 mgb20">
                <strong class="animated bold ">大数据</strong>
                <strong class="animated">
                  <v-icon size="20" color="#000">add</v-icon>
                </strong>
                <strong class="bold">人工智能赋能企业转型升级</strong>
              </div>
              <!-- 描述 -->
              <div class="desc pd20-x">
                深圳迪尔西科技是一家定位于移动互联网+智能硬件一体化解决方案开发服务商：APP定制开发，小程序，为您量身定制电子
                电路设计、嵌入式软硬件设计、智能硬件APP开发、APP定制开发，微信二次开发，云服务器应用开发领域，小猪上学幼教平台
                四大核心的技术型公司。
              </div>
              <!-- canvas雪花背景 -->
              
            </div> 
          </div>
          <!-- 首页第二屏 -->
          <div class="slide-item fullpage-item pr" :class="{'active': activeIndex == 1}">
            <div class="video_c animated">
              <!-- video 插件 -->
              <vue-plyr  style="height:100%" v-show="playerReady1" ref="plyr1">
                <video
                  x5-playsinline=""
                  webkit-playsinline="true" 
                  x-webkit-airplay="true" 
                  x5-video-player-type="h5" 
                  x5-video-player-fullscreen="" 
                  x5-video-orientation="portraint"
                  class="hide"
                  data-plyr-config='{"resetOnEnd": true }' 
                  src="/dlc_video02.mp4" >
                  sorry, your Browser does not support   
                </video>
              </vue-plyr>
              <!-- 骨架屏 -->
              <div v-show="!playerReady1" class="skeleton flex-center">
                <v-icon  size='60' color="#fb5707">play_circle_filled</v-icon>
              </div>
            </div>
            <div class="flex1 pr">
              <!-- canvas雪花背景 -->
              <canvas-snow v-if="activeIndex >=0 && activeIndex <= 2" ref="snow"></canvas-snow>
              <!-- 字幕 -->
              <div class="subtitle flex pdl20 bold mgt40 mgb20 letter-space ft20">
                <strong class="animated bold ">7年</strong>
                <strong class="bold ">方案开发</strong>
              </div>
              <!-- 描述 -->
              <div class="desc pd20-x">
                <p>用心解决物联网行业痛点问题，高端正规，全五星好评，客户满意度100%，300位
                优秀工程师开发团队，拥有7年开发经验，超过720个行业见证！</p>
                <p>深圳迪尔西科技--带您进入智能时代</p>
                
              </div>
              
            </div>
          </div>
          <!-- 首页第三屏 -->
          <div class="slide-item pr fullpage-item" :class="{'active': activeIndex == 2}">
            <div class="item_header">
                <h2 class="fw item_title ftc ft_song">研发优势</h2>
            </div>
            <div class="tree_c">   
              <div class="middle_line flex-column-between">
                <div class="circle">
                  <!-- 圆 -->
                  <nuxt-link  class="animated radius_c f"  :to="{name: 'solution', query: {type: 3, typeName: 4, activeIndex: 2}}" />
                  <!-- 字 -->
                  <div class="txt_c f">
                    <div class="fx1">
                      <div class="txt_item ft14">
                        <p>新零售</p>
                        <p>活数据赋</p>
                        <p>能实体经济</p>
                      </div>
                      <!-- <div class="txt_mask">
                        <p>智能垃圾桶/智能农场/智能鱼缸/智能花盆/智能机器人/智能回收站/智能路灯</p>
                        <p>软硬件一体化解决方案</p>
                      
                      </div> -->
                    </div>
                  </div>
                  <!-- 线 -->
                  <div class="line_c f"></div>
                </div>
                <div class="circle">
                  <!-- 第二个 -->
                  <nuxt-link class="animated radius_c s"  :to="{name: 'solution', query: {type: 3, typeName: 3, activeIndex: 2}}" />
                  <div class="txt_c s">
                    <div class="fx1">
                      <div class="txt_item ft14">
                        <p>共享经济</p>
                        <p>重构未来商业</p>
                        <p>新模式</p>
                      </div>
                      <!-- <div class="txt_mask">
                        <p>专业的共享经济新模式制作开发团队，支持定制各种共享经济方案开发</p>
                        <p>提供软硬件一体化服务</p>
                      </div> -->
                    </div>
                  </div>
              
                  <div class="line_c s"></div>
                </div>
                <div class="circle">
                  <!-- 圆 -->
                  <nuxt-link  class="animated radius_c t"  :to="{name: 'solution', query: {type: 3, typeName: 2, activeIndex: 2}}" />
                  <!-- 字 -->
                  <div class="txt_c t">
                    <div class="fx1">
                      <div class="txt_item ft14">
                        <p>物联网</p>
                        <p>提供人工智能</p>
                        <p>物联网解决方法</p>
                      </div>
                      <!-- <div class="txt_mask">
                        <p>智能称重型/扫码电锁型/智能格子型/电子标签型/自动售货型/无人售货机</p>
                        <p>软硬件一体化解决方案</p>
                      </div> -->
                    </div>
                  </div>
                  <!-- 线 -->
                  <div class="line_c t"></div>
                </div>
                <div class="circle">
                  <!-- 第四个 -->
                  <nuxt-link  class="animated radius_c h"  :to="{name: 'solution', query: {type: 3, typeName: 5, activeIndex: 2}}" />
                  <div class="txt_c h">
                    <div class="fx1">
                      <div class="txt_item ft14">
                        <p>APP应用</p>
                        <p>智能化厂家</p>
                        <p>轻松实现</p>
                      </div>
                      <!-- <div class="txt_mask">
                        <p>支持定制开发各类小程序、APP，安卓IOS</p>
                        <p>系统源码交付</p>
                      </div> -->
                    </div>
                  </div>
                  <div class="line_c h"></div>
                </div>
              </div>
            </div>
            <canvas-star  v-if="activeIndex >= 1 && activeIndex <= 3" ref="cas"></canvas-star>
          </div>
          <!-- 首页第四屏 -->
          <div class="slide-item flex-column-center fullpage-item" :class="{'active': activeIndex == 3}">
            <div class="flex1 w100 bgw">
              <div class="item_header">
                <h2 class="fw item_title ftc ft_song" style="color:#000">爆款</h2>
              </div>
              <div class="xslide_c flex1">
                <x-slide ref='xslide'  @pageEnd="onFourthEnd" :autoPlay='true' :loop='true'>
                  <div v-for="(item, sindex) in hotList" :data-index="sindex" class="img-wrapper">
                      <nuxt-link
                        v-for="(link, index) in item"
                        :key="link.title"
                        tag='div'          
                        :to="{name: link.name, query:  Object.assign({}, link.query, {activeIndex: 3})}" 
                        class="expo_c lazy-img flex1 ft14" >
                          <template v-if='index % 2 == 0'>
                            <img :src="link.backgroundImage" alt="" class="aaaa">
                            <div class="text-wraper" :style="`background-image:url('/main0.png')`"> {{link.title}} </div>
                          </template>
                          <template v-else>   
                            <div class="text-wraper" :style="`background-image:url('/main1.png')`"> {{link.title}} </div>
                            <img :src="link.backgroundImage" alt="" class="aaaa">
                          </template>   
                      </nuxt-link>
                  </div>
                </x-slide>
              </div>
            </div>

          </div>
          <!-- 首页第五屏 -->
          <div class="slide-item  flex-column-center fullpage-item"  :class="{'active': activeIndex == 4}">
            <div class="flex1 w100 bgw">
                <div class="item_header">
                  <h2 class="fw item_title ftc ft_song" style="color:#000">整体解决方案</h2>
                </div>
                <div class="xslide_c flex1">
                  <x-slide ref='xslide1' :autoPlay='true'  @pageEnd="onFifthEnd" :loop='true'>
                    <div v-for="(item, sindex) in solutionList" :data-index="sindex" class="img-wrapper">
                        <nuxt-link
                          v-for="(link, index) in item"
                          :key="link.title"
                          tag='div'          
                          :to="{name: link.name, query: Object.assign({}, link.query, {activeIndex: 3})}" 
                          class="expo_c lazy-img flex1 ft14" >
                            <template v-if='index % 2 == 0'>
                              <img :src="link.backgroundImage" alt="" class="aaaa">
                              <div class="text-wraper" :style="`background-image:url('/main0.png')`">  {{link.title}}  </div>
                            </template>
                            <template v-else>   
                              <div class="text-wraper" :style="`background-image:url('/main1.png')`">   {{link.title}} </div>
                              <img :src="link.backgroundImage" alt="" class="aaaa">
                            </template>
                            
                        </nuxt-link>
                    </div>
                  </x-slide>
                </div>
            </div> 
          </div>
          <!-- 首页第六屏 -->
          <div class="slide-item fullpage-item"  :class="{'active': activeIndex == 5}">
            <div class="flex1 w100 mgb40">
              <div class="item_header">
                <h2 class="fw item_title ftc ft_song" style="color:#000">新闻资讯</h2>
              </div>
              <div class="xslide_c big flex1">
                <x-slide ref='xslide2' :showDot='true' :autoPlay='false' :loop='true'>
                  <template v-for="(item, index) in list">
                    <nuxt-link tag='div'  :style="`background-image:url('${item.messagePic}')`" :data-background-image='item.messagePic' :key="item.messageId" :to="{name: 'detail', query: {messageId: item.messageId, type: item.messageType, activeIndex: 5}}" class="expo_c lazy-img"  >
                      <div class="slider_item ta-lt ftw">
                        <div class="tag_c">
                          <div class="slider_tag">{{item.label}}</div>
                        </div>
                        <div class="slider_footer ft16 eli">
                          <div class="create_at">{{item.ctime}}</div>
                          <div class="slider_title eli">{{item.title}}</div>
                        </div>
                      </div>
                    </nuxt-link>
                  </template>  
                </x-slide>
              </div>
            </div>
            <div class="flex-around count_c pd20-y mgt40">         
              <div class="count_item flex-column-center ft14 pr">
                <count-to class='count_item--c' v-if="activeIndex == 5" :separator="''" :startVal='0' :endVal='10' :duration=3000>
                  <div class="count_item--icon"></div>
                </count-to>
                <span class="count_item--tip ftw">年的积累</span>
                
              </div>
              <div class="count_item flex-column-center ft14 pr">
                <count-to class='count_item--c' v-if="activeIndex == 5" :separator="''" :startVal='0' :endVal='1980' :duration=4000>
                  <div class="count_item--icon"></div>
                </count-to>
                <span class="count_item--tip ftw">套整体解决方案设计</span>
                
              </div>
              <div class="count_item flex-column-center ft14 pr">
                <count-to class='count_item--c' v-if="activeIndex == 5" :separator="''" :startVal='0' :endVal='1000' :duration=4000>
                  <div class="count_item--icon"></div>
                </count-to>
                <span class="count_item--tip ftw">多家合作伙伴</span>   
              </div>
            </div>    
          </div>
          <!-- 首页第七屏 -->
          <div class="slide-item flex-column-center fullpage-item" :class="{'active': activeIndex == 6}">
            <div class="item_header">
              <h2 class="fw item_title ftc ft_song">合作伙伴</h2>
            </div>
            <div class="corper_c flex-center flex1" style="align-items: flex-start" ref='corper'>
              <div class="company_icon animated mgr100 fxc" id='animateHead'></div>
              <div class="company_icon animated  fxc">
              
              </div>
              <div class="company_icon animated mgr100 fxc">
                
              </div>
              <div class="company_icon animated  fxc" >
                
              </div>
              <div class="company_icon animated mgr100 fxc">
                
              </div>
              <div class="company_icon animated  fxc">
                
              </div>
              <div class="company_icon animated mgr100 fxc">
              
              </div>
              <div class="company_icon  fxc" id='animateTail'> </div>
            </div>
          </div>
          <!-- 首页第八屏 -->
          <div class="slide-item fullpage-item flex" :class="{'active': activeIndex == 7}">
            <div class="flex-column-center pr graybg flex1" style="height:100%">
              <canvas-star ref="cas" v-if='activeIndex >= 6 && activeIndex <= 8'></canvas-star>
              <div class="xslide-wrapper mgb20">
                <x-slide ref='footer' :autoPlay='true' :interval="3000" :loop='true'>
                  <div 
                      class="carousel_item pd20 ft16 br8" 
                      v-for="(item, index) in comList"
                      :key="index"
                    >       
                      <h3 class="ta-lt mgb10">{{item.companyName}}</h3>
                      <p class="ta-lt mgb10" style="display:flex:align-items:center">
                        公司电话：<a style='display:inline-block; color:inherit;vertical-align:middle' :href="'tel:' + item.companyConcat">{{item.companyConcat}}</a>
                      </p>
                      <p class="ta-lt" style="white-space:pre-line">公司地址：{{item.companyAddress}}</p>
                  </div>
                </x-slide>
              </div>
              <div class="flex-column-center mg20-y">
                <div class="qrcode_c mgb10">
                  <img class="qrcode-img" src="~static/qrcode.png" alt="">
                </div>
                <h2 title='迪尔西公众号' class="ft18 ftw">深圳迪尔西公众号</h2>
              </div>
            </div>
          </div>
          <!-- 首页第九屏 -->
          <div class="slide-item flex-column-center fullpage-item" :class="{'active': activeIndex == 8}">
            <div class="com_introduction pd10 w100 flex-column-center" style="height:100%">
              <div class="inner mgt20">
                <h1 class="com_name mgb14 ft16 ta-lt">
                  <img src="~/static/sup-logo.png" alt="" class="logo mgr10">
                  深圳市维码物联网有限公司  
                </h1>
                <div class="com_info base_line flex-column-center ft16">
                  <h2 class="mgb12 ft18">移动网联网+智能硬件一体化解决方案提供商</h2>
                
                  <h2 class="mgb12 ft16">广东省深圳市南山区深圳湾科技生态园9栋A2 17楼</h2>
                
                  <h2 class="mgb12 ft18">服务热线：18898766577</h2>
                </div>
              </div>
              <div class="flex-column-center mgt20 ft18 " style="padding-top:20px">
                <div class="link_c flex-center w100 mgb10">        
                  <div class="flex1 flex-center white-nowrap ft18">
                    <span class="mgr20 ft18">
                      关于我们
                    </span>
                    【
                    <nuxt-link  class="ft18" :to="{name: 'company-introduction', query: { activeIndex: 8}}">
                      公司简介
                    </nuxt-link>            
                    <div class="dot"></div>
                    <nuxt-link class="ft18" :to="{name: 'company-course',  query: { activeIndex: 8}}">
                      发展历程
                    </nuxt-link>
                    】
                  </div>
                </div>
                <div class="link_c flex-center w100 mgb10 ft18">     
                  <div class="flex1 flex-center white-nowrap ft18">
                    <span class="mgr20 ft18">
                      新闻资讯
                    </span> 
                    【
                    <nuxt-link class="ft18" :to="{name: 'news', query: {type: 1, activeIndex: 8}}">
                      行业资讯
                    </nuxt-link>
                    <div class="dot"></div>
                    <nuxt-link  class="ft18" :to="{name: 'news', query: {type: 2, activeIndex: 8}}">
                      公司新闻
                    </nuxt-link>
                    】
                  </div>      
                </div>
              </div>
              <div class="link_c flex-center links" style="padding-top:20px" title="友情链接">
                <div v-for="link in links" :key="link.id" class="link-item">
                  <a :href="link.interfaceUrl" target="__blank">{{link.interfaceName}}</a>
                </div>
              </div>
              <div class="inner gray ta pdt10">
                <h3 class="copyright ftw">
                  <p class="ft14 mgb10">COPYRIGHT@ 2017 维码物联ALL RIGHT RESERVED</p> 
                  <p class="ft14 mgb10">备案号：粤ICP备16047819号-3 技术支持</p>
                  <nuxt-link  class="ft14" title="http://m.nbdlc.com" :to="{name: 'index', query: {activeIndex: 8}}">
                    深圳迪尔西科技
                  </nuxt-link>
                </h3>  
              </div>
            
            </div>
          </div>
        </slide>
        <!-- loading图 -->
        <div class="spinner-mask flex-center flex1" v-show='!isAllReady'>
          <atom-spinner />
        </div>
      </div>
  </div>
</template>

<script>
import AppFooter from '@/components/AppFooter'
import countTo from '@/components/vue-count-to'
import throttle  from 'lodash/throttle'
import Slide from '@/components/vertical-slide.vue'
import { parseTime  } from '@/utils'
import AtomSpinner from '@/components/Loading'
import Plyr from 'plyr'
import xSlide from '@/components/slide.vue'
import bus from '@/utils/bus'
import canvasStar from '@/components/canvasStar.vue'
import canvasSnow from '@/components/canvasSnow.vue'
import canvasRain from '@/components/canvasRain.vue'
// import { Observable } from 'rxjs/Rx'
export default {
  components: {
    AppFooter,
    countTo,
    Slide,
    xSlide,
    AtomSpinner,
    canvasStar,
    canvasSnow,
    canvasRain
  },
  head () {
    return {
      title: '移动互联网APP开发_智慧社区APP开发_物联网软硬件方案解决_深圳迪尔西科技',
      meta: [
        { hid: 'description', name: 'description', content: '深圳迪尔西科技专注于智能软硬件开发,APP软件小程序开发,共享经济资源开发等,客户满意度100%,300名工程师团队,7年开发经验,720行业见证！' }
      ]
    }
  },
  async asyncData ({route, $axios, query, error}) {
    // 底部资讯和新闻轮播
    // 1、资讯列表
    let infos = $axios.get('/houseofhello/getMessageList', {
      params: {
        type: 1,
        offset: 1,
        limit: 2
      }
    })
    // 2、新闻列表
    let news = $axios.get('/houseofhello/getMessageList', {
      params: {
        type: 2,
        offset: 1,
        limit: 2
      }
    })
    // 合并请求
    try {
      const res = await Promise.all([infos, news])
      let [infosRes, newsRes] = res
      infosRes = infosRes.data.data.records.filter(item => item).map(item =>{
        return {
          ...item,
          label: '行业资讯',
          ctime: parseTime(item.ctime)
        }
      })
      newsRes = newsRes.data.data.records.filter(item => item).map(item =>{
        return {
          ...item,
          label: '公司新闻',
          ctime: parseTime(item.ctime)
        }
      })
      let records =  infosRes.concat(newsRes)
      return {
        list: records
      }
    } catch (err) {
      error(err)
    }
  },
  data () {
    return {
      activeIndex: -1,
      imgWidth: 0,
      imgsWidth: 0,
      hotList: [
        [
          {
            title: '共享无人售货机',
            subTitle: '共享无人售货机APP开发',
            name:'detail',
            query: {
              messageId: 'MES090152220622650',
              type: 3
            },
            backgroundImage: '/explosion_01.png'
          },
          {
            title: '共享垃圾回收站',
            subTitle: '共享垃圾回收站智能垃圾桶APP开发',
            name:'detail',
            query: {
              messageId: 'MES495388058101856',
              type: 3
            },
            backgroundImage: '/explosion_02.png'
          }
        ],
        [
          {
            title: '共享新风机',
            subTitle: '共享新风机APP开发',
            name:'detail',
            query: {
              messageId: 'MES799944173661821',
              type: 3
            },
            backgroundImage: '/explosion_03.png'
          },
          {
            title: '共享陪护床',
            subTitle: '共享陪护床APP开发',
            name:'detail',
            query: {
              messageId: 'MES386870363399198',
              type: 3
            },
            backgroundImage: '/explosion_04.png'
          },
        ],
        [
          {
            title: '共享充电桩',
            subTitle: '共享充电桩APP开发',
            name:'detail',
            query: {
              messageId: 'MES035113545506037',
              type: 3
            },
            backgroundImage: '/explosion_05.png'
          },
          {
            title: '共享纸巾机',
            subTitle: '共享纸巾机APP开发',
            name:'detail',
            query: {
              messageId: 'MES745448866713255',
              type: 3
            },
            backgroundImage: '/explosion_06.png'
          },
        ],
        // [
        //   {
        //     title: '共享充电宝',
        //     subTitle: '共享充电宝APP开发',
        //     name:'detail',
        //     query: {
        //       messageId: 'MES568782041752397',
        //       type: 3
        //     },
        //     backgroundImage: '/explosion_07.png'
        //   }
        // ]
      ],
      solutionList: [
        [
          {
            title: '共享健身房',
            subTitle: '软硬件一体化解决方案',
            name:'detail',
            query: {
              messageId: 'MES011548967172043',
              type: 3
            },
            backgroundImage: '/tab_01.png'
          },
          {
            title: '共享车位锁',
            subTitle: '软硬件一体化解决方案',
            name:'detail',
            query: {
              messageId: 'MES213601564548305',
              type: 3
            },
            backgroundImage: '/tab_02.png'
          },
        ],
        [
          {
            title: '车载按摩',
            subTitle: '软硬件一体化解决方案',
            query: {
              messageId: 'MES308154939719176',
              type: 3
            },
            backgroundImage: '/tab_03.png'
          },
          {
            title: '共享按摩椅',
            subTitle: '软硬件一体化解决方案',
            name:'detail',
            query: {
              messageId: 'MES308154939719176',
              type: 3
            },
            backgroundImage: '/tab_04.png'
          },
        ],
        // {
        //   title: '共享碾米机',
        //   subTitle: '软硬件一体化解决方案',
        //   name:'detail',
        //   query: {
        //     messageId: 'MES865830616717748',
        //     type: 3
        //   },
        //   backgroundImage: '/tab_05.png'
        // },
      ],
      list: null,
      playerReady: false,
      playerReady1: false,
      comList: [
        {
          companyName: '深圳迪尔西',
          companyConcat: '18898766577',
          companyAddress: '广东省深圳市南山区深圳湾科技生态园9栋A2 17楼' 
        },
        {
          companyName: '东莞迪尔西',
          companyConcat: '13762643897',
          companyAddress: '东莞南城区周溪隆溪路5号高盛科技园南区科技港' 
        },
        {
          companyName: '陕西迪尔西',
          companyConcat: '18700489194',
          companyAddress: '陕西省西安市高新技术开发区科技二路65号 清华科技园A座c301' 
        }
      ]
    }
  },
  methods: {
    onFourthEnd (index) {
      const wrapper = this.$refs.xslide.$el.querySelector('.slide-group')
      const nodes = Array.from(wrapper.children)
      nodes.forEach(node => {
        const cur = node.dataset.index
        if (cur == index) {
          node.classList.add('is--active')
        } else {
          node.classList.remove('is--active')
        }
      })
    },
    onFifthEnd(index) {
      const wrapper = this.$refs.xslide1.$el.querySelector('.slide-group')
      const nodes = Array.from(wrapper.children)
      nodes.forEach(node => {
        const cur = node.dataset.index
        if (cur == index) {
          node.classList.add('is--active')
        } else {
          node.classList.remove('is--active')
        }
      })
    },
    //  竖屏full-page 滑动结束回调
    finish (activeIndex) {
      this.activeIndex = activeIndex
    },
    // 显示video
    showVideo () {
      this.$refs.plyr.player.on('ready', () => {
        this.playerReady = true
      })
      this.$refs.plyr1.player.on('ready', () => {
        this.playerReady1 = true
      })
    },
    addAnimate (e) {
      e.target.classList.add('animate2')
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.showVideo()
      bus.$on('gotoPage', () => {
        if (this.isAllReady) {
          this.$refs.slide.slide.goToPage(0, 0)   
        }
      })
      // 首页fullpage 插件 调往其他页面后跳回
      let activeIndex = window.sessionStorage.getItem('activeIndex')
      if (activeIndex) {
        window.sessionStorage.removeItem('activeIndex')
        activeIndex = Number(activeIndex)
        setTimeout(() => {
          this.$refs.slide.slide.goToPage(0, activeIndex)
        }, 60);  
      }
      this.$refs.corper.addEventListener('webkitAnimationEnd',  this.addAnimate, false)
    })
  },
  computed: {
    isAllReady () {
      return this.playerReady && this.playerReady1
    },
    links () {
      return this.$store.state.list
    },
  },
  beforeDestroy () {
    bus.$off('gotoPage')
    this.$refs.corper.removeEventListener('webkitAnimationEnd', this.addAnimate)
  },
  watch: {
    isAllReady (nv, ov) {
      this.$nextTick(() => {
        this.activeIndex = 0   
        this.$refs.slide.refresh()
        this.$refs.xslide.refresh()
        this.$refs.xslide1.refresh()
        this.$refs.xslide2.refresh()
        this.$refs.footer.refresh()
      })
    },
    activeIndex (nv) {
      const doc = document.documentElement
      const { corper } = this.$refs
      if (nv == 8) {
        doc.classList.add('show_ga')
      } else {
        doc.classList.remove('show_ga')
      }
      if (nv != 5 ) {
        const nodes = Array.from(corper.children)
        nodes.forEach(node => {
          node.classList.remove('animate2')
        })  
      } 
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~assets/style/color.styl'
@import '~assets/style/animation.styl'
.qrcode-img
  width 160px
  height 160px
/deep/ .plyr--video
  height 100% !important
.img-wrapper
  display flex
  flex-direction column
  &.is--active
    .expo_c
      &:nth-child(1)
        animation bounceInRight 1s  forwards
      &:nth-child(2)
        animation bounceInLeft 1s  forwards
  .expo_c
    display flex
    &:nth-child(1)
      transform translateX(100%)
    &:nth-child(2)
      transform translateX(-100%)
  .aaaa
    width 265px
    &:nth-child(2n)
      margin-left -10px
  &.ftc
    color #000
  .text-wraper
    width 130px
    background-size 100% 100%
    flex-shrink: 0;
    z-index 11
    display flex
    align-items center
    justify-content center
    &:nth-child(2n)
      margin-left -10px
.letter-space
  letter-spacing: 1.2px
.fullpage-item:nth-child(1),
.fullpage-item:nth-child(2)
  color #000
  background-color #9f9fa1
  .subtitle
    color #000
    flex-grow 0
  .desc
    color #000
    flex 1
  display flex
  flex-direction column
  justify-content flex-start
.fullpage-item:nth-child(7),
.fullpage-item:nth-child(3)
  background-image url('/domind.png')
  background-size cover
  background-repeat repeat-y
.count_c
  min-height 60px
  background-color rgba(25, 25, 25, .6)
.mask
    font-size 14px
    padding: 10px
    box-sizing border-box
    width 100%
    height 100%
    display flex
    flex-direction column
    background-color rgba(25, 25, 25, .6)
    // transform translateY(100%)
    transition transform 0.35s
.expo_c
  background-size 100% 100%
  cursor pointer
  color #fff
  overflow hidden
  transition all 0.35s
  .mask-title
    position relative
  .after
    width 40px
    margin 8px 0
    height 2px
    background-color $main
.slider_item
  height 100%
  display flex
  flex-direction column
  justify-content: space-between
.slider_tag
  background-color $main
  display inline-block
  padding 2px 12px
  border-radius 50px
  font-size 14px
.corper_c
  width 300px
  flex-wrap wrap
.company_icon
  width 140px
  height 60px
  margin-bottom 20px
  display flex
  justify-content center
  align-items center
  transition all 0.35s
  background-size contain
  &:hover
    animation bounceIn 0.35s
  &.mgr100
    margin-right 20px
  for n in 1 2 3 4 5 6 7 8
    &:nth-child({n})
      if n % 2 != 0
        transform translateX(-200px)
      else
        transform translateX(200px)
      background-image url('~assets/com/com_0' + n + '.png')
  for n in 1 2 3 4 5 6 7 8
    &:nth-child({n})
      &.animate2
        background-image url('~assets/com/com_active_0' + n + '.png')
.count_item--icon
  position absolute
  top: 0px
  right: -10px
  width 10px
  height 10px
  background-image url('~assets/img/icon_count.png')
  background-size contain
.count_item--c
  color $main
  font-size 24px
.w100
  width 100%
.xslide_c
  height 460px 
  width 100%
  &.big
    height 7rem
.expo_c
  background-size 100% 100%
.tree_c
  position relative
  height 300px
  display flex
  justify-content center
  align-items center
  z-index 111
  margin 100px 0 0px
  &:hover
    transform translateZ(40px)
.middle_line
  width 2px
  height 380px
  position relative
  &:after
    content: ''
    display block
    position absolute
    width 100%
    height 100%
    background-color #fff
    transform translateY(-700px)
  .circle 
    width 10px
    height 10px
    border-radius 50%
    background-color #fff
    position relative
    transform translateX(0px)
    .line_c
      width 30px
      height 2px
      position absolute
      transform-origin left
      &.f,
      &.t
        left: 2px;
        top: 1px;
        transform rotateZ(30deg) translateX(-100%)
        background-image url('~assets/img/branch_bg.png')
      &.s,
      &.h
        left: 10px;
        top: 1px;
        transform rotateZ(150deg) translateX(-100%)
        background-image url('~assets/img/branch_bg.png')
    .radius_c
      position absolute
      top: -48px
      width 50px
      height 50px
      border-radius 50%
      background-color #fff
      transition all 1s
      transform-origin center
      background-size 80% 80%
      background-position center
      transform rotateY(90deg)
      &.f
        left: -74px
        background-image url('~assets/img/tree_f--active.png')     
      &.t
        left: -64px
        background-image url('~assets/img/tree_t--active.png')
      &.s
        left: 34px
        background-image url('~assets/img/tree_s--active.png')
      &.h
        left: 34px
        background-image url('~assets/img/tree_h--active.png')
    .txt_c
      font-size 10px
      color #fff
      position absolute
      text-align right
      white-space nowrap
      width 120px
      .fx1
        width 100%
        height 44px
        position relative
        div
          position absolute
          top 0px
          left 0px
          width 100%
          transition all 0.35s
        .txt_mask
          font-size 12px
          transform translateY(100%)
      &.f,
      &.t
        top: -54px
        left -200px
      &.s,
      &.h
          text-align left
          top: -54px
          left 100px
      &.f
        transform translateY(-390px)
      &.t
        transform translateY(-390px)
      &.s
        transform translateY(-390px)
      &.h
        transform translateY(-500px)
.hide
  z-index -1 !important
  height 100%
video::-webkit-media-controls-enclosure
  display: none !important;
.desc
  white-space normal
  font-size 16px
  text-align left
  text-indent 2em
  line-height 1.8
  color #fff   
  transform rotateY(90deg)
.item_title
  font-size 16px
  padding-bottom 12px
  position relative
  margin 12px
  transform rotateY(90deg)
  transform-style preserve-3d
  &.ftc
    color #fff
  &:after
    content ""
    display block
    position absolute
    left 50%
    bottom 0
    width 52px
    height 2px
    background-color $main
    transform translateX(-50%)
.subtitle
  color #fff   
  strong
    display inline-block
    &:nth-child(1)
      transform translateX(-340px)
    &:nth-child(2)
      transform translateY(-600px)
    &:nth-child(3)
      transform translateX(350px)
.spinner-mask
  width 100%
  height 100%
  background-color rgba(25, 25, 25, 0.6)
.skeleton
  background-color rgba(25, 25, 25, 0.5)
  width 100%
  height 100%
.video_c
  width 375px
  height 190px
  transform translateY(-300%)
.mgb100
  margin-bottom 100px
._c
  width 100%
  height 100%
.full-page-slide-wrapper
  position: absolute
  z-index: 1
  top: 0
  left: 0
  width: 100%
  height: 100%
  background: #efeff4
  overflow: hidden
.slide
  height: 100%
.slide-group
  height: 100%
.slide-item
  height: 100%
  width: 100%
  overflow hidden
  // background-color rgba(25, 25, 25, 0.5)
  &.active
    .video_c
      animation bounceInDown 0.8s forwards
    .subtitle
      strong
        display inline-block
        &:nth-child(1)
          animation bounceInLeft 1s 0.35s forwards
        &:nth-child(2)
          animation bounceInDown 1s 0.5s forwards
        &:nth-child(3)
          animation bounceInRight 1s 1s forwards
    .desc
      animation flipInX 1s 1.2s forwards
    .item_title
      animation flipInY .6s forwards
    .radius_c
      &.f
        animation flipInY .5s forwards
      &.s
        animation flipInY .5s .2s forwards
      &.t
        animation flipInY .5s .4s forwards
      &.h
        animation flipInY .5s .6s forwards
    .txt_c
      &.f
        animation bounceInDown .5s 1.1s forwards
      &.s
        animation bounceInDown .5s 1.2s forwards
      &.t
        animation bounceInDown .5s 1.4s forwards
      &.h
        animation bounceInDown .5s 1.6s forwards
    .company_icon
      for n in 1 2 3 4 5 6 7 8
        &:nth-child({n})
          if n % 2 != 0
            animation bounceInLeft .5s .1s * n forwards
          else 
            animation lightSpeedIn .5s .1s * n forwards
    .circle
      for n in 1 2 3 4 
        &:nth-child({n})
          animation fadeIn .5s .1s * n forwards
    .middle_line
      &:after
        animation bounceInDown .5s 2.1s forwards
.full-page-img-wrapper
  position: relative
  height: 100%
  background-size: cover
  transform: translateZ(0)
  .button-wrapper
    position: fixed
    bottom: 85px
    display: block
    width: 100%
    overflow: hidden
    .button
      display: inline-block
      width: 130px
      padding: 15px 0
      border: 4px solid rgba(255, 255, 255, 0.7)
      border-radius: 4px
      color: rgba(255, 255, 255, 0.7)
      font-size: 18px

.graybg
  background-color: rgba(25,25,25,0.5);
.w100
  width 100%
.slide
  height: 100%
.carousel_item
  // background-image: url('/carousel_1.png')
  background-color rgba(25, 25, 25, .5)
  color #fff
.xslide-wrapper
  width 350px
  height 200px
  overflow hidden
  text-align left
a
  color #fff
/deep/
  .nuxt-link-active
    color inherit
    text-decoration none
    color #fff !important
.main
  display flex
  flex-direction column
  align-items: center
.copyright
  font-size 12px
.link_c
  color #fff
  font-size 12px
  .dot
    margin 0 10px
.base_line
  padding-bottom 10px
  border-bottom 1px solid #414040
  background-position bottom center
.com_info
  color #fff
  font-size 14px
  display flex
  align-items center
.dot
  margin 0 50px
  position relative
  width 2px
  height 2px
  border-radius 50%
  background-color #fff
.com_introduction
  background-color #000
.com_name
  color #1eb4a9
  position relative
  display flex
  align-items center
  font-weight 900
  .logo
    width 30px
    height 30px
  &:after
    font-size 12px
    position absolute
    left 240px
    bottom 6px
    display block
    font-weight normal
    content: '迪尔西(深圳)子公司'
    color #fff
</style>

