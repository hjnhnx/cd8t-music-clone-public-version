<template>
  <Spin :spinning="isLoading">
    <BaseMain class="pb-40">
      <div class="pb-4">
        <div class="text-center text-4xl font-bold text-gray-800">Choose Premium for you</div>
        <div class="mx-auto max-w-lg py-2 text-center text-lg text-gray-800">
          High-quality online music service, combined with exclusive facilities for VIP members
        </div>
      </div>
      <div class="mx-auto max-w-6xl">
        <div class="grid grid-cols-3">
          <div v-for="(data, index) in packages" :key="data.id" class="mx-2 p-4">
            <div class="grid h-full content-between rounded-xl bg-white p-4 shadow sm:rounded-lg">
              <div>
                <div :id="index" class="py-3 text-4xl font-medium">
                  {{ data.name }}
                </div>
                <div class="package-info">
                  <div class="package__month text-2xl font-medium">{{ data.month }} MONTH</div>
                  <div class="package__month text-2xl font-medium text-blue-600">
                    {{ data.price.toLocaleString("vi-VN") }} VND
                  </div>
                  <div class="package-line max-w mx-auto my-3"></div>
                </div>
                <div class="py-3">
                  <div class="flex">
                    <div>
                      <CheckOutlined class="mr-3 text-lg" />
                    </div>
                    <p class="text-base text-gray-900" v-html="data.description"></p>
                  </div>
                </div>
              </div>
              <div class="pb-8">
                <router-link :to="{ name: 'premiumDetail', params: { id: data.id } }">
                  <Button
                    :size="size"
                    class="h-12 w-full text-lg font-medium"
                    shape="round"
                    type="primary"
                    :disabled="user.package?.price >= data.price"
                  >
                    GET BUY
                  </Button>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseMain>
  </Spin>
</template>

<script lang="ts" setup>
import { BaseMain } from "@/components";
import { Button, notification, Spin } from "ant-design-vue";
import { onMounted, ref } from "vue";
import { CheckOutlined } from "@ant-design/icons-vue";
import { PackageService } from "@/services/package";
import type { Package } from "@/types/models";
import type { PaginationRequest } from "@/types/pagination";
import { useAuthStore } from "@/stores/auth";

const isLoading = ref<boolean>(false);
const packages = ref<Package[]>([]);
const user = useAuthStore();

const pagination = ref<PaginationRequest>({
  currentPage: 1,
  perPage: 10,
});

onMounted(() => {
  getList();
});

const splitted = ref<[]>([]);
const getList = () => {
  isLoading.value = true;
  PackageService.list(pagination.value)
    .then(({ data }) => {
      packages.value = data.data.items;
      // splitted.value = Array.from(data.data.items.description.split(". ", 3));
      console.log("splitted: ", splitted);
      isLoading.value = false;
    })
    .catch(({ message }) => {
      if (message) {
        notification.error({
          message,
        });
      }
      isLoading.value = false;
    });
};
</script>
<style>
.package-container {
  box-shadow: 0px 2px 11px 3px rgb(0 0 0 / 20%);
}

.package-line {
  height: 1px;
  display: block;
  border: solid 1px #979797;
}
</style>
