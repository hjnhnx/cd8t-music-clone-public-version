<template>
  <Spin v-if="!user">
    <div class="h-screen w-screen"></div>
  </Spin>
  <div v-else :style="cssVariables" class="h-screen overflow-hidden bg-gray-100">
    <AppHeader class="z-20" />
    <div class="mt-16">
      <div class="h-content flex overflow-hidden bg-gray-100">
        <div class="hidden md:flex md:flex-shrink-0">
          <div class="flex w-64 flex-col">
            <AppSidebar class="z-10" />
          </div>
        </div>
        <div class="flex w-0 flex-1 flex-col overflow-hidden">
          <main class="relative z-0 flex-1 overflow-y-auto focus:outline-none">
            <ConfigProvider :form="formOptions">
              <router-view :key="$route.fullPath" />
            </ConfigProvider>
            <AppFooter />
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AppHeader from "@/layouts/partials/AppHeader.vue";
import AppSidebar from "@/layouts/partials/Navigation.vue";
import AppFooter from "@/layouts/partials/AppFooter.vue";
import { computed, watch } from "vue";
import type { User } from "@/types/models";
import { useAuthStore } from "@/stores/auth";
import { ConfigProvider, Spin } from "ant-design-vue";
import { defaultValidateMessages } from "@/utils/validate";

const authStore = useAuthStore();
const user = computed<User | undefined>(() => authStore.user);
const role = computed(() => authStore.role);

watch(
  role,
  () => {
    ConfigProvider.config({
      theme: {
        primaryColor: authStore.themeColor,
      },
    });
  },
  {
    immediate: true,
  }
);

const cssVariables = computed(() => {
  return {
    "--primary-color": authStore.themeRgb,
  };
});

const formOptions = {
  validateMessages: defaultValidateMessages,
};
</script>
