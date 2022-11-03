<template>
  <div class="earth-wrapper">
    <div id="earth" />
    <chart
      ref="flight"
      :init-options="initOptions"
      :options="flightOptions"
      autoresize
      style="width:100%;height:100%;"
      v-if="false"
    />
  </div>
</template>

<script>
  import Echarts from 'echarts'
  import 'echarts-gl'
  import VueECharts from 'vue-echarts'
  // import 'echarts/map/js/world'

  // const ROOT_PATH = 'http://www.youbaobao.xyz/'
  // const ROOT_PATH = 'http://localhost:8089/'
  const ROOT_PATH = './'

  export default {
    components: {
      chart: VueECharts
    },
    data() {
      return {
        initOptions: {
          renderer: 'canvas'
        },
        flightOptions: null
      }
    },
    async mounted() {
      const option = {
        backgroundColor: '#000',
        globe: {
          baseTexture: require(ROOT_PATH + 'data-gl/world.topo.bathy.200401.jpg'),
          heightTexture: require(ROOT_PATH + 'data-gl/world.topo.bathy.200401.jpg'),
          displacementScale: 0.04,
          shading: 'realistic',
          environment: require(ROOT_PATH + 'data-gl/starfield.jpg'),
          realisticMaterial: {
            roughness: 0.9
          },
          postEffect: {
            enable: true
          },
          light: {
            main: {
              intensity: 5,
              shadow: true
            },
            ambientCubemap: {
              texture: ROOT_PATH + 'data-gl/pisa.hdr',
              diffuseIntensity: 0.2
            }
          }
        }
      }
      this.myChart = Echarts.init(document.getElementById('earth'))
      this.myChart.setOption(option, true)
    }
  }
</script>

<style lang="scss" scoped>
  .earth-wrapper {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background-color: rgba(6, 30, 93, 0.5);
    border-top: 2px solid rgba(1, 153, 209, .5);

    #earth {
      width: 100%;
      height: 100%;
    }
  }
</style>
