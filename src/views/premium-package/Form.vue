<template>
  <BasePageHeader />
  <Spin :spinning="isLoading">
    <BaseMain>
      <Form ref="formRef" :model="formState" :rules="rules" class="space-y-6" layout="vertical" @finish="onFinish">
        <TwoColumnsCard description="Package's identity and information" title="Package information">
          <BaseFormItem :col-span="6" label="Name" name="name">
            <Input v-model:value="formState.name" />
          </BaseFormItem>
          <BaseFormItem :col-span="2" label="Price" name="price">
            <input-number
              v-model:value="formState.price"
              :formatter="(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :min="0"
              :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
            />
          </BaseFormItem>
          <BaseFormItem :col-span="2" aria-valuemax="12" label="Month" name="month">
            <input-number v-model:value="formState.month" :max="12" :min="0" aria-valuemin="0" />
          </BaseFormItem>
          <BaseFormItem :col-span="2" label="Quantity Favorite" name="quantityFavorite">
            <input-number v-model:value="formState.quantityFavorite" :min="0" />
          </BaseFormItem>
          <BaseFormItem :col-span="12" :rules="[{ required: true }]" label="Description" name="description">
            <ckeditor
              v-model="formState.description"
              :config="editorConfig"
              :editor="editor"
              :style="{ maxHeight: '1000px' }"
            ></ckeditor>
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
import { Form, Input, InputNumber, notification, Spin } from "ant-design-vue";
import { BaseFormItem, BaseFormSubmit, BaseMain, BasePageHeader, TwoColumnsCard } from "@/components";
import type { Rule } from "ant-design-vue/es/form";
import { useRoute, useRouter } from "vue-router";
import { UserRole } from "@/types/enums";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { PackageService } from "@/services/package";

interface FormState {
  name: string;
  description: string;
  quantityFavorite: number | undefined;
  month: number | undefined;
  price: number | undefined;
}

const router = useRouter();
const route = useRoute();
const isLoading = ref<boolean>(false);
const formRef = ref<FormInstance>();
const editorConfig = {};
const editor = ClassicEditor;
const formState = reactive<FormState>({
  name: "",
  description: "",
  quantityFavorite: 0,
  month: 0,
  price: 0,
});

const routeId = Number.parseInt(String(route.params.id));

onMounted(() => {
  if (route.params.id) {
    isLoading.value = true;
    PackageService.detail(routeId).then(({ data }) => {
      formState.name = data.data.name;
      formState.month = data.data.month;
      formState.description = data.data.description;
      formState.quantityFavorite = data.data.quantityFavorite;
      formState.price = data.data.price;
      isLoading.value = false;
    });
  }
});

const rules: Record<string, Rule[]> = {
  name: [{ required: true }],
  month: [{ required: true }],
  description: [{ required: true }],
  quantityFavorite: [{ required: true }],
  price: [{ required: true }],
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
  PackageService.update(routeId, formData).then(() => {
    notification.success({
      message: `Package updated successfully`,
    });
    isLoading.value = false;
    router.push({ name: "packageList" });
  });
};

const create = (formValues: FormState) => {
  isLoading.value = true;
  const formData = {
    confirm,
    ...formValues,
    role: UserRole.ADMIN,
  };
  PackageService.store(formData).then(() => {
    notification.success({
      message: `Package created successfully`,
    });
    isLoading.value = false;
    router.push({ name: "packageList" });
  });
};
</script>

<style scoped>
:deep(.ck-editor__editable_inline) {
  min-height: 150px;
}
</style>
