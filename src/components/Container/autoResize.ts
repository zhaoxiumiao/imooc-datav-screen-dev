import { debounce, observerDomResize } from './util'
import { onMounted, onBeforeUnmount, reactive, nextTick } from 'vue'

export default function (afterAutoResizeMixinInit: any, refDom: any, onResize: any, options?: any) {
  const result: any = reactive({
    dom: '',
    width: 0,
    height: 0,
    originalWidth: 0,
    originalHeight: 0,
    debounceInitWHFun: '',
    domObserver: ''
  })
  async function autoResizeMixinInit() {
    await initWH(false)
    getDebounceInitWHFun()
    bindDomResizeCallback()
    if (typeof afterAutoResizeMixinInit === 'function') afterAutoResizeMixinInit()
  }
  function initWH(resize = true) {
    // const { $nextTick, $refs, ref, onResize } = this

    return new Promise((resolve) => {
      nextTick(() => {
        const dom = (result.dom = refDom.value)
        if (options) {
          const { width, height } = options
          if (width && height) {
            result.width = width
            result.height = height
          }
        } else {
          result.width = dom.clientWidth
          result.height = dom.clientHeight
        }
        if (!result.originalWidth || !result.originalHeight) {
          const { width, height } = screen
          result.originalWidth = width
          result.originalHeight = height
        }
        if (typeof onResize === 'function' && resize) onResize()
        resolve(null)
      })
    })
  }
  function getDebounceInitWHFun() {
    result.debounceInitWHFun = debounce(100, initWH)
  }
  function bindDomResizeCallback() {
    result.domObserver = observerDomResize(result.dom, result.debounceInitWHFun)
    window.addEventListener('resize', result.debounceInitWHFun)
  }
  function unbindDomResizeCallback() {
    result.domObserver.disconnect()
    result.domObserver.takeRecords()
    result.domObserver = null
    window.removeEventListener('resize', result.debounceInitWHFun)
  }
  onMounted(() => {
    autoResizeMixinInit()
  })
  onBeforeUnmount(() => {
    // const { unbindDomResizeCallback } = this
    unbindDomResizeCallback()
  })
  return result
}
