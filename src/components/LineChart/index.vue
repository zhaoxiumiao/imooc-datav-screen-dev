<template>
  <div class="line-chart">
    <div class="title-wrapper">
      <div class="title">慕课外卖骑手概况</div>
      <div class="sub-title">Rider Growth rate</div>
    </div>
    <div id="average-age-chart2" />
  </div>
</template>

<script lang="ts" setup name="lineChart">
  import * as Echarts from 'echarts'
  import { watch, onUnmounted, defineProps } from 'vue'

  const colors = ['rgb(209,248,139)', 'rgb(115,201,245)', 'rgb(124,136,146)']

  const props = defineProps({
    data: Object
  })
  let chart: any
  let task: any
  let currentChart = 0

  onUnmounted(() => task && clearInterval(task))
  const update = () => {
    function createOption() {
      const { axisX, orderData, rateData }: any = props.data
      const axisData = axisX
      let legendData = []
      let data1 = []
      let data2 = []
      if (currentChart === 0) {
        legendData = [orderData.legend1, orderData.legend2]
        data1 = orderData.data1
        data2 = orderData.data2
      } else {
        legendData = [rateData.legend1, rateData.legend2]
        data1 = rateData.data1
        data2 = rateData.data2
      }
      return {
        color: colors,
        tooltip: {
          trigger: 'none',
          // 座标轴指示器
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          top: 20,
          right: 40,
          icon: 'rect',
          textStyle: {
            fontSize: 16,
            color: colors[2]
          },
          data: legendData
        },
        grid: {
          top: 60,
          bottom: 30,
          left: 80,
          right: 40
        },
        xAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: colors[2]
              }
            },
            axisLabel: {
              fontSize: 16
            },
            data: axisData
          },
          {
            type: 'category',
            axisTick: { show: false },
            axisLine: { show: false }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: { show: false },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: colors[2]
              }
            },
            axisLabel: {
              fontSize: 16
            },
            splitLine: {
              lineStyle: {
                type: 'dotted'
              }
            }
          }
        ],
        series: [
          {
            name: legendData[0],
            type: 'line',
            xAxisIndex: 1,
            smooth: true,
            lineStyle: {
              width: 2
            },
            symbol: 'none',
            // data: [5, 100, 70, 120, 80, 15, 200, 300, 195, 150, 80, 103]
            data: data1
          },
          {
            name: legendData[1],
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 2
            },
            symbol: 'none',
            // data: [10, 50, 80, 4, 90, 50, 105, 160, 111, 54, 108, 50]
            data: data2
          }
        ]
      }
    }

    if (!chart) {
      chart = Echarts.init(document.getElementById('average-age-chart2') as HTMLElement)
    }
    chart.setOption(createOption())
    if (currentChart === 0) {
      currentChart = 1
    } else {
      currentChart = 0
    }
  }
  const stop = watch(
    () => props.data,
    () => {
      update()
      task = setInterval(() => {
        update()
      }, 5000)
      stop()
    }
  )
</script>

<style lang="scss" scoped>
  .line-chart {
    width: 100%;
    height: 100%;
    background: rgb(43, 44, 46);

    .title-wrapper {
      padding: 20px 40px 0;
      box-sizing: border-box;

      .title {
        font-size: 32px;
      }

      .sub-title {
        font-size: 16px;
        margin-top: 10px;
      }
    }

    #average-age-chart2 {
      width: 100%;
      height: 250px;
    }
  }
</style>
