import { createRouter, createWebHistory } from 'vue-router';
import ListView from '../views/ListView.vue';
import SignIn from '../views/SignIn.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/list',
      name: 'list',
      component: ListView
    },
    {
      path: '/',
      name: 'signIn',
      component: SignIn
    }
  ]
});

router.beforeEach(async (to) => {
  const isLogin = localStorage.getItem('user');

  if (!isLogin && to.name == 'list') {
    alert('請先登入');
    return { name: 'signIn' };
  }
});

export default router;
