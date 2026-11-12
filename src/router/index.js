import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import AccountView from '@/views/AccountView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import LinksView from '@/views/LinksView.vue';
import RedirectView from '@/views/RedirectView.vue';
import AnalyticsView from '@/views/AnalyticsView.vue';
import LinkAnalyticsView from '@/views/LinkAnalyticsView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        title: 'Login',
        requiresGuest: true
      }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: {
        title: 'Register',
        requiresGuest: true
      }
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView,
      meta: {
        title: 'Account Settings',
        requiresAuth: true
      }
    },
    {
      path: '/links',
      name: 'links',
      component: LinksView
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: AnalyticsView,
      meta: { title: 'Analytics', requiresAuth: true }
    },
    {
      path: '/links/:id/analytics',
      name: 'link-analytics',
      component: LinkAnalyticsView,
      meta: { title: 'Link Analytics', requiresAuth: true }
    },
    {
      path: '/:shortUrl',
      name: 'redirect',
      component: RedirectView
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
      meta: {
        title: 'Not Found'
      }
    }
  ]
});

router.beforeEach((to) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return '/login';
  }

  if (to.meta.requiresGuest && auth.isAuthenticated) {
    return '/';
  }

  const baseTitle = 'Shorty';
  document.title = to.meta.title
    ? `${to.meta.title} - ${baseTitle}`
    : baseTitle;
});

export default router;
