<template>
  <div class="earth-wrapper">
    <div class="loading" v-if="!ready">加载中...</div>
    <div id="earth" v-else />
  </div>
</template>

<script>
  import Echarts from 'echarts'
  import 'echarts-gl'
  import axios from 'axios'

  export default {
    name: 'earth2',
    data() {
      return {
        ready: false
      }
    },
    async mounted() {
      axios.get('/assets/data.json').then(response => {
        let data = response.data
        const airports = data.airports.map(function(item) {
          return {
            coord: [item[3], item[4]]
          }
        })

        function getAirportCoord(idx) {
          return [data.airports[idx][3], data.airports[idx][4]]
        }

        // Route: [airlineIndex, sourceAirportIndex, destinationAirportIndex]
        const routesGroupByAirline = {}
        data.routes.forEach(function(route) {
          const airline = data.airlines[route[0]]
          const airlineName = airline[0]
          if (!routesGroupByAirline[airlineName]) {
            routesGroupByAirline[airlineName] = []
          }
          routesGroupByAirline[airlineName].push(route)
        })
        const pointsData = []
        data.routes.forEach(function(airline) {
          pointsData.push(getAirportCoord(airline[1]))
          pointsData.push(getAirportCoord(airline[2]))
        })
        const series = data.airlines.map(function(airline) {
          const airlineName = airline[0]
          const routes = routesGroupByAirline[airlineName]
          if (!routes) {
            return null
          }
          return {
            type: 'lines3D',
            name: airlineName,
            effect: {
              show: true,
              trailWidth: 2,
              trailLength: 0.2,
              trailOpacity: 0.4,
              trailColor: 'rgb(30, 30, 60)'
            },
            lineStyle: {
              width: 1,
              color: 'rgb(50, 50, 150)',
              // color: 'rgb(118, 233, 241)',
              opacity: 0.1
            },
            blendMode: 'lighter',
            distanceToGlobe: 4,
            data: routes.map(function(item) {
              return [airports[item[1]].coord, airports[item[2]].coord]
            })
          }
        }).filter(function(series) {
          return !!series
        })
        series.push({
          type: 'scatter3D',
          coordinateSystem: 'globe',
          blendMode: 'lighter',
          symbolSize: 2,
          distanceToGlobe: 4,
          itemStyle: {
            color: 'rgb(50, 50, 150)',
            opacity: 0.2
          },
          data: pointsData
        })
        this.ready = true
        this.$nextTick(() => {
          const myChart = Echarts.init(document.getElementById('earth'))
          myChart.setOption({
            legend: {
              selectedMode: 'single',
              left: 'left',
              data: Object.keys(routesGroupByAirline),
              orient: 'vertical',
              textStyle: {
                color: '#fff',
                fontSize: 30
              }
            },
            globe: {
              baseTexture: '/assets/world.topo.bathy.200401.jpg',
              heightTexture: '/assets/world.topo.bathy.200401.jpg',
              environment: '/assets/starfield.jpg',
              displacementScale: 0.05,
              displacementQuality: 'medium',
              shading: 'realistic',
              realisticMaterial: {
                roughness: 0.9
              },
              postEffect: {
                enable: true
              },
              temporalSuperSampling: {
                enable: true
              },
              light: {
                main: {
                  intensity: 5,
                  shadow: true
                },
                ambientCubemap: {
                  texture: '/assets/pisa.hdr',
                  diffuseIntensity: 0.2
                }
              },
              viewControl: {
                autoRotate: true
              }
            },
            series: series
          })
          window.addEventListener('keydown', function() {
            series.forEach(function(series, idx) {
              myChart.dispatchAction({
                type: 'lines3DToggleEffect',
                seriesIndex: idx
              })
            })
          })
        })
      })
    }
  }
</script>

<style lang="scss" scoped>
  .earth-wrapper {
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      font-size: 36px;
      background: rgb(48, 48, 48);
    }

    #earth {
      width: 100%;
      height: 100%;
    }
  }
</style>
