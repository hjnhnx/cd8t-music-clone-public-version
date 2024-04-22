<template>
  <BaseTable
    v-model:pagination="pagination"
    :api="PackageService.list(pagination)"
    :columns="columns"
    :searchable="true"
    row-key="id"
  >
    <template #custom="{ column, text }">
      <template v-if="column.dataIndex === 'month'"> {{ text }} Month </template>
    </template>
    <template #actions="{ record }">
      <a @click="addPackage(record.id)">Add</a>
    </template>
  </BaseTable>
</template>

<script lang="ts" setup>
import { BaseTable } from "@/components";
import type { BaseTableColumn } from "@/components/base/BaseTable.vue";
import { useRoute, useRouter } from "vue-router";
import type { UserPackage } from "@/types/models";
import { ref } from "vue";
import { notification } from "ant-design-vue";
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
    title: "Time",
    dataIndex: "month",
    displayType: "custom",
  },
];

const route = useRoute();
const router = useRouter();
const id = parseInt(route.params.id as string);

const addPackage = (packageId: number) => {
  const data: UserPackage = {
    userId: id,
    packageId: packageId,
  };
  PackageService.access(data).then(() => {
    notification.success({ message: "Add package success !!" });
    router.push({ name: "adminList" });
  });
};
</script>
