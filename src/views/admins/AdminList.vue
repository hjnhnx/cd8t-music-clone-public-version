<template>
  <BaseTable
    v-model:pagination="pagination"
    :api="UserService.findAdmin(pagination)"
    :columns="columns"
    :on-delete="onDelete"
    :searchable="true"
    create-route="adminCreate"
    edit-route="adminUpdate"
    row-key="id"
  >
    <template #custom="{ column, text }">
      <template v-if="column.dataIndex === 'gender'">
        {{ toCapitalize(Gender[text]) }}
      </template>
    </template>
    <template #actions="{ record }">
      <router-link v-if="record.role === UserRole.USER" :to="{ name: 'addPackage', params: { id: record.id } }"
        >Add package
      </router-link>
    </template>
  </BaseTable>
</template>

<script lang="ts" setup>
import { BaseTable } from "@/components";
import type { BaseTableColumn } from "@/components/base/BaseTable.vue";
import type { User } from "@/types/models";
import { h, ref } from "vue";
import { UserService } from "@/services/user";
import { toCapitalize } from "@/utils/utils";
import { Gender, UserRole } from "@/types/enums";
import type { PaginationRequest } from "@/types/pagination";

const pagination = ref<PaginationRequest>({
  currentPage: 1,
  perPage: 10,
});
const columns: BaseTableColumn[] = [
  {
    title: "Full Name",
    dataIndex: "firstName",
    customRender: ({ record }) => {
      const staff = record as User;
      if (staff.packaged != null) {
        return h("div", {
          innerHTML: `${staff.firstName} ${staff.lastName} <span
            class="ml-1 inline-block rounded-sm bg-yellow-300 py-0 px-1 align-middle font-black text-red-700"
        style="font-size: 8px; right: 5px"
            >${staff.packaged?.name}</span>`,
        });
      } else {
        return h("div", {
          innerHTML: `${staff.firstName} ${staff.lastName}`,
        });
      }
    },
    className: "font-medium text-gray-900",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Gender",
    dataIndex: "gender",
    displayType: "custom",
  },
  {
    title: "Date Of Birth",
    dataIndex: "dateOfBirth",
    displayType: "date",
  },
];

const onDelete = (id: string | number) => UserService.delete(id as number);
</script>

<style scoped></style>
