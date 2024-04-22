<template>
  <main :class="disabled ? 'relative' : ''" class="mx-auto px-4 py-6 sm:px-6 md:px-8">
    <slot />
    <div v-if="disabled" class="absolute inset-0 z-50" @click="onClickMask"></div>
  </main>
</template>

<script lang="ts" setup>
import { notification } from "ant-design-vue";

const props = defineProps<{
  disabled?: boolean;
  maskMessage?: string;
}>();

const emit = defineEmits(["clickMask"]);

const onClickMask = () => {
  notification.error({
    message: props.maskMessage || "You do not have the permission to update this",
  });
  emit("clickMask");
};
</script>
