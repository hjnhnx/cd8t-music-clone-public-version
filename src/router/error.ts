import AppLayout from "@/layouts/AppLayout.vue";

const errorRoutes = [
  {
    path: "/portal/404",
    name: "error404",
    component: AppLayout,
    meta: {
      hidden: true,
    },
    children: [
      {
        path: "",
        name: "404",
        component: () => import("../views/error-page/Error404.vue"),
        meta: {
          title: "Not found",
        },
      },
    ],
  },

  {
    path: "/portal/403",
    name: "error403",
    component: AppLayout,
    meta: {
      hidden: true,
    },
    children: [
      {
        path: "",
        name: "403",
        component: () => import("../views/error-page/Error403.vue"),
        meta: {
          title: "Unauthorized",
        },
      },
    ],
  },
];

export { errorRoutes };
