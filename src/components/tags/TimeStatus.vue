<template>
  <div class="uppercase">
    <Tag v-if="isCurrent" color="#0d9488">Ongoing</Tag>
    <Tag v-if="isFuture" color="#9333ea">Future</Tag>
    <Tag v-if="isPast" color="#dc2626">Past</Tag>
  </div>
</template>

<script lang="ts" setup>
import { Tag } from "ant-design-vue";
import type { Dayjs } from "dayjs";
import { computed } from "vue";
import dayjs from "dayjs";

const props = defineProps<{
  startDate: string | Dayjs;
  endDate: string | Dayjs;
  startTime?: number;
  endTime?: number;
}>();

const isCurrent = computed(() => {
  return (
    dayjs(props.startDate).add(props.startTime || 0, "minutes") <= dayjs() &&
    dayjs(props.endDate).add(props.endTime || 0, "minutes") >= dayjs()
  );
});

const isFuture = computed(() => {
  return dayjs(props.startDate).add(props.startTime || 0, "minutes") > dayjs();
});

const isPast = computed(() => {
  return dayjs(props.endDate).add(props.endTime || 0, "minutes") < dayjs();
});
</script>
