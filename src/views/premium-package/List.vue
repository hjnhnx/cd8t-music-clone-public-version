<template>
  <BaseTable
    v-model:pagination="pagination"
    :api="PackageService.list(pagination)"
    :columns="columns"
    :on-delete="onDelete"
    :searchable="true"
    create-route="packageCreate"
    edit-route="packageUpdate"
    row-key="id"
  >
  </BaseTable>
</template>

<script lang="ts" setup>
import { BaseTable } from "@/components";
import type { BaseTableColumn } from "@/components/base/BaseTable.vue";
import { ref } from "vue";
import { PackageService } from "@/services/package";
import type { PaginationRequest } from "@/types/pagination";

const pagination = ref<PaginationRequest>({
  currentPage: 1,
  perPage: 10,
});
const columns: BaseTableColumn[] = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Price",
    dataIndex: "price",
  },
  {
    title: "Month",
    dataIndex: "month",
  },
  {
    title: "Description",
    dataIndex: "description",
  },
  {
    title: "Quantity Favorite",
    dataIndex: "quantityFavorite",
  },
];

const onDelete = (id: string | number) => PackageService.delete(id as number);
</script>

<style scoped></style>
