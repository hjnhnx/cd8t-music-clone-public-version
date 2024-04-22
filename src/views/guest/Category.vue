<template>
  <Spin :spinning="isLoading">
    <div class="p-5 pb-52">
      <div class="pb-10">
        <div class="overflow-hidden rounded p-4">
          <img
            alt=""
            class="h-80 w-full rounded-md object-cover"
            src="https://res.cloudinary.com/albiceleste/image/upload/v1674006522/cutpaauuikijz9huk85b.png"
          />
        </div>
        <div class="pl-4">
          <span class="text-3xl text-gray-900">Countries</span>
        </div>
        <div class="grid grid-cols-4">
          <div v-for="(country, index) in countries" :id="index" :key="country.id" class="col-span-1 py-4">
            <div class="">
              <div class="h-44 w-full overflow-hidden p-4 pb-2 pt-0">
                <router-link :to="{ name: 'clientDetailCountry', params: { id: country.id } }">
                  <img
                    :alt="country.name"
                    :src="country.image"
                    class="h-full w-full cursor-pointer rounded-md object-cover"
                  />
                </router-link>
              </div>
              <div class="pl-4">
                <router-link :to="{ name: 'clientDetailCountry', params: { id: country.id } }">
                  <div class="truncate text-base font-medium leading-6 text-gray-900 hover:text-sky-600">
                    {{ country.name }}
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <Pagination
          v-if="totalCountries > 10"
          :current="paginationCountry.page"
          :disabled="isLoading"
          :page-size="sizeCountry"
          :show-total="(count) => `Total ${count} items`"
          :total="totalCountries"
          class="pr-5 text-right"
          show-less-items
          @change="onChangeCountry"
        />
      </div>
      <div>
        <div class="pl-4">
          <span class="text-3xl text-gray-900">Categories</span>
        </div>
        <div class="grid grid-cols-5">
          <div v-for="(data, index) in categories" :key="data.id" class="col-span-1 py-4">
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
                    <div class="icon-menu-album line-height-0 flex-initial rounded-full p-2"></div>
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
        <Pagination
          v-if="totalCategories > 10"
          :current="pagination.page"
          :disabled="isLoading"
          :page-size="sizeCategory"
          :show-total="(count) => `Total ${count} items`"
          :total="totalCategories"
          class="pr-5 text-right"
          show-less-items
          @change="onChange"
        />
      </div>
    </div>
  </Spin>
</template>

<script lang="ts" setup>
import { Pagination, Spin } from "ant-design-vue";
import { PlayCircleOutlined } from "@ant-design/icons-vue";
import { CategoryService } from "@/services/category";
import { CountryService } from "@/services/country";
import { onMounted, ref } from "vue";
import type { Category, Country } from "@/types/models";
import type { PageRequest } from "@/types/pagination";

const isLoading = ref<boolean>(false);
const categories = ref<Category[]>([]);
const totalCategories = ref(0);
const sizeCategory = ref(0);
const countries = ref<Country[]>([]);
const totalCountries = ref(0);
const sizeCountry = ref(0);
const paginationCountry = ref<PageRequest>({
  page: 1,
  size: 8,
});
const pagination = ref<PageRequest>({
  page: 1,
});

onMounted(() => {
  getListCategories();
  getListCountries();
});

const getListCategories = () => {
  CategoryService.listClient(pagination.value).then(({ data }) => {
    categories.value = data.data.items;
    totalCategories.value = data.data.totalItems;
    sizeCategory.value = data.data.size;
  });
};
const getListCountries = () => {
  CountryService.listClient(paginationCountry.value).then(({ data }) => {
    countries.value = data.data.items;
    totalCountries.value = data.data.totalItems;
    sizeCountry.value = data.data.size;
  });
};
const onChange = (page: number) => {
  pagination.value.page = page;
  getListCategories();
};
const onChangeCountry = (page: number) => {
  paginationCountry.value.page = page;
  getListCountries();
};
</script>

<style scoped>
#form_item_description {
  min-height: 150px;
}

.example::-webkit-scrollbar {
  display: none;
}

#main > * {
  @apply pt-12;
}

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

.wg-box-content-details-country {
  position: absolute;
  text-align: center;
  padding-left: 1em;
  padding-right: 1em;
  width: 100%;
  top: 50%;
  left: 50%;
  opacity: 1;
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

.icon-menu-album:hover {
  background-color: hsla(0, 0%, 100%, 0.3);
}

.line-height-0 {
  line-height: 0;
}

.media-item {
  border-bottom: 1px rgba(0, 0, 0, 0.08) solid;
}

.media-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
