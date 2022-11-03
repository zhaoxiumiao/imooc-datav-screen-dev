<template>
  <div class="home">
    <imooc-loading v-if="loading">
      <div class="loading-text">Loading...</div>
    </imooc-loading>
    <imooc-container :options="{ width: 3840, height: 2160 }" v-else>
      <div class="header">
        <top-header />
      </div>
      <div class="separator" />
      <div class="center">
        <div class="left">
          <div class="left1">
            <total-user
              :today-user="userData.userToday"
              :growth-last-day="+userData.userGrowthLastDay || 0"
              :growth-last-month="+userData.userGrowthLastMonth || 0"
              ref="totalUser"
            />
          </div>
          <div class="left2">
            <average-age :data="ageData" :avg-age="+userData.averageAge || 0" ref="averageAge" />
          </div>
          <div class="left3">
            <total-device :data="deviceData" />
          </div>
          <div class="left4">
            <total-gender :data="userData.gender" />
          </div>
          <div class="left5">
            <line-chart :data="userData.rider" />
          </div>
          <div class="left6">
            <bar-chart :data="userData.category" />
          </div>
        </div>
        <div class="right">
          <div class="right-top1">
            <center-header :data="userData" />
          </div>
          <div class="right-top2">
            <country-category :data="['ALL', '北京', '上海', '深圳', '杭州', '南京', '武汉']" />
          </div>
          <div class="right-bottom">
            <div class="right-left">
              <div class="right-left1">
                <earth :data="mapData" />
              </div>
              <div class="right-left2">
                <country-category
                  :data="['订单量', '销售额', '用户数', '退单量']"
                  :color="['rgb(178, 209, 126)', 'rgb(116, 166, 49)']"
                />
              </div>
              <div class="right-left3">
                <imooc-fly-box
                  starColor="rgb(251,253,142)"
                  style="
                    background: #424446;
                    padding: 5px;
                    box-sizing: border-box;
                    border-radius: 10px;
                  "
                  line-color="rgb(66, 68, 70)"
                  :starLength="80"
                >
                  <average-view :data="realTimeOrder" />
                </imooc-fly-box>
              </div>
              <div class="right-left4">
                <schedule-view />
              </div>
            </div>
            <div class="right-right">
              <div class="right-right1">
                <plan-list :data="userData.areaSales" />
              </div>
              <div class="right-right2">
                <activate-user :data="userData.areaTop" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </imooc-container>
  </div>
</template>

<script setup name="Home" lang="ts">
  import TopHeader from '../components/TopHeader/index.vue'
  import TotalUser from '../components/TotalUser/index.vue'
  import AverageAge from '../components/AverageAge/index.vue'
  import TotalDevice from '../components/TotalDevice/index.vue'
  import TotalGender from '../components/TotalGender/index.vue'
  import LineChart from '../components/LineChart/index.vue'
  import BarChart from '../components/BarChart/index.vue'
  import CenterHeader from '../components/CenterHeader/index.vue'
  import CountryCategory from '../components/CountryCategory/index.vue'
  import Earth from '../components/Earth/datavMap.vue'
  import AverageView from '../components/AverageView/index.vue'
  import ScheduleView from '../components/ScheduleView/index.vue'
  import PlanList from '../components/PlanList/index.vue'
  import ActivateUser from '../components/ActivateUser/index.vue'
  import { ref, onMounted, getCurrentInstance } from 'vue'
  import { useScreenData } from './useScreenData'
  const loading = ref(true)
  const context: any = getCurrentInstance()
  const { ready, userData, ageData, deviceData, realTimeOrder, mapData }: any = useScreenData(
    context.ctx,
    {
      once: false
    }
  )
  onMounted(() => {
    setTimeout(() => {
      loading.value = false
    }, 1000)
  })
</script>

<style scoped lang="scss">
  .home {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: rgb(29, 29, 29);
    color: #fff;
    font-size: 48px;

    #imooc-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .header {
        width: 100%;
        height: 167px;
        background: yellow;
      }

      .separator {
        width: 100%;
        height: 10px;
        background: rgb(92, 88, 89);
      }

      .center {
        flex: 1;
        display: flex;
        width: 100%;

        .left {
          flex: 0 0 860px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 860px;
          height: 100%;
          padding-bottom: 20px;
          box-sizing: border-box;

          .left1 {
            height: 300px;
            background: grey;
          }

          .left2 {
            height: 320px;
            background: grey;
          }

          .left3 {
            height: 280px;
            background: grey;
          }

          .left4 {
            height: 230px;
            background: grey;
          }

          .left5 {
            height: 360px;
            background: grey;
          }

          .left6 {
            height: 360px;
            background: grey;
          }
        }

        .right {
          flex: 1;
          display: flex;
          flex-direction: column;
          margin-left: 10px;

          .right-top1 {
            width: 100%;
            height: 206px;
            background: grey;
          }

          .right-top2 {
            width: 100%;
            height: 48px;
            background: grey;
            margin: 10px 0;
          }

          .right-bottom {
            flex: 1;
            display: flex;
            padding-bottom: 20px;

            .right-left {
              flex: 0 0 1917px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              width: 1917px;

              .right-left1 {
                height: 999px;
                background: grey;
              }

              .right-left2 {
                height: 80px;
                background: grey;
              }

              .right-left3 {
                height: 350px;
                // background: grey;
              }

              .right-left4 {
                height: 220px;
                background: grey;
              }
            }

            .right-right {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              margin-left: 10px;
              margin-right: 20px;

              .right-right1 {
                width: 100%;
                height: 999px;
                background: grey;
              }

              .right-right2 {
                flex: 1;
                width: 100%;
                margin-top: 20px;
                background: grey;
              }
            }
          }
        }
      }
    }
  }

  .loading-text {
    font-size: 20px;
    margin-top: 10px;
  }
</style>
