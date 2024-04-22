<template>
  <Select
    :loading="isLoading"
    :options="options"
    :value="value"
    mode="multiple"
    placeholder="Select singer"
    style="width: 100%"
    @change="onChange"
  ></Select>
</template>

<script lang="ts" setup>
import type { SelectProps } from "ant-design-vue";
import { Select } from "ant-design-vue";
import { computed } from "vue";
import { useSingerStore } from "@/stores/singer";
import type { SelectValue } from "ant-design-vue/es/select";
import type { Singer } from "@/types/models";
import { useAuthStore } from "@/stores/auth";

interface SingerSelectProps {
  value?: number[];
}

defineProps<SingerSelectProps>();
const emits = defineEmits(["update:value"]);
const singerStore = useSingerStore();
const authStore = useAuthStore();
const isLoading = computed(() => !singerStore.hasFetched);

const singers = computed<Singer[]>(() => singerStore.singers);
const options = computed<SelectProps["options"]>(() =>
  singers.value
    .filter((e) => e.id !== authStore.singerId)
    .map((singer) => ({
      value: singer.id,
      label: singer.stageName,
    }))
);
if (!singerStore.hasFetched) {
  singerStore.get();
}
const onChange = (value: SelectValue) => {
  emits("update:value", value);
};
</script>

<style scoped></style>
