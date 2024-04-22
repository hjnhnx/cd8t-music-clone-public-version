<template>
  <div class="pt-4">
    <div class="pl-4 pb-4">
      <span class="text-3xl font-semibold text-gray-900">{{ title }}</span>
    </div>
    <div class="grid grid-cols-5">
      <div v-for="(data, index) in categories" :key="data.id" class="col-span-1">
        <div class="p-4">
          <div class="wg-box-content relative h-52 w-full overflow-hidden">
            <router-link :to="{ name: 'clientDetailCategory', params: { id: data.id } }">
              <img
                :id="index"
                :src="data.banner"
                alt=""
                class="image-album-scale h-full w-full cursor-pointer rounded-md object-cover"
              />
              <div class="wg-box-content-overlay"></div>
              <div class="wg-box-content-details absolute flex w-full flex-row-reverse items-center justify-center">
                <div class="line-height-0 flex-initial rounded-full p-2">
                  <PlayCircleOutlined
                    class="line-height-0 scale-100 cursor-pointer text-3xl font-bold text-white transition-all hover:scale-110"
                  ></PlayCircleOutlined>
                </div>
              </div>
            </router-link>
          </div>
          <div class="w-52 py-2">
            <router-link :to="{ name: 'clientDetailCategory', params: { id: data.id } }">
              <div class="truncate text-base font-medium leading-6 text-gray-900 hover:text-sky-600">
                {{ data.name }}
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PlayCircleOutlined } from "@ant-design/icons-vue";
import type { Category } from "@/types/models";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { CategoryService } from "@/services/category";

interface BaseCategoryRandomProps {
  title?: string;
}

defineProps<BaseCategoryRandomProps>();
const categories = ref<Category[]>([]);
const user = useAuthStore();
const router = useRouter();
const isLoading = ref(true);

onMounted(() => {
  getListCategories();
});
const getListCategories = () => {
  CategoryService.random().then(({ data }) => {
    categories.value = data.data;
    isLoading.value = false;
  });
};
</script>

<style scoped>
.wg-box-content:hover .wg-box-content-overlay {
  opacity: 1;
}

.wg-box-content-details {
  position: absolute;
  text-align: center;
  padding-left: 1em;
  padding-right: 1em;
  width: 100%;
  top: 50%;
  left: 50%;
  opacity: 0;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  -webkit-transition: all 0.3s ease-in-out 0s;
  -moz-transition: all 0.3s ease-in-out 0s;
  transition: all 0.3s ease-in-out 0s;
}

.wg-box-content:hover .wg-box-content-details {
  top: 50%;
  left: 50%;
  opacity: 1;
}

.wg-box-content .wg-box-content-overlay {
  background: rgba(0, 0, 0, 0.4);
  position: absolute;
  border-radius: 4px;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  opacity: 0;
  -webkit-transition: all 0.4s ease-in-out 0s;
  -moz-transition: all 0.4s ease-in-out 0s;
  transition: all 0.4s ease-in-out 0s;
}

.image-album-scale:hover {
  transform: scale(1.1) !important;
}

.line-height-0 {
  line-height: 0;
}
</style>
