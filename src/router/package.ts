import AppLayout from "@/layouts/AppLayout.vue";
import { SmileOutlined } from "@ant-design/icons-vue";
import { UserRole } from "@/types/enums";

const packageRoutes = [
  {
    path: "/portal/packages",
    name: "Package",
    component: AppLayout,
    meta: {
      title: "Premium Package",
      icon: SmileOutlined,
      isNotGuest: true,
    },
    redirect: "/portal/packages",
    children: [
      {
        path: "",
        name: "packageList",
        component: () => import("../views/premium-package/List.vue"),
        meta: {
          title: "Package list",
          roles: [UserRole.ADMIN],
        },
      },
      {
        path: "create",
        name: "packageCreate",
        component: () => import("../views/premium-package/Form.vue"),
        meta: {
          title: "Create package",
          roles: [UserRole.ADMIN],
        },
      },
      {
        path: ":id/update",
        name: "packageUpdate",
        component: () => import("../views/premium-package/Form.vue"),
        meta: {
          hidden: true,
          title: "Update package",
          roles: [UserRole.ADMIN],
        },
      },
    ],
  },
];

export { packageRoutes };
