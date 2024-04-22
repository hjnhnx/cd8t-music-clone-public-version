<template>
  <Select
    :loading="isLoading"
    :options="options"
    :value="value"
    mode="multiple"
    placeholder="Select category"
    style="width: 100%"
    @change="onChange"
  ></Select>
</template>

<script lang="ts" setup>
import type { SelectProps } from "ant-design-vue";
import { Select } from "ant-design-vue";
import { computed } from "vue";
import { useCategoryStore } from "@/stores/category";
import type { Category } from "@/types/models";
import type { SelectValue } from "ant-design-vue/es/select";

interface CategorySelectProps {
  value?: number[];
}

defineProps<CategorySelectProps>();
const emits = defineEmits(["update:value"]);
const categoryStore = useCategoryStore();
const isLoading = computed(() => !categoryStore.hasFetched);

const categories = computed<Category[]>(() => categoryStore.categories);
const options = computed<SelectProps["options"]>(() =>
  categories.value.map((category) => ({
    value: category.id,
    label: category.name,
  }))
);
if (!categoryStore.hasFetched) {
  categoryStore.get();
}
const onChange = (value: SelectValue) => {
  emits("update:value", value);
};
</script>

<style scoped></style>
