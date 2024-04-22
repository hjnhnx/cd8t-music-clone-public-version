<template>
  <div class="cursor-pointer" @click="showModal">
    <ImagePreview :disabled="true" :title="submission.title" :url="submission.imageUrl?.lg" />
    <Modal
      v-if="submission.imageUrl"
      :visible="isModalVisible"
      cancel-text="Close"
      ok-text="View submission details"
      width="1000px"
      @cancel="closeModal"
      @ok="onOk"
    >
      <div v-if="isModalVisible" class="flex flex-col gap-x-12 gap-y-8 p-4 lg:flex-row">
        <div>
          <a :href="submission.imageUrl.xl" class="border-painting block" target="_blank">
            <img
              :alt="submission.title"
              :src="submission.imageUrl.lg"
              class="min-w-full max-w-full cursor-pointer lg:w-96"
            />
          </a>
        </div>
        <div class="flex flex-col justify-end gap-16">
          <div class="bottom-0 w-full">
            <div class="font-serif text-4xl font-bold text-gray-900">
              {{ submission.title }}
            </div>
            <div class="font- mt-4 max-w-md" v-html="submission.description" />
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { Modal } from "ant-design-vue";
import { ImagePreview } from "@/components";
import { ref } from "vue";
import type { Submission } from "@/types/models";
import { useRouter } from "vue-router";

const props = defineProps<{
  submission: Partial<Submission>;
}>();

const router = useRouter();
const isModalVisible = ref(false);

const showModal = () => {
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};

const onOk = () => {
  router.push({
    name: "submissionDetails",
    params: {
      id: props.submission.id,
    },
  });
};
</script>
