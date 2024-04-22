<template>
  <div class="mx-auto max-w-xl py-8 pb-52">
    <section aria-labelledby="applicant-information-title">
      <div class="flex justify-between py-6">
        <div class="text-2xl font-bold text-gray-900">{{ id ? "Package Selected" : "Payment Add StarPoint" }}</div>
        <div class="text-sm font-medium text-gray-800">
          <router-link v-if="id" :to="{ name: 'premium' }"> Change package</router-link>
        </div>
      </div>
      <div class="bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <div id="applicant-information-title" class="text-xl font-medium leading-6 text-gray-900">
            {{ id ? packageDetail?.name : "Nạp " + formatPrice(priceStore.money) + " StarPoint với giá" }}
          </div>
          <div  id="applicant-information" class="py-2 text-lg font-medium leading-6 text-blue-700">
            {{ id ? formatPrice(packageDetail?.price) : formatPrice(priceStore.money * 5) }} VND
          </div>
          <div class="flex" v-if="id">
            <div>
              <CheckOutlined class="mr-3 text-lg" />
            </div>
            <p class="mt-1 mb-0 text-base font-normal text-gray-700" v-html="packageDetail?.description"></p>
          </div>
        </div>
      </div>
      <div class="mt-8 mb-4 max-w-2xl text-lg text-gray-900">Payment Methods:</div>
    </section>
    <div class="rounded-md">
      <Collapse v-model:activeKey="activeKey" accordion class="rounded-md">
        <CollapsePanel key="1" class="text-base font-medium text-gray-900" header="Bank Transfer">
          <div class="">Bank List:</div>
          <div class="grid grid-cols-5 py-3">
            <div class="rounded border border-gray-200 p-3">
              <img
                alt=""
                class="h-full w-full"
                src="https://res.cloudinary.com/albiceleste/image/upload/v1673462868/qivxov70pogwhbbni1rj.jpg"
              />
            </div>
          </div>
          <div class="mt-3 rounded border border-gray-200">
            <div class="p-3 text-center">Transfer Information</div>
            <div class="grid grid-cols-2">
              <div class="border-r border-t border-gray-200 p-3 font-normal">Transfer Contents</div>
              <div class="border-t border-gray-200 p-3 font-normal">
                {{ user?.lastName + " " + user?.firstName }} package transfer {{ packageDetail?.name }}
              </div>
            </div>
            <div class="grid grid-cols-2">
              <div class="border-r border-t border-gray-200 p-3 font-normal">Account Name</div>
              <div class="border-t border-gray-200 p-3 font-normal">Phạm Đức Thắng</div>
            </div>
            <div class="grid grid-cols-2">
              <div class="border-r border-t border-gray-200 p-3 font-normal">Account Number</div>
              <div class="border-t border-gray-200 p-3 font-normal">0843590380</div>
            </div>
            <div class="grid grid-cols-2">
              <div class="border-r border-t border-gray-200 p-3 font-normal">Bank Name</div>
              <div class="border-t border-gray-200 p-3 font-normal">Ngân hàng Quân Đội (MB Bank)</div>
            </div>
          </div>
        </CollapsePanel>
        <CollapsePanel
            v-if="id"
            key="2"
            class="text-base font-medium text-gray-900"
            header="Pay with Star Point"
        >
          <div class="grid grid-cols-6">
            <div class="text-xl font-medium leading-6 text-gray-900 col-span-4">
              {{ packageDetail?.name }}
            </div>
            <div class="text-xl font-medium leading-6 text-gray-900 col-span-2">
              Balance: <span :class="authStore.starPoint < packageDetail?.price / 5 ? 'text-red-700' : 'text-blue-700'">{{ formatPrice(authStore.starPoints) }} <StarFilled style="color: yellow"/></span>
            </div>
          </div>
          <div class="py-2 text-lg font-medium leading-6" >
            {{ formatPrice(packageDetail?.price / 5) }} <StarFilled style="color: yellow"/>
          </div>
          <Button class="text-lg font-medium h-12 w-full" shape="round" type="primary" :disabled="authStore.starPoint < packageDetail?.price / 5" @click="handlePay">
            Pay by balance
          </Button>
        </CollapsePanel>
        <BaseCheckout
          :package-id="packageDetail?.id ? packageDetail?.id : 0"
          :package-price="packageDetail?.price ? packageDetail?.price : priceStore.money * 5"
          :user-id="user?.id"
        >
        </BaseCheckout>
      </Collapse>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref,createVNode } from "vue";
import type { Package, User } from "@/types/models";
import { useRoute } from "vue-router";
import {StarFilled} from "@ant-design/icons-vue"
import { PackageService } from "@/services/package";
import {Collapse, CollapsePanel, Button,Modal,notification} from "ant-design-vue";
import { UserService } from "@/services/user";
import { CheckOutlined,ExclamationCircleOutlined  } from "@ant-design/icons-vue";
import BaseCheckout from "@/views/premium/BaseCheckout.vue";
import { useStarPointState } from "@/stores/star-point";
import {useAuthStore} from "@/stores/auth";
import {StarPointService} from "@/services/star-point";
import router from "@/router";



const authStore = useAuthStore();
const activeKey = ref([]);
const packageDetail = ref<Partial<Package> | null>();
const route = useRoute();
const id = route.params.id ? parseInt(route.params.id as string) : null;
const isLoading = ref(true);
const user = ref<User | null>(null);

const priceStore = useStarPointState();

onMounted(() => {
  userGetProfile();
  if (id) {
    PackageService.detail(id).then(({ data }) => {
      packageDetail.value = data.data;
      isLoading.value = false;
    });
  }
});

const formatPrice = (value: any) => {
  let val = (value / 1).toFixed(0).replace(".", ",");
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const userGetProfile = () => {
  UserService.getProfile().then(({ data }) => {
    user.value = data.data;
    isLoading.value = false;
  });
};

const handlePay = () => {
  Modal.confirm({
    title: 'Do you Want to buy package ' + packageDetail.value?.name + " ?",
    icon: createVNode(ExclamationCircleOutlined),
    content: createVNode('div', { style: 'color:red;' }, 'with ' + formatPrice(packageDetail.value?.price/5) +' star point'),
    onOk() {
      const data = {
        packageId: packageDetail.value?.id
      }
      StarPointService.buyWithStarPoint(data)
          .then((response) => {
            if (response.data.data){
              router.push({ name: "success" });
            }else {
              notification.error({message:"Your account isn't enough balance to pay this package !!"})
            }
          })
    },
  });
}
</script>

<style scoped></style>
