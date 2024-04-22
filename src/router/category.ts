import AppLayout from "@/layouts/AppLayout.vue";
import { TableOutlined } from "@ant-design/icons-vue";
import { UserRole } from "@/types/enums";

const categoryRoutes = [
  {
    path: "/portal/categories",
    name: "Category",
    component: AppLayout,
    meta: {
      title: "Categories",
      icon: TableOutlined,
      isNotGuest: true,
    },
    redirect: "/portal/categories",
    children: [
      {
        path: "",
        name: "categoryList",
        component: () => import("../views/categories/CategoryList.vue"),
        meta: {
          title: "Category list",
          roles: [UserRole.ADMIN],
        },
      },
      {
        path: "create",
        name: "categoryCreate",
        component: () => import("../views/categories/CategoryForm.vue"),
        meta: {
          title: "Create category",
          roles: [UserRole.ADMIN],
        },
      },
      {
        path: ":id/update",
        name: "categoryUpdate",
        component: () => import("../views/categories/CategoryForm.vue"),
        meta: {
          hidden: true,
          title: "Update category",
          roles: [UserRole.ADMIN],
        },
      },
    ],
  },
];

export { categoryRoutes };
