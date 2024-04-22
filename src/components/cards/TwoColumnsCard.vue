<template>
  <Card>
    <div class="lg:grid lg:grid-cols-4 lg:gap-6">
      <div class="lg:col-span-1">
        <h3 class="text-lg font-bold leading-6 text-gray-900">
          {{ title }}
        </h3>
        <p v-if="description || $slots.description" class="mt-1 text-sm text-gray-500">
          <slot name="description">
            {{ description }}
          </slot>
        </p>
      </div>
      <div class="mt-5 lg:col-span-3 lg:mt-0">
        <div class="grid gap-x-4 gap-y-2 lg:grid-cols-12">
          <slot />
        </div>
      </div>
    </div>
  </Card>
</template>

<script lang="ts" setup>
import { Card } from "ant-design-vue";

defineProps<{
  title: string;
  description?: string;
}>();
</script>
