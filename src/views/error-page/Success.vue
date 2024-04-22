<template>
  <Result status="success" title="Successfully!">
    <template #extra>
      <a href="/">
        <Button type="primary">Back Home</Button>
      </a>
    </template>
  </Result>
</template>

<script lang="ts" setup>
import "ant-design-vue/dist/antd.css";
import { Result, Button } from "ant-design-vue";
</script>

<style scoped></style>
