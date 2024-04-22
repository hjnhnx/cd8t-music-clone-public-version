import AppLayout from "@/layouts/AppLayout.vue";
import { ProfileOutlined, SettingOutlined } from "@ant-design/icons-vue";
import { UserRole } from "@/types/enums";
import GuestLayout from "@/layouts/GuestLayout.vue";

const userRoutes = [
  {
    path: "/profile",
    name: "Profile",
    component: GuestLayout,
    meta: {
      title: "Profile",
      icon: ProfileOutlined,
      isNotAdmin: true,
    },
    redirect: "/profile",
    children: [
      {
        path: "",
        name: "profile",
        component: () => import("../views/profile/UserProfile.vue"),
        meta: {
          title: "Profile",
        },
      },
    ],
  },
  {
    path: "/portal/admins",
    name: "User",
    component: AppLayout,
    meta: {
      title: "Users",
      icon: SettingOutlined,
      isNotGuest: true,
    },
    redirect: "/portal/admins",
    children: [
      {
        path: "",
        name: "adminList",
        component: () => import("../views/admins/AdminList.vue"),
        meta: {
          title: "User list",
          roles: [UserRole.ADMIN],
        },
      },
      {
        path: "create",
        name: "adminCreate",
        component: () => import("../views/admins/AdminForm.vue"),
        meta: {
          title: "Create user",
          roles: [UserRole.ADMIN],
        },
      },
      {
        path: ":id/update",
        name: "adminUpdate",
        component: () => import("../views/admins/AdminForm.vue"),
        meta: {
          hidden: true,
          title: "Update user",
          roles: [UserRole.ADMIN],
        },
      },
      {
        path: ":id/addPackage",
        name: "addPackage",
        component: () => import("../views/admins/AddPackage.vue"),
        meta: {
          hidden: true,
          title: "Add package for user",
          roles: [UserRole.ADMIN],
        },
      },
    ],
  },
];

export { userRoutes };
