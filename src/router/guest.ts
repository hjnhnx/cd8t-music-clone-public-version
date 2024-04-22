import GuestLayout from "@/layouts/GuestLayout.vue";
import {
  AppstoreOutlined,
  CrownOutlined,
  HomeOutlined,
  PlaySquareOutlined,
  PlusSquareOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue";
import { UserRole } from "@/types/enums";

const guestRoutes = [
  {
    path: "/",
    name: "guest",
    component: GuestLayout,
    meta: {
      icon: HomeOutlined,
      isNotAdmin: true,
      title: "Homepage",
    },
    redirect: "/",
    children: [
      {
        path: "",
        name: "home",
        component: () => import("../views/guest/Homepage.vue"),
        meta: {
          title: "Homepage",
        },
      },
      {
        path: "/success",
        name: "success",
        component: () => import("../views/error-page/Success.vue"),
        meta: {
          title: "Success",
        },
      },
    ],
  },
  {
    path: "/singer",
    name: "singer",
    component: GuestLayout,
    meta: {
      isNotAdmin: true,
      hidden: true,
    },
    redirect: "/singer",
    children: [
      {
        path: ":id",
        name: "singerProfile",
        component: () => import("../views/guest/SingerProfile.vue"),
        meta: {
          title: "Singer Profile",
          hidden: true,
        },
      },
    ],
  },
  {
    path: "/song",
    name: "song",
    component: GuestLayout,
    meta: {
      isNotAdmin: true,
      icon: PlusSquareOutlined,
    },
    redirect: "/song",
    children: [
      {
        path: "create",
        name: "songCreate",
        component: () => import("../views/songs/SongForm.vue"),
        meta: {
          title: "Create song",
          roles: [UserRole.SINGER],
        },
      },
      {
        path: ":id/update",
        name: "songUpdate",
        component: () => import("../views/songs/SongForm.vue"),
        meta: {
          hidden: true,
          title: "Update song",
          roles: [UserRole.SINGER],
        },
      },
    ],
  },
  {
    path: "/premium",
    name: "Premium",
    component: GuestLayout,
    meta: {
      title: "Premiums",
      icon: CrownOutlined,
      isNotAdmin: true,
    },
    redirect: "/premium",
    children: [
      {
        path: "",
        name: "premium",
        component: () => import("../views/premium/Premium.vue"),
        meta: {
          title: "Singer list",
        },
      },
      {
        path: ":id",
        name: "premiumDetail",
        component: () => import("../views/premium/PremiumDetail.vue"),
        meta: {
          title: "Premium Detail",
        },
      },
    ],
  },
  {
    path: "/new-song",
    name: "New Music",
    component: GuestLayout,
    meta: {
      title: "New Song",
      icon: PlaySquareOutlined,
      isNotAdmin: true,
    },
    redirect: "/new-song",
    children: [
      {
        path: "",
        name: "newSongs",
        component: () => import("../views/guest/NewSong.vue"),
        meta: {
          title: "New Song",
        },
      },
    ],
  },
  {
    path: "/search",
    name: "Search",
    component: GuestLayout,
    meta: {
      title: "Search",
      icon: SearchOutlined,
      isNotAdmin: true,
    },
    redirect: "/search",
    children: [
      {
        path: "",
        name: "search",
        component: () => import("../views/guest/Search.vue"),
        meta: {
          title: "Search",
        },
      },
    ],
  },
  {
    path: "/categories",
    name: "Categories",
    component: GuestLayout,
    meta: {
      title: "Categories",
      icon: AppstoreOutlined,
      isNotAdmin: true,
    },
    redirect: "/categories",
    children: [
      {
        path: "",
        name: "categories",
        component: () => import("../views/guest/Category.vue"),
        meta: {
          title: "Category",
        },
      },
      {
        path: ":id",
        name: "clientDetailCategory",
        component: () => import("../views/guest/CategoryDetail.vue"),
        meta: {
          title: "Category Detail",
          hidden: true,
        },
      },
    ],
  },
  {
    path: "/countries",
    name: "Countries",
    component: GuestLayout,
    meta: {
      title: "Countries",
      hidden: true,
    },
    redirect: "/countries",
    children: [
      {
        path: ":id",
        name: "clientDetailCountry",
        component: () => import("../views/guest/CountryDetail.vue"),
        meta: {
          title: "Country Detail",
          hidden: true,
        },
      },
    ],
  },
];

export { guestRoutes };
