import { createRouter, createWebHistory } from "vue-router";
import type { CustomRoute } from "@/types/route";
import type { UserRole } from "@/types/enums";
import { appLocalStorage } from "@/utils/storage";
import { AUTHORIZATION_KEY } from "@/utils/constants";
import { guestRoutes } from "@/router/guest";
import { authRoutes } from "@/router/auth";
import { dashboardRoutes } from "@/router/dashboard";
import { errorRoutes } from "@/router/error";
import { userRoutes } from "@/router/user";
import { singerRoutes } from "@/router/singer";
import { categoryRoutes } from "@/router/category";
import { countryRoutes } from "@/router/country";
import { singerRequestRoutes } from "@/router/singerRequest";
import { songRoutes } from "@/router/song";
import { albumRoutes } from "@/router/album";
import { packageRoutes } from "@/router/package";
import { starPointRoutes } from "@/router/starPoint";
import { songRequestRoutes } from "@/router/songRequest";

import { useAuthStore } from "@/stores/auth";

export const constantRoutes: CustomRoute[] = [
  ...guestRoutes,
  ...authRoutes,
  ...errorRoutes,
  ...dashboardRoutes,
  ...userRoutes,
  ...singerRoutes,
  ...categoryRoutes,
  ...countryRoutes,
  ...singerRequestRoutes,
  ...songRoutes,
  ...packageRoutes,
  ...albumRoutes,
  ...starPointRoutes,
  ...songRequestRoutes,
  {
    path: "/portal/:catchAll(.*)",
    redirect: "/portal/404",
    meta: {
      hidden: true,
    },
  },
];

const createCustomRouter = () =>
  createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: constantRoutes,
    scrollBehavior(to) {
      if (to.hash) {
        return {
          el: to.hash,
          behavior: "smooth",
        };
      }
    },
  });

const router = createCustomRouter();

router.beforeEach(async (to, from, next) => {
  // set title
  const appName = "Nine T Music";
  document.title = to.meta?.title ? to.meta.title + " - " + appName : appName;

  // if no token then redirect to login
  const token = appLocalStorage.getItem(AUTHORIZATION_KEY);
  const isProtectedRouteAdmin = to.name !== "login" && to.fullPath.includes("/portal");
  const isProtectedRoute = to.name !== "login";
  if (isProtectedRouteAdmin && !token) {
    next({ name: "login" });
    return;
  }

  // if token exists but not authenticated then get profile
  const authStore = useAuthStore();
  if (isProtectedRoute && !authStore.user && token) {
    await authStore.getProfile();
  }
  next();
});

router.beforeResolve((to, from, next) => {
  // check for permission
  const authStore = useAuthStore();
  if (to.meta?.roles && !(to.meta.roles as UserRole[]).includes(authStore.role)) {
    next({ name: "403" });
  } else {
    next();
  }
});

export default router;
