<template>
  <div class="border-painting group relative max-w-full overflow-hidden sm:w-24 lg:w-32">
    <div :class="['hover:shine relative w-full', disabled ? '' : 'cursor-pointer']">
      <img :src="image ? image.sm : url" alt="" class="w-full" @click="handlePreview" />
    </div>
    <div
      v-if="removable"
      class="absolute top-0 right-0 flex h-5 w-5 translate-x-1/2 -translate-y-1/2 transform cursor-pointer items-center justify-center rounded-full bg-red-700 p-1"
      @click="onClickRemove"
    >
      <XIcon class="h-3 w-3 text-white" />
    </div>
    <Modal :footer="null" :title="title" :visible="previewVisible" @cancel="handleCancel">
      <img :src="image ? image.lg : url" alt="" style="width: 100%" />
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { XIcon } from "@heroicons/vue/outline";
import { ref } from "vue";
import { Modal } from "ant-design-vue";
import type { ResponsiveImage } from "@/types/models";

interface ImagePreviewProps {
  url?: string;
  image?: ResponsiveImage;
  removable?: boolean;
  title?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<ImagePreviewProps>(), {
  removable: false,
  title: "Preview",
});

const emits = defineEmits(["remove", "click"]);

const previewVisible = ref(false);

const handleCancel = () => {
  previewVisible.value = false;
};

const handlePreview = () => {
  if (props.disabled) return;
  previewVisible.value = true;
};

const onClickRemove = (e: Event) => {
  e.stopPropagation();
  emits("remove");
};
</script>
