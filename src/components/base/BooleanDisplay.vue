<template>
  <div class="inline-flex items-center">
    <CheckIcon v-if="!!value" class="h-6 w-6 text-green-600" />
    <XIcon v-else class="h-6 w-6 text-red-600" />
  </div>
</template>

<script lang="ts" setup>
import { CheckIcon, XIcon } from "@heroicons/vue/solid";

defineProps<{
  value: boolean | string | number | null;
}>();
</script>
