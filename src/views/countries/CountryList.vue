<template>
  <BaseTable
    v-model:pagination="pagination"
    :api="CountryService.list(pagination)"
    :columns="columns"
    :on-delete="onDelete"
    :searchable="true"
    create-route="countryCreate"
    edit-route="countryUpdate"
    row-key="id"
  >
  </BaseTable>
</template>

<script lang="ts" setup>
import { BaseTable } from "@/components";
import type { BaseTableColumn } from "@/components/base/BaseTable.vue";
import { ref } from "vue";
import { CountryService } from "@/services/country";
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
];

const onDelete = (id: string | number) => CountryService.delete(id as number);
</script>

<style scoped></style>
