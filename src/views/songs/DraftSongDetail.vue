<template>
  <BaseMain>
    <Spin :spinning="isLoading">
      <div v-if="draftSongDetail" class="grid grid-cols-1 gap-6 lg:grid-flow-col-dense lg:grid-cols-3">
        <div class="space-y-6 lg:col-span-2 lg:col-start-1">
          <section aria-labelledby="applicant-information-title">
            <div class="bg-white shadow sm:rounded-lg">
              <div class="px-4 py-5 sm:px-6">
                <h2 id="applicant-information-title" class="text-lg font-medium leading-6 text-gray-900">
                  Draft Song Information
                </h2>
                <p class="mt-1 mb-0 max-w-2xl text-sm text-gray-500">Information needed to become a draft song.</p>
              </div>
              <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <SingerDetailField label="Name">
                    {{ draftSongDetail?.name }}
                  </SingerDetailField>
                  <SingerDetailField label="Stage Name">
                    {{ draftSongDetail?.stageName }}
                  </SingerDetailField>
                  <SingerDetailField label="Author">
                    {{ draftSongDetail?.author ? draftSongDetail.author : "--" }}
                  </SingerDetailField>
                  <SingerDetailField label="Country">
                    {{ country }}
                  </SingerDetailField>
                  <SingerDetailField label="Category">
                    <span v-for="category in categories" :key="category.id">
                      <span>{{ category.name }}</span>
                      <span v-if="categories.length > 1 && category.id !== categories[categories.length - 1].id"
                        >,
                      </span>
                    </span>
                  </SingerDetailField>
                  <SingerDetailField label="Mp3">
                    <a :href="draftSongDetail.link" target="_blank">
                      <div class="truncate">{{ draftSongDetail?.link }}</div>
                    </a>
                  </SingerDetailField>
                  <SingerDetailField label="Thumbnail">
                    <div class="xl:col-span-7">
                      <a :href="draftSongDetail?.thumbnail" class="border-painting block" target="_blank">
                        <img
                          :alt="draftSongDetail?.name"
                          :src="draftSongDetail?.thumbnail"
                          class="min-w-full max-w-full cursor-pointer lg:w-96"
                        />
                      </a>
                    </div>
                  </SingerDetailField>
                </dl>
              </div>
            </div>
          </section>
        </div>
        <section aria-labelledby="applicant-information-title">
          <div class="bg-white shadow sm:rounded-lg">
            <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-8">
                <SingerDetailField label="Lyric">
                  <div v-html="draftSongDetail?.lyric"></div>
                </SingerDetailField>
              </dl>
            </div>
          </div>
        </section>
      </div>
    </Spin>
  </BaseMain>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { Spin } from "ant-design-vue";
import type { Category, DraftSong } from "@/types/models";
import SingerDetailField from "@/views/singers/components/SingerDetailField.vue";
import BaseMain from "@/components/base/BaseMain.vue";
import { DraftSongService } from "@/services/draftSong";
import { CountryService } from "@/services/country";
import { CategoryService } from "@/services/category";

const draftSongDetail = ref<Partial<DraftSong> | null>();
const country = ref("");
const categories = ref<Category[]>();
const route = useRoute();
const id = route.params.id ? parseInt(route.params.id as string) : null;
const isLoading = ref(true);

onMounted(async () => {
  if (id) {
    await DraftSongService.detail(id).then(({ data }) => {
      draftSongDetail.value = data.data;
      isLoading.value = false;
    });
    await countryDetail(Number(draftSongDetail.value?.countryId));
    await getAllCategory();
  }
});

const getAllCategory = async () => {
  await CategoryService.getAll().then(({ data }) => {
    categories.value = data.data.filter((e) => {
      return draftSongDetail.value?.categoryId?.includes(e.id);
    });
  });
};
const countryDetail = async (id: number) => {
  await CountryService.detail(id).then((data) => {
    country.value = data.data.data.name;
  });
};
</script>

<style scoped></style>
