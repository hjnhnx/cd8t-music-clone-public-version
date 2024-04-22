<template>
  <BasePageHeader :title="title">
    <template #actions>
      <div class="flex space-x-2">
        <slot name="headerActions" />
        <router-link :to="{ name: createRoute }">
          <Button v-if="createRoute" type="primary">Create</Button>
        </router-link>
      </div>
    </template>
    <slot name="headerContent" />
  </BasePageHeader>
  <slot name="filters"></slot>

  <BaseMain>
    <div v-if="searchable" class="mb-3 flex justify-end">
      <slot class="w-64" name="import"></slot>
      <div class="w-64">
        <Input v-model:value="keyword" placeholder="Search">
          <template #suffix>
            <SearchOutlined />
          </template>
        </Input>
      </div>
    </div>
    <Table
      :columns="antTableColumns"
      :data-source="tableData"
      :loading="isLoading"
      :pagination="false"
      :row-key="rowKey"
      :scroll="{ x: true }"
    >
      <template #bodyCell="{ column, text, index, record }">
        <template v-if="column.key === 'action'">
          <div class="flex flex-nowrap gap-3">
            <slot :index="index" :record="record" name="actions" />
            <router-link
              v-if="isEditShown(record)"
              :to="{
                name: editRoute,
                params: {
                  id: record[rowKey],
                },
              }"
              >Edit
            </router-link>
            <Popconfirm
              v-if="isDeleteShown(record)"
              cancel-text="No"
              ok-text="Yes"
              title="Are you sure you want to delete this?"
              @confirm="deleteItem(record[rowKey])"
            >
              <a href="javascript:"> Delete </a>
            </Popconfirm>
          </div>
        </template>
        <template v-else-if="column.displayType === 'date'">
          <div>{{ formatDate(text) }}</div>
        </template>
        <template v-else-if="column.displayType === 'datetime'">
          <div>{{ formatDatetime(text) }}</div>
        </template>
        <template v-else-if="column.displayType === 'time'">
          <div>{{ formatTime(text) }}</div>
        </template>
        <template v-else-if="column.displayType === 'image'">
          <ImagePreview :url="text" />
        </template>
        <template v-else-if="column.displayType === 'boolean'">
          <BooleanDisplay :value="text" />
        </template>
        <template v-else-if="column.displayType === 'custom'">
          <slot :column="column" :index="index" :record="record" :text="text" name="custom" />
        </template>
      </template>
    </Table>
    <Pagination
      v-if="pagination && isInitialFetchDone"
      :current="pagination.currentPage"
      :disabled="isLoading"
      :page-size="pagination.perPage"
      :show-total="(count) => `Total ${count} items`"
      :total="total"
      class="mt-4 text-right"
      show-less-items
      @change="onChange"
    />
  </BaseMain>
</template>

<script lang="ts" setup>
import { SearchOutlined } from "@ant-design/icons-vue";
import { ImagePreview, BaseMain, BasePageHeader, BooleanDisplay } from "@/components";
import { Table, Button, Pagination, notification, Input, Popconfirm } from "ant-design-vue";
import { computed, h, onMounted, ref, type VNode, watch, withDefaults } from "vue";
import { formatDate, formatDatetime, formatTime } from "@/utils/utils";
import { useSlots } from "vue";
import type { AxiosPromise } from "axios";
import type { PaginationRequest, PaginationResponse } from "@/types/pagination";
import type { ResponseData } from "@/types/models";
import { debounce } from "lodash";
import type { ColumnType } from "ant-design-vue/lib/table";

export interface BaseTableColumn {
  title?: string;
  fixed?: boolean;
  dataIndex?: string | (string | number)[];
  key?: string;
  className?: string;
  displayType?: "text" | "date" | "datetime" | "time" | "image" | "boolean" | "custom";
  customRender?: ({ text, record, index }: { text: never; record: unknown; index: number }) => VNode | string;
  sorter?: (a: never, b: never) => unknown;
  width?: string;
}

export interface BaseTableProps {
  api: AxiosPromise;
  columns: BaseTableColumn[];
  rowKey?: string;
  createRoute?: string;
  editRoute?: string;
  searchable?: boolean;
  onDelete?: (id: string | number) => AxiosPromise;
  onDataLoaded?: (data: unknown[]) => void;
  pagination?: PaginationRequest;
  title?: string;
  hideEdit?: (record: unknown) => boolean;
  hideDelete?: (record: unknown) => boolean;
}

const props = withDefaults(defineProps<BaseTableProps>(), {
  rowKey: "id",
});

const emits = defineEmits(["update:pagination"]);

const isEditShown = (record: unknown) => {
  const hideEdit = props.hideEdit ? props.hideEdit(record) : false;
  return props.editRoute && !hideEdit;
};
const isDeleteShown = (record: unknown) => {
  const hideDelete = props.hideDelete ? props.hideDelete(record) : false;
  return props.onDelete && !hideDelete;
};
const hasActionColumn = computed(() => {
  const slots = useSlots();
  return (props.editRoute && !props.hideEdit) || (props.onDelete && !props.hideDelete) || !!slots.actions;
});

const tableColumns = computed<BaseTableColumn[]>(() => {
  const columns = [
    ...props.columns
      .map((a) =>
        a.key
          ? a
          : {
              ...a,
              key: Array.isArray(a.dataIndex) ? a.dataIndex.join(".") : a.dataIndex,
            }
      )
      .map((a) =>
        a.className && !a.customRender
          ? {
              ...a,
              customRender: ({ text }: { text: never }) => {
                return h("div", {
                  innerHTML: text,
                  class: a.className,
                });
              },
            }
          : a
      ),
  ];
  if (hasActionColumn.value) {
    columns.push({
      title: "Action",
      key: "action",
    });
  }
  return columns;
});

const antTableColumns = computed<ColumnType[]>(() => tableColumns.value as ColumnType[]);

const tableData = ref<unknown[]>([]);
const total = ref(0);
const isLoading = ref(true);
const isInitialFetchDone = ref(false);
const currentPage = ref<number>();
const perPage = ref<number>();

const getList = () => {
  isLoading.value = true;
  props.api
    .then(({ data }) => {
      if (props.pagination) {
        const responseData = data as ResponseData<PaginationResponse<unknown>>;
        tableData.value = responseData.data.items;
        total.value = responseData.data.totalItems;
      } else {
        tableData.value = data;
      }
      if (props.onDataLoaded) {
        props.onDataLoaded(tableData.value);
      }
      isLoading.value = false;
      isInitialFetchDone.value = true;
    })
    .catch(({ message }) => {
      if (message) {
        notification.error({
          message,
        });
      }
      isLoading.value = false;
    });
};

onMounted(() => {
  getList();
});

const onChange = (page: number, pageSize: number) => {
  currentPage.value = page;
  perPage.value = pageSize;
  emits("update:pagination", {
    page: page,
    perPage: pageSize,
    keyword: keyword.value != "" ? keyword.value : null,
  });
};

const deleteItem = (id: string | number) => {
  if (!props.onDelete) {
    return;
  }
  props.onDelete(id).then(() => {
    notification.success({
      message: "Deleted successfully",
    });
    emits("update:pagination", {
      page: props.pagination?.currentPage,
      perPage: props.pagination?.perPage,
      keyword: keyword.value != "" ? keyword.value : null,
    });
  });
};

const keyword = ref<string>("");
const onSearch = () => {
  emits("update:pagination", {
    page: props.pagination?.currentPage,
    perPage: props.pagination?.perPage,
    keyword: keyword.value != "" ? keyword.value : null,
  });
};
watch(() => keyword.value, debounce(onSearch, 500));
watch(() => props.api, getList, { deep: true });
</script>
