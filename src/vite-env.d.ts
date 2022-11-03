/// <reference types="vite/client" />
/// <reference types="qi-ui-plus/types" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
