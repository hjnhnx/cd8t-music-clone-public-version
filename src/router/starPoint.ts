import GuestLayout from "@/layouts/GuestLayout.vue";
import { ProfileOutlined, SettingOutlined } from "@ant-design/icons-vue";

const starPointRoutes = [
  {
    path: "/recharge-star-point",
    name: "RechargeStarPoint",
    component: GuestLayout,
    meta: {
      hidden: true,
      title: "RechargeStarPoint",
      icon: ProfileOutlined,
    },
    redirect: "/recharge-star-point",
    children: [
      {
        path: "",
        name: "recharge-star-point",
        component: () => import("../views/premium/PremiumDetail.vue"),
        meta: {
          title: "RechargeStarPoint",
        },
      },
    ],
  },
];

export { starPointRoutes };
