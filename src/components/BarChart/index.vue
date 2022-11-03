<template>
  <div class="bar-chart">
    <div class="title-wrapper">
      <div class="left">
        <div class="title">当前热卖品类</div>
        <div class="sub-title">Hot Categories</div>
      </div>
      <div class="right">
        <div class="sub-title">最后更新时间：{{ date }} {{ time }}</div>
      </div>
    </div>
    <div id="average-age-chart3" />
  </div>
</template>

<script lang="ts" setup name="barChart">
  import * as Echarts from 'echarts'
  import { watch, defineProps } from 'vue'
  import { clock as useClock } from '../../utils/clock'
  const props = defineProps({
    data: Object
  })
  const { time, date } = useClock()
  let chart: any
  let currentChart = 0
  const update = () => {
    function createOption() {
      const sourceData: any = []
      const { data1, data2 }: any = props.data
      if (currentChart === 0) {
        data1.axisX.forEach((axis: any, index: number) => {
          sourceData.push([axis, data1.data1[index], data1.data2[index]])
        })
      } else {
        data2.axisX.forEach((axis: any, index: number) => {
          sourceData.push([axis, data2.data1[index], data2.data2[index]])
        })
      }
      const source = [['指标', '国内', '海外'], ...sourceData]
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        color: ['rgb(209,248,138)', 'rgba(65,65,65,.5)'],
        // color: ['red', 'green'],
        grid: {
          left: 30,
          right: 0,
          bottom: 30,
          top: 20
        },
        dataset: {
          source
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dotted'
            }
          },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: 'rgb(124,136,146)'
            }
          },
          axisLabel: {
            color: 'rgb(98,105,113)',
            fontSize: 16
          },
          axisTick: { show: false }
        },
        xAxis: {
          type: 'category',
          splitLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            color: 'rgb(98,105,113)',
            fontSize: 16
          },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: 'rgb(124,136,146)'
            }
          }
        },
        series: [
          {
            type: 'bar',
            stack: 'total',
            barWidth: 40
          },
          {
            type: 'bar',
            stack: 'total'
          }
        ]
      }
    }
    if (!chart) {
      chart = Echarts.init(document.getElementById('average-age-chart3') as HTMLElement)
    }
    chart.setOption(createOption())
    currentChart === 0 ? (currentChart = 1) : (currentChart = 0)
  }
  watch(
    () => props.data,
    () => {
      update()
    }
  )
</script>

<style lang="scss" scoped>
  .bar-chart {
    width: 100%;
    height: 100%;
    background: rgb(43, 44, 46);
    padding: 20px 40px;
    box-sizing: border-box;

    .title-wrapper {
      display: flex;

      .right {
        flex: 1;
        text-align: right;
      }

      .title {
        font-size: 32px;
      }

      .sub-title {
        font-size: 16px;
        margin-top: 10px;
      }
    }

    #average-age-chart3 {
      height: 250px;
    }
  }
</style>
