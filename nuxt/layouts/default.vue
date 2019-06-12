<template>
  <v-app >
    <v-navigation-drawer 
      :clipped="$vuetify.breakpoint.lgAndUp"
      v-model="drawer"
      app
      fixed
      dark
    >
      
      <v-list dense >
        <template v-for="item in items">
          <v-list-group
            v-model="item.model"
            :key="item.text"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon=""
          >
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title  class="ft18">
                  <template v-if="item.name">
                    <nuxt-link  replace="" :to="{name: item.name}">
                      {{ item.text }}
                    </nuxt-link>  
                  </template>
                  <template v-else>
                    {{ item.text }}
                  </template>      
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              v-for="(child, i) in item.children"
              :key="i"
              class="ft16"
            >
              <v-list-tile-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content  class="ft16">
                <template v-if="child.name">
                  <nuxt-link  replace="" :to="{name: child.name, query: {type: child.type, typeName: child.typeName}}">
                    {{ child.text }}
                  </nuxt-link>  
                </template>
                <template v-else>
                  {{ child.text }}
                </template>     
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      color="dark "
      dark
      app
      fixed
      style="justify-content:space-between"
    >
      <v-toolbar-title  class="ml-0">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>   
      </v-toolbar-title>
      <h1 class="logo">
        <nuxt-link replace :to="{name: 'index'}">
          <img src="/logo.png" class="logo_img"  alt="logo" title='dlc logo'>
        </nuxt-link>
      </h1>
      <v-icon>search</v-icon>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center align-center>
          <nuxt />
        </v-layout>
      </v-container>
    </v-content>
    <backTop></backTop>
  </v-app>
</template>

<script>
import backTop from '@/components/BackToTop'
export default {
  data() {
    return { 
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: '首页',
          name: 'index',
          model: true,
        },
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: '技术服务',
          name: 'index',
          model: false,
          children: [
            { text: '智能硬件' },
            { text: '机器云' },
            { text: 'APP应用' }
          ]
        },
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: '解决方案',
          model: false,
          children: [
            { 
              text: '爆款',
              name: 'solution',
              type: 3,
              typeName: 1
             },
            { 
              text: '新零售',
              name: 'solution',
              type: 3,
              typeName: 2
             },
            { 
              text: '共享经济',
              name: 'solution',
              type: 3,
              typeName: 3
            },
            { 
              text: '物联网',
              name: 'solution',
              type: 3,
              typeName: 4
            },
            { 
              text: 'App应用',
              name: 'solution',
              type: 3,
              typeName: 5
            },
            { 
              text: '智慧社区管理',
              name: 'solution',
              type: 3,
              typeName: 6
            }
          ]
        },
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: '新闻资讯',
          model: false,
          children: [
            { 
              text: '行业资讯',
              name: 'news',
              type: 1
            },
            { 
              text: '公司新闻',
              name: 'news',
              type: 2
            }
          ]
        },
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: '合作伙伴',
          model: false,
        },
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: '迪尔西生态',
          model: false,
          children: [
            { 
              text: '业务模式'
            },
            { 
              text: '关于我们',
              name: 'company-introduction'
            },
            { 
              text: '公司文化'
            }
          ]
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js',
      activeIndex: 0
    }
  },
  components: {
    backTop
  },
  watch: {
    $route (to, from) {
      const {activeIndex} = to.query
      if (activeIndex) {
        window.sessionStorage.setItem('activeIndex', activeIndex)
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.logo_img
  width 50px
  height 20px
  color #ffffff
  background-color inherit
</style>


