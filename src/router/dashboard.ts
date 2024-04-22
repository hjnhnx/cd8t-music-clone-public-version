import AppLayout from "@/layouts/AppLayout.vue";
import { AreaChartOutlined } from "@ant-design/icons-vue";
import { UserRole } from "@/types/enums";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const dashboardRoutes = [
  {
    path: "/portal/",
    name: "dashboard",
    component: AppLayout,
    meta: {
      icon: AreaChartOutlined,
      title: "Dashboard",
      isNotGuest: true,
    },
    redirect: "/portal/",
    children: [
      {
        path: "",
        name: "dashboard",
        component: () => import("../views/report/Report.vue"),
        meta: {
          title: "Dashboard",
          roles: [UserRole.ADMIN],
        },
        beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
          const authStore = useAuthStore();
          if (authStore.role === UserRole.USER) {
            next({ name: "home" });
          } else if (authStore.role === UserRole.MODERATOR) {
            next({ name: "singerRequest" });
          } else if (authStore.role === UserRole.SINGER) {
            next({ name: "home" });
          } else {
            next();
          }
        },
      },
    ],
  },
];

export { dashboardRoutes };
