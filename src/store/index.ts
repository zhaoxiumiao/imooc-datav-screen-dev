import { createPinia } from 'pinia'

const pinia = createPinia()

function SecretPiniaPlugin() {
  return { secret: 'the cake is a lie' }
}

pinia.use(SecretPiniaPlugin)

export { pinia }
