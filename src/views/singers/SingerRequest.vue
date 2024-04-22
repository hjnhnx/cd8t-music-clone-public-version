<template>
  <BaseTable
    v-model:pagination="pagination"
    :api="SingerService.singerRequest(pagination)"
    :columns="columns"
    :searchable="true"
    row-key="id"
  >
    <template #custom="{ column, text }">
      <template v-if="column.dataIndex === 'type'">
        {{ toCapitalize(SingerType[text]) }}
      </template>
    </template>
    <template #actions="{ record }">
      <div>
        <router-link :to="{ name: 'singerDetail', params: { id: record.id } }"> Details</router-link>
      </div>
      <Popconfirm
        cancel-text="No"
        ok-text="Yes"
        title="Are you sure you want to approve this?"
        @confirm="onApprove(record.id)"
      >
        <a href="javascript:"> Approve </a>
      </Popconfirm>
    </template>
  </BaseTable>
</template>

<script lang="ts" setup>
import { BaseTable } from "@/components";
import { notification, Popconfirm } from "ant-design-vue";
import type { BaseTableColumn } from "@/components/base/BaseTable.vue";
import { ref } from "vue";
import { SingerService } from "@/services/singer";
import { toCapitalize } from "@/utils/utils";
import { SingerType } from "@/types/enums";
import type { PaginationRequest } from "@/types/pagination";
import router from "@/router";

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

// const onApprove = (id: string | number) => SingerService.verify(id as number);
const onApprove = (id: string | number) =>
  SingerService.verify(id as number).then(() => {
    notification.success({
      message: `Singer approve successfully`,
    });
    router.push({ name: "singerList" });
  });
</script>

<style scoped></style>
