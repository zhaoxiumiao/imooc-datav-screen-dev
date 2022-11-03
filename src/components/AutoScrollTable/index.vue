<template>
  <div class="dv-scroll-board" ref="ref">
    <div
      class="header"
      v-if="header.length && mergedConfig"
      :style="`background-color: ${mergedConfig.headerBGC};`"
    >
      <div
        class="header-item"
        v-for="(headerItem, i) in header"
        :key="headerItem + i"
        :style="`
          height: ${mergedConfig.headerHeight}px;
          line-height: ${mergedConfig.headerHeight}px;
          width: ${widths[i]}px;
          font-size: ${mergedConfig.headerFontSize}px;
        `"
        :align="aligns[i]"
        v-html="headerItem"
      />
    </div>

    <div
      v-if="mergedConfig"
      class="rows"
      :style="{
        height: `${
          autoResizeData.height -
          (header.length ? mergedConfig.headerHeight : 0) -
          mergedConfig.columnMarginTop
        }px`,
        marginTop: `${mergedConfig.columnMarginTop}px`,
        marginRight: `${mergedConfig.columnMarginRight}px`
      }"
    >
      <div
        class="row-item"
        v-for="(row, ri) in rows"
        :key="row.toString() + row.scroll"
        :style="`
          height: ${heights[ri]}px;
          line-height: ${heights[ri]}px;
          background-color: ${mergedConfig[row.rowIndex % 2 === 0 ? 'evenRowBGC' : 'oddRowBGC']};
          fontSize: ${mergedConfig.columnFontSize}px;
        `"
      >
        <div
          class="ceil"
          v-for="(ceil, ci) in row.ceils"
          :key="ceil + ri + ci"
          :style="{
            width: `${widths[ci]}px`,
            ...mergedConfig.columnStyle[ci]
          }"
          :align="aligns[ci]"
          v-html="ceil"
          @click="emitEvent(ri, ci, row, ceil)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="AutoScrollTable">
  import autoResize from '../Container/autoResize'
  import { deepMerge } from '@jiaminghi/charts/lib/util/index'
  import { deepClone } from '@jiaminghi/c-render/lib/plugin/util'
  import { reactive, defineProps, watch, onUnmounted, toRefs } from 'vue'
  const props = defineProps({
    config: {
      type: Object,
      default: () => ({})
    }
  })
  const data = reactive({
    ref: 'scroll-board',
    defaultConfig: {
      /**
       * @description Board header
       * @type {Array<String>}
       * @default header = []
       * @example header = ['column1', 'column2', 'column3']
       */
      header: [],
      /**
       * @description Board data
       * @type {Array<Array>}
       * @default data = []
       */
      data: [],
      /**
       * @description Row num
       * @type {Number}
       * @default rowNum = 5
       */
      rowNum: 5,
      /**
       * @description Header background color
       * @type {String}
       * @default headerBGC = '#00BAFF'
       */
      headerBGC: '#00BAFF',
      headerFontSize: 15, // 表头文字大小
      columnFontSize: 14, // 列文字大小
      columnMarginTop: 0, // 表格与表头间距
      columnMarginRight: 0, // 表格与右侧间距
      /**
       * @description Odd row background color
       * @type {String}
       * @default oddRowBGC = '#003B51'
       */
      oddRowBGC: '#003B51',
      /**
       * @description Even row background color
       * @type {String}
       * @default evenRowBGC = '#003B51'
       */
      evenRowBGC: '#0A2732',
      /**
       * @description Scroll wait time
       * @type {Number}
       * @default waitTime = 2000
       */
      waitTime: 2000,
      /**
       * @description Header height
       * @type {Number}
       * @default headerHeight = 35
       */
      headerHeight: 35,
      /**
       * @description Column width
       * @type {Array<Number>}
       * @default columnWidth = []
       */
      columnWidth: [],
      columnIndex: [],
      columnStyle: [],
      /**
       * @description Column align
       * @type {Array<String>}
       * @default align = []
       * @example align = ['left', 'center', 'right']
       */
      align: [],
      /**
       * @description Show index
       * @type {Boolean}
       * @default index = false
       */
      index: false,
      /**
       * @description index Header
       * @type {String}
       * @default indexHeader = '#'
       */
      indexHeader: '#',
      /**
       * @description Carousel type
       * @type {String}
       * @default carousel = 'single'
       * @example carousel = 'single' | 'page'
       */
      carousel: 'single',
      autoPlay: true
    },
    mergedConfig: null,
    header: [],
    rowsData: [],
    rows: [],
    widths: [],
    heights: [],
    avgHeight: 0,
    aligns: [],
    animationIndex: 0,
    animationHandler: '',
    updater: 0
  })
  const { ref, mergedConfig, header, rows, widths, heights, aligns }: any = toRefs(data)
  const autoResizeData = autoResize(afterAutoResizeMixinInit, ref, onResize)
  watch(
    () => props.config,
    () => {
      stopAnimation()
      calcData()
    }
  )
  function afterAutoResizeMixinInit() {
    calcData()
  }
  function onResize() {
    if (!data.mergedConfig) return
    calcWidths()
    calcHeights()
  }
  function calcData() {
    mergeConfig()
    calcHeaderData()
    calcRowsData()
    calcWidths()
    calcHeights()
    calcAligns()
    if ((data as any).mergedConfig.autoPlay) {
      animation(true)
    }
  }
  function mergeConfig() {
    data.mergedConfig = deepMerge(deepClone(data.defaultConfig, true), props.config || {})
  }
  function calcHeaderData() {
    let { header, index, indexHeader }: any = data.mergedConfig
    if (!header.length) {
      data.header = []
      return
    }
    header = [...header]
    if (index) header.unshift(indexHeader)
    data.header = header
  }
  function calcRowsData() {
    let { data: datas, index, headerBGC, rowNum, columnIndex }: any = data.mergedConfig
    if (index) {
      datas = datas.map((row: any, i: any) => {
        row = [...row]
        let indexTag = `<span class="index" style="background-color: ${headerBGC};">${i + 1}</span>`
        if (columnIndex && columnIndex[i]) {
          indexTag = columnIndex[i]
        }
        row.unshift(indexTag)
        return row
      })
    }
    datas = datas.map((ceils: any, i: any) => ({ ceils, rowIndex: i }))
    const rowLength = datas.length
    if (rowLength > rowNum && rowLength < 2 * rowNum) {
      datas = [...datas, ...datas]
    }
    datas = datas.map((d: any, i: any) => ({ ...d, scroll: i }))
    data.rowsData = datas
    data.rows = datas
  }
  function calcWidths() {
    const { columnWidth, header }: any = data.mergedConfig
    const usedWidth = columnWidth.reduce((all: any, w: any) => all + w, 0)
    let columnNum = 0
    if (data.rowsData[0]) {
      columnNum = (data.rowsData[0] as any).ceils.length
    } else if (header.length) {
      columnNum = header.length
    }
    const avgWidth = (autoResizeData.width - usedWidth) / (columnNum - columnWidth.length)
    const widths = new Array(columnNum).fill(avgWidth)
    data.widths = deepMerge(widths, columnWidth)
  }
  function calcHeights(onresize = false) {
    const { headerHeight, rowNum, data: datas, columnMarginTop }: any = data.mergedConfig
    let allHeight = autoResizeData.height
    if (data.header.length) allHeight -= headerHeight
    allHeight -= columnMarginTop
    const avgHeight = allHeight / rowNum
    data.avgHeight = avgHeight
    if (!onresize) (data as any).heights = new Array(datas.length).fill(avgHeight)
  }
  function calcAligns() {
    const columnNum = data.header.length
    const aligns = new Array(columnNum).fill('left')
    const { align }: any = data.mergedConfig
    data.aligns = deepMerge(aligns, align)
  }
  async function animation(start = false) {
    let { avgHeight, animationIndex, mergedConfig, rowsData, updater } = data
    const { waitTime, carousel, rowNum }: any = mergedConfig
    const rowLength = rowsData.length
    if (rowNum >= rowLength) return
    if (start) {
      await new Promise((resolve) => setTimeout(resolve, waitTime))
      if (updater !== data.updater) return
    }
    const animationNum = carousel === 'single' ? 1 : rowNum
    const rows = rowsData.slice(animationIndex)
    rows.push(...rowsData.slice(0, animationIndex))
    data.rows = rows
    ;(data as any).heights = new Array(rowLength).fill(avgHeight)
    await new Promise((resolve) => setTimeout(resolve, 300))
    if (updater !== data.updater) return
    data.heights.splice(0, animationNum)
    // , ...new Array(animationNum).fill(0)
    animationIndex += animationNum
    const back = animationIndex - rowLength
    if (back >= 0) animationIndex = back
    data.animationIndex = animationIndex
    ;(data as any).animationHandler = setTimeout(animation, waitTime - 300)
  }
  function stopAnimation() {
    const { animationHandler, updater } = data
    data.updater = (updater + 1) % 999999
    if (!animationHandler) return
    clearTimeout(animationHandler)
  }
  function emitEvent(ri: any, ci: any, row: any, ceil: any) {
    const { ceils, rowIndex } = row
    // this.$emit('click', {
    //   row: ceils,
    //   ceil,
    //   rowIndex,
    //   columnIndex: ci
    // })
  }
  onUnmounted(() => {
    // const { stopAnimation } = this
    stopAnimation()
  })
</script>

<style lang="scss">
  .dv-scroll-board {
    position: relative;
    width: 100%;
    height: 100%;
    color: #fff;

    .text {
      padding: 0 10px;
      box-sizing: border-box;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .header {
      display: flex;
      flex-direction: row;
      font-size: 15px;

      .header-item {
        // .text;
        padding: 0 10px;
        box-sizing: border-box;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: all 0.3s;
      }
    }

    .rows {
      overflow: hidden;

      .row-item {
        display: flex;
        font-size: 24px;
        transition: all 0.3s;
      }

      .ceil {
        // .text;
        padding: 0 10px;
        box-sizing: border-box;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .index {
        border-radius: 3px;
        padding: 0 3px;
      }
    }
  }
</style>
