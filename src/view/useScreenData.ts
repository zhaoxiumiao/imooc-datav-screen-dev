import { onMounted, onUnmounted, ref } from 'vue'
import { getMapData, getUserData } from '../api'
interface DataParams {
  once: Boolean
}

const color = ['rgb(116,166,49)', 'rgb(190,245,99)', 'rgb(202,252,137)', 'rgb(251,253,142)']

let task: any = null

function getNowTime() {
  const now = new Date()
  return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
}

const createData = async ({ userData, ageData, deviceData, realTimeOrder }: any, context: any) => {
  userData.value = await getUserData()
  userData.value.age.forEach((item: any, index: any) => {
    if (ageData.value[index]) {
      ageData.value[index] = {
        startValue: ageData.value[index].value,
        value: item.value,
        axis: item.key,
        color: color[index]
      }
      ageData.value = [...ageData.value]
    } else {
      ageData.value.push({
        startValue: 0,
        value: item.value,
        axis: item.key,
        color: color[index]
      })
    }
  })
  deviceData.value = {
    totalDevices: userData.value.totalDevices,
    devices: userData.value.devices
  }
  realTimeOrder.value = {
    date: [...realTimeOrder.value.date, getNowTime()],
    data: [...realTimeOrder.value.data, userData.value.realTimeOrder]
  }
  context.$refs.totalUser.updateStartVal()
  context.$refs.averageAge.update()
}

const screenReady = (
  { ready, userData, ageData, deviceData, mapData, realTimeOrder }: any,
  context: any,
  { once }: DataParams
) => {
  setTimeout(async () => {
    ready.value = true
    mapData.value = await getMapData()
    await createData(
      {
        userData,
        ageData,
        deviceData,
        realTimeOrder
      },
      context
    )
  }, 1000)
  if (!once) {
    task = setInterval(async () => {
      await createData(
        {
          userData,
          ageData,
          deviceData,
          realTimeOrder
        },
        context
      )
    }, 5000)
  }
}

const killTask = () => {
  if (task) {
    clearInterval(task)
  }
}

export function useScreenData(context: any, { once }: DataParams) {
  const ready = ref(false)
  const userData = ref({
    today: 0,
    averageAge: 0
  })
  const ageData = ref([])
  const deviceData = ref({})
  const mapData = ref({})
  const realTimeOrder = ref({ date: [], data: [] })

  onMounted(() =>
    screenReady(
      {
        ready,
        userData,
        ageData,
        deviceData,
        mapData,
        realTimeOrder
      },
      context,
      { once }
    )
  )
  onUnmounted(killTask)

  return {
    ready,
    userData,
    ageData,
    deviceData,
    mapData,
    realTimeOrder
  }
}
