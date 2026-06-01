import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import './style.css'
import App from './App.vue'
import router from './router' 
import SidebarAdmin from './components/SidebarAdmin.vue'

const app = createApp(App)
app.component('SidebarAdmin', SidebarAdmin)
app.use(router) 
app.mount('#app')