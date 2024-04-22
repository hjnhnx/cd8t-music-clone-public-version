import AppLayout from "@/layouts/AppLayout.vue";
import { OrderedListOutlined } from "@ant-design/icons-vue";
import { UserRole } from "@/types/enums";

const songRequestRoutes = [
  {
    path: "/portal/song-request",
    name: "songRequest",
    component: AppLayout,
    meta: {
      icon: OrderedListOutlined,
      title: "Singer Request",
      isNotGuest: true,
    },
    redirect: "/portal/song-request",
    children: [
      {
        path: "",
        name: "songRequest",
        component: () => import("../views/songs/SongRequest.vue"),
        meta: {
          title: "Song Request",
          roles: [UserRole.ADMIN, UserRole.MODERATOR],
        },
      },
    ],
  },
];

export { songRequestRoutes };
