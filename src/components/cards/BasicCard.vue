<template>
  <Card class="mr-auto max-w-4xl">
    <div class="grid gap-x-4 gap-y-2 md:grid-cols-12">
      <slot />
    </div>
    <template #actions>
      <slot name="actions">
        <BaseFormSubmit v-bind="$attrs" />
      </slot>
    </template>
  </Card>
</template>

<script lang="ts" setup>
import { Card } from "ant-design-vue";
import { BaseFormSubmit } from "@/components";
</script>

<style lang="less" scoped>
:deep(.ant-card-actions) {
  padding: 16px 24px;

  > li {
    text-align: right;
    margin: 0;

    > span {
      display: block;
    }
  }
}
</style>
