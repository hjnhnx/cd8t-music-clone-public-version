import AppLayout from "@/layouts/AppLayout.vue";
import { UserOutlined } from "@ant-design/icons-vue";
import { UserRole } from "@/types/enums";

const singerRoutes = [
  {
    path: "/portal/singers",
    name: "Singer",
    component: AppLayout,
    meta: {
      title: "Singers",
      icon: UserOutlined,
      isNotGuest: true,
    },
    redirect: "/portal/singers",
    children: [
      {
        path: "",
        name: "singerList",
        component: () => import("../views/singers/SingerList.vue"),
        meta: {
          title: "Singer list",
          roles: [UserRole.ADMIN],
        },
      },
      {
        path: ":id",
        name: "singerDetail",
        component: () => import("../views/singers/SingerDetail.vue"),
        meta: {
          title: "Singer details",
          hidden: true,
        },
      },
      {
        path: "create",
        name: "singerCreate",
        component: () => import("../views/singers/SingerForm.vue"),
        meta: {
          title: "Create singer",
          roles: [UserRole.ADMIN],
        },
      },
      {
        path: ":id/update",
        name: "singerUpdate",
        component: () => import("../views/singers/SingerForm.vue"),
        meta: {
          hidden: true,
          title: "Update singer",
          roles: [UserRole.ADMIN],
        },
      },
    ],
  },
];

export { singerRoutes };
