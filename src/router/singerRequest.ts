import AppLayout from "@/layouts/AppLayout.vue";
import { UserSwitchOutlined } from "@ant-design/icons-vue";
import { UserRole } from "@/types/enums";

const singerRequestRoutes = [
  {
    path: "/portal/singer-request",
    name: "singerRequest",
    component: AppLayout,
    meta: {
      icon: UserSwitchOutlined,
      title: "Singer Request",
      isNotGuest: true,
    },
    redirect: "/portal/singer-request",
    children: [
      {
        path: "",
        name: "singerRequest",
        component: () => import("../views/singers/SingerRequest.vue"),
        meta: {
          title: "Singer Request",
          roles: [UserRole.ADMIN, UserRole.MODERATOR],
        },
      },
    ],
  },
];

export { singerRequestRoutes };
