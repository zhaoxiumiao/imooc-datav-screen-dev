import { ref, onMounted, onUnmounted } from 'vue'

function dateFilter(v: any) {
  let m = v.getMonth() + 1
  m = m < 10 ? '0' + m : m
  let d = v.getDate()
  d = d < 10 ? '0' + d : d
  return v.getFullYear() + '-' + m + '-' + d
}

function timeFilter(v: any) {
  let h = v.getHours()
  h = h < 10 ? '0' + h : h
  let m = v.getMinutes()
  m = m < 10 ? '0' + m : m
  let s = v.getSeconds()
  s = s < 10 ? '0' + s : s
  return h + ':' + m + ':' + s
}

export function clock() {
  let now = new Date()
  const date = ref(dateFilter(now))
  const time = ref(timeFilter(now))
  let task: NodeJS.Timer
  const start = () => {
    task = setInterval(() => {
      now = new Date()
      date.value = dateFilter(now)
      time.value = timeFilter(now)
    }, 1000)
  }
  onMounted(start)
  onUnmounted(() => {
    task && clearInterval(task)
  })
  return {
    date,
    time,
    start
  }
}
