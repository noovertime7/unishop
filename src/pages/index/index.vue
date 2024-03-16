<template>
  <CustomNavbar />
  <view id="top"></view>
  <scroll-view
    scroll-y
    class="scroll-view"
    :scroll-into-view="topItem"
    refresher-enabled
    @scroll="handleScroll"
    @scrolltolower="scrolltolower"
    @refresherrefresh="onRefresherrefresh"
    :refresher-triggered="isTriggered"
  >
    <view id="top"></view>

    <Skeleton v-if="loading" />
    <template v-else>
      <XtxSwiper :list="HomeBannerData" />
      <CategoryPanel :list="CategoryData" />
      <HotPanel :list="HotData" />
      <XtxGuess ref="guessRef" />
    </template>
  </scroll-view>

  <view class="back-top" v-show="isShow" @click="handleBackTop">
    <uni-icons type="arrow-up" size="30"></uni-icons>
  </view>
</template>

<script setup lang="ts">
import CategoryPanel from './components/CategoryPanel.vue'
import CustomNavbar from '@/pages/index/components/CustomNavbar.vue'
import Skeleton from '@/pages/index/components/Skeleton.vue'
import HotPanel from './components/HotPanel.vue'
import { getHomeBannerAPI, getHomeCategoryAPI, getHomeHotAPI } from '@/services/home'
import type { BannerItem, CategoryItem, HotItem } from '@/types/home'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

const HomeBannerData = ref<BannerItem[]>([])
const CategoryData = ref<CategoryItem[]>([])
const HotData = ref<HotItem[]>([])

const loading = ref(true)

const getHomeBanner = async () => {
  const res = await getHomeBannerAPI()
  HomeBannerData.value = res.result
}

const getCategory = async () => {
  const res = await getHomeCategoryAPI()
  CategoryData.value = res.result
}

const getHotPanel = async () => {
  const res = await getHomeHotAPI()
  HotData.value = res.result
}

const scrolltolower = async () => {
  guessRef.value?.getMore() // 加载数据
}

const isShow = ref(false)
const topItem = ref('top')
const handleBackTop = () => {
  topItem.value = 'top'
}

const handleScroll: UniHelper.ScrollViewOnScroll = (e) => {
  let { scrollTop } = e.detail
  isShow.value = scrollTop > 1000
  topItem.value = ''
}

// 下拉刷新状态
const isTriggered = ref(false)
const guessRef = ref()
// 自定义下拉刷新被触发
const onRefresherrefresh = async () => {
  isTriggered.value = true
  guessRef.value?.resetData() // 加载数据
  await Promise.all([getHomeBanner(), getCategory(), getHotPanel()])
  isTriggered.value = false
}

onLoad(() => {
  getHomeBanner()
  getCategory()
  getHotPanel()

  loading.value = false
})
</script>

<style lang="scss">
page {
  background-color: #f7f7f7;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.scroll-view {
  flex: 1;
}
.back-top {
  height: 50px; /* 设置元素的高度 */
  width: 50px; /* 设置元素的宽度 */
  background-color: #f7f7f7; /* 设置元素的背景颜色 */
  border-radius: 50%; /* 将元素的边框设置为圆形 */
  position: fixed; /* 将元素固定在页面上 */
  bottom: 20px; /* 距离页面底部的距离 */
  right: 20px; /* 距离页面右侧的距离 */
  text-align: center; /* 文字居中 */
  line-height: 50px; /* 行高与元素高度相同，以垂直居中文本 */
  cursor: pointer; /* 鼠标悬停时显示指示光标 */
  transition: all 0.3s ease; /* 添加过渡效果 */
}
.back-top:hover {
  background-color: #ccc; /* 悬停时的背景颜色 */
}
</style>
