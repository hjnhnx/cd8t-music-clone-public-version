<template>
  <div class="flex items-center justify-between">
    <div>
      <Popconfirm
        v-if="onDelete"
        :cancel-button-props="{ size: 'middle' }"
        :ok-button-props="{ size: 'middle' }"
        title="Are you sure you want to delete this?"
        @confirm="onDelete"
      >
        <span class="inline-block cursor-pointer font-medium text-gray-700 hover:text-primary-600">
          {{ deleteText || "Delete" }}
        </span>
      </Popconfirm>
    </div>
    <div class="flex gap-x-2">
      <Button v-if="showBackButton" html-type="button" @click="onClickBack">Back </Button>
      <Button v-if="showSubmitButton" :loading="loading" html-type="submit" type="primary">Submit </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Button, Popconfirm } from "ant-design-vue";

export interface BaseFormSubmitProps {
  showSubmitButton?: boolean;
  showBackButton?: boolean;
  onDelete?: (() => void) | null;
  deleteText?: string;
  loading?: boolean;
}

withDefaults(defineProps<BaseFormSubmitProps>(), {
  showSubmitButton: true,
  showBackButton: true,
});

const onClickBack = () => {
  window.history.back();
};
</script>
