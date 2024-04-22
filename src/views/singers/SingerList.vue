<template>
  <BaseTable
    v-model:pagination="pagination"
    :api="SingerService.list(pagination)"
    :columns="columns"
    :on-delete="onDelete"
    :searchable="true"
    create-route="singerCreate"
    edit-route="singerUpdate"
    row-key="id"
  >
    <template #custom="{ column, text }">
      <template v-if="column.dataIndex === 'type'">
        {{ toCapitalize(SingerType[text]) }}
      </template>
    </template>
  </BaseTable>
</template>

<script lang="ts" setup>
import { BaseTable } from "@/components";
import type { BaseTableColumn } from "@/components/base/BaseTable.vue";
import { ref } from "vue";
import { SingerService } from "@/services/singer";
import { toCapitalize } from "@/utils/utils";
import { SingerType } from "@/types/enums";
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
    title: "Stage Name",
    dataIndex: "stageName",
  },
  {
    title: "Debut Time",
    dataIndex: "debutTime",
    displayType: "date",
  },
  {
    title: "Description",
    dataIndex: "description",
  },
  {
    title: "Identity Number",
    dataIndex: "identityNumber",
  },
  {
    title: "Type",
    dataIndex: "type",
    displayType: "custom",
  },
];

const onDelete = (id: string | number) => SingerService.delete(id as number);
</script>

<style scoped></style>
