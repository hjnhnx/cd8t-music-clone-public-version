<template>
  <BasePageHeader />
  <Spin :spinning="isLoading">
    <BaseMain class="pb-40">
      <Form ref="formRef" :model="formState" :rules="rules" class="space-y-6" layout="vertical" @finish="onFinish">
        <TwoColumnsCard description="Album name and description" title="Album information">
          <BaseFormItem :col-span="6" label="Album name" name="name">
            <Input v-model:value="formState.name" />
          </BaseFormItem>
          <BaseFormItem :col-span="12" label="Thumbnail" name="thumbnail">
            <ImageUpload v-model="formState.thumbnail" />
          </BaseFormItem>
          <BaseFormItem :col-span="12" label="Description" name="description">
            <Textarea v-model:value="formState.description" />
          </BaseFormItem>
        </TwoColumnsCard>
        <BaseFormSubmit />
      </Form>
    </BaseMain>
  </Spin>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import type { FormInstance } from "ant-design-vue";
import { Form, Input, notification, Spin, Textarea } from "ant-design-vue";
import { BaseFormItem, BaseFormSubmit, BaseMain, BasePageHeader, ImageUpload, TwoColumnsCard } from "@/components";
import type { Rule } from "ant-design-vue/es/form";
import { AlbumService } from "@/services/album";
import { useRoute, useRouter } from "vue-router";
import { UserRole } from "@/types/enums";

interface FormState {
  name: string;
  description: string;
  thumbnail?: string;
}

const router = useRouter();
const route = useRoute();
const isLoading = ref<boolean>(false);
const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
  name: "",
  description: "",
  thumbnail: "",
});

const routeId = Number.parseInt(String(route.params.id));

onMounted(() => {
  if (route.params.id) {
    isLoading.value = true;
    AlbumService.detail(routeId).then(({ data }) => {
      formState.name = data.data.name;
      formState.description = data.data.description;
      formState.thumbnail = data.data.thumbnail;
      isLoading.value = false;
    });
  }
});

const rules: Record<string, Rule[]> = {
  name: [{ required: true }],
  thumbnail: [{ required: true }],
  description: [{ required: true }],
};

const onFinish = (formValues: FormState) => {
  if (route.params.id) {
    update(formValues);
  } else {
    create(formValues);
  }
};
const update = (formValues: FormState) => {
  isLoading.value = true;
  const formData = {
    confirm,
    ...formValues,
    role: UserRole.SINGER,
  };
  AlbumService.update(routeId, formData).then(() => {
    notification.success({
      message: `Album updated successfully`,
    });
    isLoading.value = false;
    router.push({ name: "profile" });
  });
};

const create = (formValues: FormState) => {
  isLoading.value = true;
  const formData = {
    confirm,
    ...formValues,
    role: UserRole.SINGER,
  };
  AlbumService.store(formData).then(() => {
    notification.success({
      message: `Album created successfully`,
    });
    isLoading.value = false;
    router.push({ name: "profile" });
  });
};
</script>
