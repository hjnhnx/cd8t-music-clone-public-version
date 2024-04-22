<template>
  <Menu v-model:selectedKeys="selectedKeys" :openKeys="openKeys" class="h-full border-r border-gray-200" mode="inline">
    <template v-for="item in navigation" :key="item.name">
      <router-link :to="{ name: item.name }">
        <MenuItem :key="item.name">
          <component :is="item.meta?.icon" v-if="item.meta?.icon" />
          <span>{{ item.meta?.title }}</span>
        </MenuItem>
      </router-link>
    </template>
  </Menu>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Menu, MenuItem } from "ant-design-vue";
import {
  AimOutlined,
  AreaChartOutlined,
  BorderOuterOutlined,
  DeploymentUnitOutlined,
  HeartOutlined,
  HomeOutlined,
  OrderedListOutlined,
} from "@ant-design/icons-vue";
import type { CustomRoute } from "@/types/route";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const route = useRoute();
const routes: CustomRoute[] = router.options.routes;
const authStore = useAuthStore();

const currentRoute = computed<string>(() => route.name as string);
const parentRoute = computed<string>(() => router.currentRoute.value.matched[0].name as string);
const selectedKeys = ref<string[]>([currentRoute.value]);
const openKeys = ref<string[]>([parentRoute.value]);

const hasPermission = (route: CustomRoute) => {
  return !route.meta?.roles || route.meta.roles.includes(authStore.role);
};

const isHidden = (route: CustomRoute) => {
  return !!route.meta?.hidden || !hasPermission(route) || !!route.meta?.isNotGuest;
};

const navigation = computed(() =>
  routes
    // remove hidden parents
    .filter((route) => !isHidden(route))
    // remove hidden children
    .map((route) => {
      return {
        ...route,
        children: route.children?.filter((child) => !isHidden(child)),
      };
    })
    // remove parents with no child
    .filter((route) => route.children && route.children.length)
    // map single child
    .map((route) => {
      if (route.children && route.children.length === 1) {
        return {
          ...route,
          ...route.children[0],
          meta: { ...route.meta, ...route.children[0].meta },
          children: undefined,
        };
      }
      return route;
    })
);

// const navigation = ref<object[]>([
//   {
//     name: "Trang Chủ",
//     meta: {
//       title: "Trang Chủ",
//       icon: HomeOutlined,
//     },
//   },
//   {
//     name: "Cá Nhân",
//     meta: {
//       title: "Cá Nhân",
//       icon: BorderOuterOutlined,
//     },
//   },
//   {
//     name: "Khám Phá",
//     meta: {
//       title: "Khám Phá",
//       icon: DeploymentUnitOutlined,
//     },
//   },
//   {
//     name: "Bảng Xếp Hạng",
//     meta: {
//       title: "Bảng Xếp Hạng",
//       icon: AreaChartOutlined,
//     },
//   },
//   {
//     name: "Đã Theo Dõi",
//     meta: {
//       title: "Đã Theo Dõi",
//       icon: AimOutlined,
//     },
//   },
//   {
//     name: "Yêu Thích",
//     meta: {
//       title: "Yêu Thích",
//       icon: HeartOutlined,
//     },
//   },
//   {
//     name: "Danh Sách Phát",
//     meta: {
//       title: "Danh Sách Phát",
//       icon: OrderedListOutlined,
//     },
//   },
// ]);

//
// const onOpenChange = (newOpenKeys: Key[]) => {
//   const latestOpenKey = newOpenKeys.find((key) => openKeys.value.indexOf(key as string) === -1);
//   if (latestOpenKey && openKeys.value.includes(latestOpenKey as string)) {
//     openKeys.value = [];
//   } else if (latestOpenKey) {
//     openKeys.value = [latestOpenKey as string];
//   }
// };
//
// watch(currentRoute, (newVal) => {
//   if (
//     navigation.value.some((route) => route.name === newVal || route.children?.some((child) => child.name === newVal))
//   ) {
//     selectedKeys.value = [newVal];
//   }
// });
</script>
