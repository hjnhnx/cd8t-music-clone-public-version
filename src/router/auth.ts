const authRoutes = [
  {
    path: "/portal/login",
    name: "login",
    component: () => import("../views/auth/Login.vue"),
    meta: {
      hidden: true,
    },
  },
];

export { authRoutes };
