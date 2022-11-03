<template>
  <div class="top-header">
    <img
      class="logo"
      src="https://datav.oss-cn-hangzhou.aliyuncs.com/uploads/images/54149aa06f26afcf26f42d66c999ee8b.png"
    />
    <div class="logo-text">
      <div class="cn-text">慕课外卖业务数据大盘</div>
      <div class="en-text">Imooc Delivery Overview of Business Data</div>
    </div>
    <div class="right-text">
      <img
        class="right-logo"
        src="https://img.alicdn.com/tfs/TB1Kbzuq.z1gK0jSZLeXXb9kVXa-600-500.png"
      />
      <div class="date">{{ date }}</div>
      <div class="time">{{ time }}</div>
    </div>
  </div>
</template>

<script setup name="TopHeader" lang="ts">
  import { clock as useClock } from '../../utils/clock'

  const { date, time } = useClock()
</script>

<style scoped lang="scss">
  .top-header {
    display: flex;
    width: 100%;
    height: 100%;
    padding: 0 64px;
    box-sizing: border-box;
    background: rgb(36, 31, 32);
    align-items: center;
    .logo {
      width: 395px;
      height: 99px;
    }

    .logo-text {
      flex: 1;
      margin-left: 40px;

      .cn-text {
        color: rgb(255, 255, 255);
        font-weight: bold;
        font-size: 60px;
        letter-spacing: 2px;
      }

      .en-text {
        color: rgb(255, 255, 255);
        font-size: 35px;
        letter-spacing: 1px;
      }
    }

    .right-text {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      img {
        width: 363px;
        height: 150px;
      }

      .date {
        width: 330px;
        text-align: right;
        font-size: 52px;
        color: rgb(255, 255, 255);
        font-family: DIN;
        font-weight: 500;
      }
      .time {
        width: 220px;
        font-size: 52px;
        color: rgb(197, 251, 121);
        font-family: DIN;
        font-weight: 500;
        margin-left: 30px;
      }
    }
  }
</style>
