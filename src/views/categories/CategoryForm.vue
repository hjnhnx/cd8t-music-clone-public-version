<template>
  <BasePageHeader />
  <Spin :spinning="isLoading">
    <BaseMain>
      <Form ref="formRef" :model="formState" :rules="rules" class="space-y-6" layout="vertical" @finish="onFinish">
        <TwoColumnsCard description="Category name and description" title="Category information">
          <BaseFormItem :col-span="6" label="Category name" name="name">
            <Input v-model:value="formState.name" />
          </BaseFormItem>
          <BaseFormItem :col-span="12" label="Banner" name="banner">
            <ImageUpload v-model="formState.banner" />
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
import { CategoryService } from "@/services/category";
import { useRoute, useRouter } from "vue-router";
import { UserRole } from "@/types/enums";

interface FormState {
  name: string;
  description: string;
  banner?: string;
}

const router = useRouter();
const route = useRoute();
const isLoading = ref<boolean>(false);
const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
  name: "",
  description: "",
  banner: "",
});

const routeId = Number.parseInt(String(route.params.id));

onMounted(() => {
  if (route.params.id) {
    isLoading.value = true;
    CategoryService.detail(routeId).then(({ data }) => {
      formState.name = data.data.name;
      formState.description = data.data.description;
      formState.banner = data.data.banner;
      isLoading.value = false;
    });
  }
});

const rules: Record<string, Rule[]> = {
  name: [{ required: true }],
  banner: [{ required: true }],
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
    role: UserRole.ADMIN,
  };
  CategoryService.update(routeId, formData).then(() => {
    notification.success({
      message: `Category updated successfully`,
    });
    isLoading.value = false;
    router.push({ name: "categoryList" });
  });
};

const create = (formValues: FormState) => {
  isLoading.value = true;
  const formData = {
    confirm,
    ...formValues,
    role: UserRole.ADMIN,
  };
  CategoryService.store(formData).then(() => {
    notification.success({
      message: `Category created successfully`,
    });
    isLoading.value = false;
    router.push({ name: "categoryList" });
  });
};
</script>
