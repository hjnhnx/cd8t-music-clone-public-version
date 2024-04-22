<template>
  <Menu
    v-model:selectedKeys="selectedKeys"
    :openKeys="openKeys"
    class="h-full border-r border-gray-200"
    mode="inline"
    @openChange="onOpenChange"
  >
    <template v-for="item in navigation" :key="item.name">
      <router-link v-if="!item.children" :to="{ name: item.name }">
        <MenuItem :key="item.name">
          <component :is="item.meta?.icon" v-if="item.meta?.icon" />
          <span>{{ item.meta?.title }}</span>
        </MenuItem>
      </router-link>
      <SubMenu v-else-if="item.children" :key="item.name">
        <template #title>
          <span>
            <component :is="item.meta?.icon" v-if="item.meta?.icon" />
            <span>{{ item.meta?.title }}</span>
          </span>
        </template>
        <template v-for="{ name: childName, meta: childMeta } in item.children" :key="childName">
          <router-link v-if="!childMeta?.hidden" :to="{ name: childName }">
            <MenuItem :key="childName">{{ childMeta?.title }}</MenuItem>
          </router-link>
        </template>
      </SubMenu>
    </template>
  </Menu>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Menu, MenuItem } from "ant-design-vue";
import type { CustomRoute } from "@/types/route";
import { useAuthStore } from "@/stores/auth";
import type { Key } from "ant-design-vue/es/_util/type";

const SubMenu = Menu.SubMenu;
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
  return !!route.meta?.hidden || !hasPermission(route) || !!route.meta?.isNotAdmin;
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

const onOpenChange = (newOpenKeys: Key[]) => {
  const latestOpenKey = newOpenKeys.find((key) => openKeys.value.indexOf(key as string) === -1);
  if (latestOpenKey && openKeys.value.includes(latestOpenKey as string)) {
    openKeys.value = [];
  } else if (latestOpenKey) {
    openKeys.value = [latestOpenKey as string];
  }
};

watch(currentRoute, (newVal) => {
  if (
    navigation.value.some((route) => route.name === newVal || route.children?.some((child) => child.name === newVal))
  ) {
    selectedKeys.value = [newVal];
  }
});
</script>
