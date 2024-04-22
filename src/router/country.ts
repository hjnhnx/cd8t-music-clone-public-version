import AppLayout from "@/layouts/AppLayout.vue";
import { GlobalOutlined } from "@ant-design/icons-vue";
import { UserRole } from "@/types/enums";

const countryRoutes = [
  {
    path: "/portal/countries",
    name: "Country",
    component: AppLayout,
    meta: {
      title: "Countries",
      icon: GlobalOutlined,
      isNotGuest: true,
    },
    redirect: "/portal/countries",
    children: [
      {
        path: "",
        name: "countryList",
        component: () => import("../views/countries/CountryList.vue"),
        meta: {
          title: "Country list",
          roles: [UserRole.ADMIN],
        },
      },
      {
        path: "create",
        name: "countryCreate",
        component: () => import("../views/countries/CountryForm.vue"),
        meta: {
          title: "Create country",
          roles: [UserRole.ADMIN],
        },
      },
      {
        path: ":id/update",
        name: "countryUpdate",
        component: () => import("../views/countries/CountryForm.vue"),
        meta: {
          hidden: true,
          title: "Update country",
          roles: [UserRole.ADMIN],
        },
      },
    ],
  },
];

export { countryRoutes };
