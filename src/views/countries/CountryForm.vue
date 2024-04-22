<template>
  <BasePageHeader />
  <Spin :spinning="isLoading">
    <BaseMain>
      <Form ref="formRef" :model="formState" :rules="rules" class="space-y-6" layout="vertical" @finish="onFinish">
        <TwoColumnsCard description="" title="Country information">
          <BaseFormItem :col-span="6" label="Country name" name="name">
            <Input v-model:value="formState.name" />
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
import { Form, Input, notification, Spin } from "ant-design-vue";
import { BaseFormItem, BaseFormSubmit, BaseMain, BasePageHeader, ImageUpload, TwoColumnsCard } from "@/components";
import type { Rule } from "ant-design-vue/es/form";
import { CountryService } from "@/services/country";
import { useRoute, useRouter } from "vue-router";
import { UserRole } from "@/types/enums";

interface FormState {
  name: string;
}

const router = useRouter();
const route = useRoute();
const isLoading = ref<boolean>(false);
const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
  name: "",
});

const routeId = Number.parseInt(String(route.params.id));

onMounted(() => {
  if (route.params.id) {
    isLoading.value = true;
    CountryService.detail(routeId).then(({ data }) => {
      formState.name = data.data.name;
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
  CountryService.update(routeId, formData).then(() => {
    notification.success({
      message: `Country updated successfully`,
    });
    isLoading.value = false;
    router.push({ name: "countryList" });
  });
};

const create = (formValues: FormState) => {
  isLoading.value = true;
  const formData = {
    confirm,
    ...formValues,
    role: UserRole.ADMIN,
  };
  CountryService.store(formData).then(() => {
    notification.success({
      message: `Country created successfully`,
    });
    isLoading.value = false;
    router.push({ name: "countryList" });
  });
};
</script>
