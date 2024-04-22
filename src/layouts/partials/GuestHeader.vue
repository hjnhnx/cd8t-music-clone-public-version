<template>
  <Disclosure v-slot="{ open }" as="nav" class="fixed inset-x-0 top-0 bg-primary-600">
    <div class="flex h-16 w-full items-center justify-between px-4 sm:px-6 md:px-0">
      <div class="flex">
        <div class="flex w-64 items-center justify-start space-x-1 px-4">
          <div class="flex w-64 items-center justify-center gap-2 space-x-1 px-4">
            <Logo class="h-6 w-6 text-white" fill="currentcolor" style="filter: brightness(0) invert(1)" />
            <router-link
              :to="{ name: 'home' }"
              class="hidden font-sans text-lg font-medium text-white hover:text-white md:block"
              target="_blank"
            >
              <span class="tracking-wide">NineT </span>
              <span>Music</span>
            </router-link>
          </div>
        </div>
        <!--        <div class="hidden md:flex">-->
        <!--          <InputGroup compact class="w-96">-->
        <!--            <Input style="width: calc(100% - 150px)"></Input>-->
        <!--            <Button>Search</Button>-->
        <!--          </InputGroup>-->
        <!--        </div>-->
      </div>
      <div class="hidden px-4 sm:px-6 md:block lg:px-8">
        <div class="ml-4 flex items-center gap-3">
          <!-- Profile dropdown -->
          <Dropdown v-if="authStore.fullName" :trigger="['click']" class="ml-3">
            <div class="relative flex cursor-pointer items-center gap-3">
              <div
                v-if="authStore.package != null"
                class="absolute z-10 h-4 w-4 rotate-45"
                style="top: -5px; left: 22px"
              >
                <img
                  alt=""
                  class="h-full w-full"
                  src="https://res.cloudinary.com/albiceleste/image/upload/v1675648443/pz8vicfnqik9aphavvol.png"
                />
              </div>
              <Avatar :src="authStore.avatar" class="relative"></Avatar>
              <div>
                <div class="text-sm font-medium leading-none text-white">
                  {{ authStore.fullName }}
                  <span
                    v-if="authStore.package != null"
                    class="absolute top-0 right-0 block w-7 truncate rounded-sm bg-yellow-300 font-black text-red-700"
                    style="font-size: 8px; padding: 2px 3px 3px 3px"
                    >{{ authStore.package?.name }}</span
                  >
                </div>
                <div>
                  <span style="color: white; font-weight: bolder; margin-right: 5px">{{
                    formatPrice(authStore.starPoints)
                  }}</span>
                  <star-filled style="color: yellow" />
                </div>
              </div>
              <div class="text-white">
                <ChevronDownIcon class="ml-1 inline-block h-4 w-4 align-middle text-white" />
              </div>
            </div>
            <template #overlay>
              <Menu>
                <MenuItem>
                  <a class="block px-4 py-2 text-sm text-gray-700" href="javascript:" @click="onClickProfile"
                    >Profile</a
                  >
                </MenuItem>
                <MenuItem>
                  <a class="block px-4 py-2 text-sm text-gray-700" href="javascript:" @click="showModal"
                    >Recharge StarPoint</a
                  >
                  <Modal
                    v-model:visible="visible"
                    :confirm-loading="confirmLoading"
                    ok-text="Recharge"
                    title="Recharge Star Point"
                    @ok="handleOk"
                  >
                    <p style="font-weight: bolder">Amount Start Point Want To Recharge</p>
                    <InputNumber id="inputNumber" v-model:value="price" :min="1000" :step="1000" style="width: 100%" />
                    <p style="color: red; font-weight: bolder">* Exchange</p>
                    <p style="font-weight: bolder">
                      {{ formatPrice(price) }}
                      <star-filled style="color: blueviolet" />
                      =
                      {{ formatPrice(price * 5) }} VNĐ
                    </p>
                  </Modal>
                </MenuItem>
                <MenuItem>
                  <a class="block px-4 py-2 text-sm text-gray-700" href="javascript:" @click="onClickSignOut"
                    >Sign out</a
                  >
                </MenuItem>
              </Menu>
            </template>
          </Dropdown>
          <router-link v-else :to="{ name: 'dashboard' }">
            <button
              class="border border-white px-4 py-2 font-semibold uppercase text-white transition-colors duration-500 hover:bg-white hover:text-gray-900"
            >
              <span class="hidden sm:inline">Login</span>
              <span class="sm:hidden">Login</span>
            </button>
          </router-link>
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
            <img :alt="authStore.fullName" :src="authStore.avatar" class="h-10 w-10 rounded-full" />
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
import { ref } from "vue";
import { StarFilled } from "@ant-design/icons-vue";
import { Avatar, Button, Dropdown, InputNumber, Menu, MenuItem, Modal, notification } from "ant-design-vue";
import { useAuthStore } from "@/stores/auth";
import Navigation from "@/layouts/partials/Navigation.vue";
import { useRouter } from "vue-router";
import { useStarPointState } from "@/stores/star-point";
import { appLocalStorage } from "@/utils/storage";
import { AUTHORIZATION_KEY } from "@/utils/constants";
import { AuthService } from "@/services/auth";
import { Logo } from "@/components";

const authStore = useAuthStore();
const router = useRouter();
const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];
const visible = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);
const price = ref<number>(1000);
const priceStore = useStarPointState();

const showModal = () => {
  visible.value = true;
  console.log(visible);
};

const handleOk = (e: MouseEvent) => {
  console.log(e);
  confirmLoading.value = true;
  setTimeout(() => {
    visible.value = false;
    confirmLoading.value = false;
  }, 2000);
  priceStore.setPrice(price.value);
  router.push({ name: "recharge-star-point" });
};

const onClickProfile = () => {
  router.push({ name: "profile" });
};

const formatPrice = (value: any) => {
  let val = (value / 1).toFixed(0).replace(".", ",");
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

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
