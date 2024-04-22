<template>
  <BaseTable
    v-model:pagination="pagination"
    :api="SongService.list(pagination)"
    :columns="columns"
    :on-delete="onDelete"
    :searchable="true"
    create-route="songCreate"
    edit-route="songUpdate"
    row-key="id"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'thumbnail'">
        <ImagePreview :image="record.thumbnail" :title="record.stageName" />
      </template>
    </template>
  </BaseTable>
</template>

<script lang="ts" setup>
import { BaseTable } from "@/components";
import type { BaseTableColumn } from "@/components/base/BaseTable.vue";
import { ref } from "vue";
import { SongService } from "@/services/song";
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
    title: "Singer",
    dataIndex: "stageName",
  },
  {
    title: "Thumbnail",
    dataIndex: "thumbnail",
    displayType: "image",
  },
];

const onDelete = (id: string | number) => SongService.delete(id as number);
</script>

<style scoped></style>
