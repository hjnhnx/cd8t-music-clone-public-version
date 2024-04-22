<template>
  <Disclosure v-slot="{ open }" as="nav" class="fixed inset-x-0 top-0 bg-primary-600">
    <div class="flex h-16 w-full items-center justify-between px-4 sm:px-6 md:px-0">
      <div class="flex">
        <div class="flex w-64 items-center justify-center gap-2 space-x-1 px-4">
          <Logo class="filter- h-6 w-6 text-white" fill="currentcolor" style="filter: brightness(0) invert(1)" />
          <router-link
            :to="{ name: 'home' }"
            class="hidden font-sans text-lg font-medium text-white hover:text-white md:block"
            target="_blank"
          >
            <span class="tracking-wide">NineT </span>
            <span>Music</span>
          </router-link>
        </div>
        <div class="hidden md:block">
          <span
            class="hidden border-l border-primary-300 px-4 text-lg font-light text-white sm:px-6 lg:inline-block lg:px-8"
            >{{ portalName }}</span
          >
        </div>
      </div>
      <div class="hidden px-4 sm:px-6 md:block lg:px-8">
        <div class="ml-4 flex items-center gap-3">
          <!-- Profile dropdown -->
          <Dropdown :trigger="['click']" class="ml-3">
            <div class="flex cursor-pointer items-center gap-3">
              <Avatar :src="authStore.avatar" />
              <div>
                <div class="text-sm font-medium leading-none text-white">
                  {{ authStore.fullName }}
                </div>
                <div class="text-xs font-medium text-white/70">
                  {{ authStore.email }}
                </div>
              </div>
              <div class="text-white">
                <ChevronDownIcon class="ml-1 inline-block h-4 w-4 align-middle text-white" />
              </div>
            </div>
            <template #overlay>
              <Menu>
                <MenuItem>
                  <a class="block px-4 py-2 text-sm text-gray-700" href="javascript:" @click="onClickSignOut"
                    >Sign out</a
                  >
                </MenuItem>
              </Menu>
            </template>
          </Dropdown>
        </div>
      </div>
      <div class="-mr-2 flex md:hidden">
        <!-- Mobile menu button -->
        <DisclosureButton
          class="inline-flex items-center justify-center rounded-md bg-primary-600 p-2 text-white hover:bg-primary-500 hover:bg-opacity-75 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
        >
          <span class="sr-only">Open main menu</span>
          <MenuIcon v-if="!open" aria-hidden="true" class="block h-6 w-6" />
          <XIcon v-else aria-hidden="true" class="block h-6 w-6" />
        </DisclosureButton>
      </div>
    </div>

    <DisclosurePanel class="md:hidden">
      <div class="space-y-1 px-2 pt-2 pb-3 sm:px-3">
        <Navigation />
      </div>
      <div class="border-t border-primary-700 pt-4 pb-3">
        <div class="flex items-center px-5">
          <div class="flex-shrink-0">
            <img alt="" class="h-10 w-10 rounded-full" src="/tongmi.jpeg" />
          </div>
          <div class="ml-3">
            <div class="text-base font-medium text-white">
              {{ authStore.fullName }}
            </div>
            <div class="text-sm font-medium text-white">
              {{ authStore.email }}
            </div>
          </div>
          <button
            class="ml-auto flex-shrink-0 rounded-full bg-primary-600 p-1 text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
            type="button"
          >
            <span class="sr-only">View notifications</span>
            <BellIcon aria-hidden="true" class="h-6 w-6" />
          </button>
        </div>
        <div class="mt-3 space-y-1 px-2">
          <a
            v-for="item in userNavigation"
            :key="item.name"
            :href="item.href"
            class="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary-500 hover:bg-opacity-75"
            >{{ item.name }}</a
          >
        </div>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script lang="ts" setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { BellIcon, ChevronDownIcon, MenuIcon, XIcon } from "@heroicons/vue/outline";
import { Avatar, Dropdown, Menu, MenuItem, notification } from "ant-design-vue";
import { useAuthStore } from "@/stores/auth";
import Navigation from "@/layouts/partials/Navigation.vue";
import { AuthService } from "@/services/auth";
import { appLocalStorage } from "@/utils/storage";
import { AUTHORIZATION_KEY } from "@/utils/constants";
import { computed } from "vue";
import { toCapitalize } from "@/utils/utils";
import { Logo } from "@/components";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const portalName = computed(() => `${toCapitalize(authStore.roleText)} Portal`);

const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

const onClickSignOut = async () => {
  try {
    const token = appLocalStorage.getItem(AUTHORIZATION_KEY);
    if (token) {
      AuthService.logout().then(() => {
        appLocalStorage.removeItem(AUTHORIZATION_KEY);
        authStore.removeUser();
        router.push({ name: "login" });
      });
    }
  } catch (error) {
    notification.error({
      message: "Error",
      description: "An error occurred while signing out",
    });
  }
};
</script>
