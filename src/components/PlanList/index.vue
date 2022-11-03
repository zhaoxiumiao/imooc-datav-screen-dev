<template>
  <div class="plan-list">
    <div class="title">区域销售大盘环比分析</div>
    <div class="list">
      <auto-scroll-table
        :config="config"
        style="width: 100%; height: 820px; background: rgb(40, 40, 40)"
      />
    </div>
  </div>
</template>

<script setup lang="ts" name="planList">
  import { ref, watch, defineProps } from 'vue'
  import AutoScrollTable from '../AutoScrollTable/index.vue'

  const props: any = defineProps({
    data: Array
  })
  const config: any = ref(null)

  watch(
    () => props.data,
    () => {
      const data: any = []
      const align = []
      const columnIndex = []
      for (let i = 0; i < props.data.length; i++) {
        data[i] = []
        align[i] = 'center'
        if (i % 2 === 0) {
          columnIndex[
            i
          ] = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
            <div style="width:15px;height:15px;background:rgb(72,122,72);border-radius:50%;border:1px solid #fff;"/>
          </div>`
        } else {
          columnIndex[
            i
          ] = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
            <div style="width:15px;height:15px;background:rgb(38,88,104);border-radius:50%;border:1px solid #fff;"/>
          </div>`
        }
        for (let j = 0; j < 5; j++) {
          let text = ''
          switch (j) {
            case 0:
              text = props.data[i].order
              break
            case 1:
              text = props.data[i].shop
              break
            case 2:
              text = props.data[i].rider
              break
            case 3:
              text = props.data[i].newShop
              break
            case 4:
              text = props.data[i].avgOrder
              break
            default:
          }
          if (j === 1 || j === 3) {
            data[i].push(`<div style="color:rgb(178,209,126)">${text}</div>`)
          } else {
            data[i].push(`<div>${text}</div>`)
          }
        }
      }
      config.value = {
        header: ['城市订单量', '店铺数', '接单骑手人数', '新店铺数量', '人均订单量'], // 表头
        data, // 表格数据
        align, // 表格排序
        index: true, // 是否显示序号
        indexHeader: '', // 序号列表头文字
        rowNum: 12, // 显示行数
        headerBGC: 'rgb(90, 90, 90)', // 表头背景色
        oddRowBGC: 'rgb(40, 40, 40)', // 奇数背景色
        evenRowBGC: 'rgb(55, 55, 55)', // 偶数背景色
        headerHeight: 55, // 表头高度
        headerFontSize: 24, // 表头文字大小
        columnFontSize: 24, // 表格文字大小
        columnMarginTop: 20, // 表格与表头距离
        columnMarginRight: 20, // 表格与表头距离
        columnWidth: [80], // 序号列宽
        columnIndex, // 序号样式
        autoPlay: true, // 是否自动播放
        columnStyle: [{ background: 'rgb(40, 40, 40)' }] // 表格第一列样式
      }
    }
  )
</script>

<style lang="scss" scoped>
  .plan-list {
    width: 100%;
    height: 100%;
    background: rgb(55, 55, 55);
    padding: 20px 40px;
    box-sizing: border-box;

    .title {
      font-size: 36px;
      margin-left: 20px;
    }

    .list {
      width: 100%;
      height: 880px;
      margin-top: 20px;
      padding: 30px 0;
      box-sizing: border-box;
      background: rgb(40, 40, 40);
    }
  }
</style>
