<template>
  <BaseTable
    v-model:pagination="pagination"
    :api="AlbumService.list(pagination)"
    :columns="columns"
    :on-delete="onDelete"
    :searchable="true"
    create-route="albumCreate"
    edit-route="albumUpdate"
    row-key="id"
  >
  </BaseTable>
</template>

<script lang="ts" setup>
import { BaseTable } from "@/components";
import type { BaseTableColumn } from "@/components/base/BaseTable.vue";
import { ref } from "vue";
import { AlbumService } from "@/services/album";
import type { PaginationRequest } from "@/types/pagination";

const pagination = ref<PaginationRequest>({
  currentPage: 1,
  perPage: 10,
});
const columns: BaseTableColumn[] = [
  {
    title: "Thumbnail",
    dataIndex: "thumbnail",
    displayType: "image",
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

const onDelete = (id: string | number) => AlbumService.delete(id as number);
</script>

<style scoped></style>
