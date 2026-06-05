import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import './style.css'
import App from './App.vue'
import router from './router' 
import SidebarAdmin from './components/SidebarAdmin.vue'

const app = createApp(App)
app.component('SidebarAdmin', SidebarAdmin)
// Configura el router para que este disponible en toda la aplicacióo
app.use(router) 
app.mount('#app')