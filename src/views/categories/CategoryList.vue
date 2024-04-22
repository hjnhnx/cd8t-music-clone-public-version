<template>
  <BaseTable
    v-model:pagination="pagination"
    :api="CategoryService.list(pagination)"
    :columns="columns"
    :on-delete="onDelete"
    :searchable="true"
    create-route="categoryCreate"
    edit-route="categoryUpdate"
    row-key="id"
  >
  </BaseTable>
</template>

<script lang="ts" setup>
import { BaseTable } from "@/components";
import type { BaseTableColumn } from "@/components/base/BaseTable.vue";
import { ref } from "vue";
import { CategoryService } from "@/services/category";
import type { PaginationRequest } from "@/types/pagination";

const pagination = ref<PaginationRequest>({
  currentPage: 1,
  perPage: 10,
});
const columns: BaseTableColumn[] = [
  {
    title: "Id",
    dataIndex: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Description",
    dataIndex: "description",
  },
];

const onDelete = (id: string | number) => CategoryService.delete(id as number);
</script>

<style scoped></style>
