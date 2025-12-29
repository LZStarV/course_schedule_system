import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import { router } from '@router/index';
import { usePermissionStore } from '@stores/permission.store';
import { useAuthStore } from '@stores/auth.store';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);

const auth = useAuthStore(pinia);
const perm = usePermissionStore(pinia);
perm.initialize(auth.user?.role || 'STUDENT');

app.mount('#app');
