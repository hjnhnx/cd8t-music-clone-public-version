<template>
  <BaseTable
    v-model:pagination="pagination"
    :api="DraftSongService.list(pagination)"
    :columns="columns"
    :searchable="true"
    row-key="id"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'thumbnail'">
        <ImagePreview :image="record.thumbnail" :title="record.stageName" />
      </template>
      <template v-if="column.key === 'name'">
        <a :href="record.link">{{ record.name }}</a>
      </template>
    </template>
    <template #actions="{ record }">
      <router-link
        :to="{
          name: 'draftSongView',
          params: {
            id: record.id,
          },
        }"
      >
        Details
      </router-link>
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
import type { BaseTableColumn } from "@/components/base/BaseTable.vue";
import { h, ref } from "vue";
import type { PaginationRequest } from "@/types/pagination";
import { DraftSongService } from "@/services/draftSong";
import { notification, Popconfirm } from "ant-design-vue";
import router from "@/router";
import { SongService } from "@/services/song";

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
    customRender: ({ record }) => {
      return h("div", {
        innerHTML: `<a target="_blank" href="${record.link}">${record.name}</a>`,
      });
    },
  },
  {
    title: "Singer",
    dataIndex: "stageName",
  },
];

const onApprove = (id: string | number) =>
  SongService.verify(id as number).then(() => {
    notification.success({
      message: `Song approve successfully`,
    });

    return router.push({ name: "songList" });
  });
</script>

<style scoped></style>
