<template>
  <Form :validate-messages="defaultValidateMessages" layout="vertical" v-bind="$attrs">
    <Card class="mr-auto max-w-4xl">
      <Spin :spinning="loading">
        <div class="grid gap-x-4 gap-y-2 md:grid-cols-12">
          <slot />
        </div>
      </Spin>
      <template #actions>
        <slot name="actions"></slot>
        <Button :loading="isSubmitting" html-type="submit" type="primary">Submit </Button>
      </template>
    </Card>
  </Form>
</template>

<script lang="ts" setup>
import { Form, Card, Button, Spin } from "ant-design-vue";
import { defaultValidateMessages } from "@/utils/validate";

defineProps<{
  loading?: boolean;
  isSubmitting?: boolean;
}>();
</script>

<style lang="less" scoped>
:deep(.ant-card-actions) {
  padding: 12px 24px;

  > li {
    text-align: right;
    margin: 0;

    > span {
      display: inline-block;
    }
  }
}
</style>
