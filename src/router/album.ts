import { PictureOutlined } from "@ant-design/icons-vue";
import { UserRole } from "@/types/enums";
import GuestLayout from "@/layouts/GuestLayout.vue";

const albumRoutes = [
  {
    path: "/albums",
    name: "album",
    component: GuestLayout,
    meta: {
      title: "Albums",
      icon: PictureOutlined,
      isNotAdmin: true,
      hidden: true,
    },
    redirect: "/albums",
    children: [
      {
        path: "create",
        name: "albumCreate",
        component: () => import("../views/albums/AlbumForm.vue"),
        meta: {
          title: "Create album",
          roles: [UserRole.SINGER],
        },
      },
      {
        path: ":id/update",
        name: "albumUpdate",
        component: () => import("../views/albums/AlbumForm.vue"),
        meta: {
          hidden: true,
          title: "Update album",
          roles: [UserRole.SINGER],
        },
      },
      {
        path: ":id",
        name: "albumDetail",
        component: () => import("../views/guest/AlbumDetail.vue"),
        meta: {
          title: "Album Detail",
          hidden: true,
        },
      },
    ],
  },
];

export { albumRoutes };
