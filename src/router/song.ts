import AppLayout from "@/layouts/AppLayout.vue";
import { UnorderedListOutlined } from "@ant-design/icons-vue";
import { UserRole } from "@/types/enums";

const songRoutes = [
  {
    path: "/portal/songs",
    name: "Songs",
    component: AppLayout,
    meta: {
      title: "Songs",
      icon: UnorderedListOutlined,
      isNotGuest: true,
    },
    redirect: "/portal/songs",
    children: [
      {
        path: "",
        name: "songList",
        component: () => import("../views/songs/SongList.vue"),
        meta: {
          title: "Song list",
          roles: [UserRole.ADMIN],
        },
      },
      {
        path: ":id/details",
        name: "draftSongView",
        component: () => import("../views/songs/DraftSongDetail.vue"),
        meta: {
          hidden: true,
          title: "Draft Song details",
          roles: [UserRole.ADMIN, UserRole.MODERATOR],
        },
      },
    ],
  },
];

export { songRoutes };
