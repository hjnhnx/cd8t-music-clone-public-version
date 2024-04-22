<template>
  <BaseMain>
    <Spin :spinning="isLoading">
      <div v-if="singerDetail" class="grid grid-cols-1 gap-6 lg:grid-flow-col-dense lg:grid-cols-3">
        <div class="space-y-6 lg:col-span-2 lg:col-start-1">
          <section aria-labelledby="applicant-information-title">
            <div class="bg-white shadow sm:rounded-lg">
              <div class="px-4 py-5 sm:px-6">
                <h2 id="applicant-information-title" class="text-lg font-medium leading-6 text-gray-900">
                  Singer Information
                </h2>
                <p class="mt-1 mb-0 max-w-2xl text-sm text-gray-500">Information needed to become a singer.</p>
              </div>
              <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <SingerDetailField label="Stage name">
                    {{ singerDetail?.stageName }}
                  </SingerDetailField>
                  <SingerDetailField label="Identity number">
                    {{ singerDetail?.identityNumber }}
                  </SingerDetailField>
                  <SingerDetailField label="Debut time">
                    {{ singerDetail ? formatDate(singerDetail?.debutTime) : "--" }}
                  </SingerDetailField>
                  <SingerDetailField label="Description">
                    {{ singerDetail?.description ? singerDetail?.description : "--" }}
                  </SingerDetailField>
                  <SingerDetailField label="Type">
                    {{ singerDetail ? formatSinger(singerDetail?.type) : "--" }}
                  </SingerDetailField>
                  <SingerDetailField label="Identity photo">
                    <div class="xl:col-span-7">
                      <a :href="singerDetail?.identityCardPhoto" class="border-painting block" target="_blank">
                        <img
                          :alt="singerDetail?.stageName"
                          :src="singerDetail?.identityCardPhoto"
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
            <div class="px-4 py-5">
              <div class="m-auto h-52 w-52">
                <Avatar :src="singerDetail.user.avatar" class="h-full w-full" />
              </div>
              <div class="mt-2 text-center text-lg font-medium leading-6 text-gray-900">
                {{ singerDetail?.user.firstName + " " + singerDetail?.user.lastName }}
              </div>
            </div>
            <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <SingerDetailField label="Email">
                  {{ singerDetail?.user.email }}
                </SingerDetailField>
                <SingerDetailField label="Phone number">
                  {{ singerDetail?.user.phoneNumber }}
                </SingerDetailField>
                <SingerDetailField label="Date of Birth">
                  {{ singerDetail ? formatDate(singerDetail?.user.dateOfBirth) : "--" }}
                </SingerDetailField>
                <SingerDetailField label="Gender">
                  {{ singerDetail ? formatGender(singerDetail?.user.gender) : "--" }}
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
import { Avatar, Spin } from "ant-design-vue";
import type { Singer } from "@/types/models";
import { SingerService } from "@/services/singer";
import SingerDetailField from "@/views/singers/components/SingerDetailField.vue";
import BaseMain from "@/components/base/BaseMain.vue";
import { formatDate, formatGender, formatSinger } from "@/utils/utils";

const singerDetail = ref<Partial<Singer> | null>();

const route = useRoute();
const id = route.params.id ? parseInt(route.params.id as string) : null;
const isLoading = ref(true);

onMounted(() => {
  if (id) {
    SingerService.detailRequest(id).then(({ data }) => {
      singerDetail.value = data.data;
      isLoading.value = false;
    });
  }
});
</script>

<style scoped></style>
