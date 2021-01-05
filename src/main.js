import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vuefire'
import QrReader from 'vue3-qr-reader'

const app = createApp(App)
app.use(QrReader)
app.use(router)
app.mount('#app')
