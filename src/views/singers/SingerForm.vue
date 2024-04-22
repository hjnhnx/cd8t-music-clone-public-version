<template>
  <BasePageHeader />
  <Spin :spinning="isLoading">
    <BaseMain>
      <Form ref="formRef" :model="formState" :rules="rules" class="space-y-6" layout="vertical" @finish="onFinish">
        <TwoColumnsCard description="Singer's identity and information" title="Singer information">
          <BaseFormItem :col-span="6" label="Stage name" name="stageName">
            <Input v-model:value="formState.stageName" />
          </BaseFormItem>
          <BaseFormItem :col-span="6" label="Identity number" name="identityNumber">
            <Input v-model:value="formState.identityNumber" />
          </BaseFormItem>
          <BaseFormItem :col-span="2" label="Type" name="gender">
            <Select v-model:value="formState.type" :options="types" class="w-full" />
          </BaseFormItem>
          <BaseFormItem :col-span="4" label="Date of birth" name="debutTime">
            <DatePicker
              v-model:value="formState.debutTime"
              :disabled-date="disabledDebutTime"
              :format="DISPLAY_DATE_FORMAT"
              style="width: 100%"
            />
          </BaseFormItem>
          <BaseFormItem :col-span="6" label="Identity card photo" name="identityCardPhoto">
            <ImageUpload v-model="formState.identityCardPhoto" />
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
import type { FormInstance, SelectProps } from "ant-design-vue";
import { DatePicker, Form, Input, notification, Select, Spin, Textarea } from "ant-design-vue";
import { BaseFormItem, BaseFormSubmit, BaseMain, BasePageHeader, ImageUpload, TwoColumnsCard } from "@/components";
import { DB_DATE_FORMAT, DISPLAY_DATE_FORMAT } from "@/utils/constants";
import type { Rule } from "ant-design-vue/es/form";
import { SingerService } from "@/services/singer";
import { useRoute, useRouter } from "vue-router";
import dayjs, { Dayjs } from "dayjs";
import { SingerType, UserRole } from "@/types/enums";

interface FormState {
  stageName: string;
  identityCardPhoto: string;
  identityNumber?: number;
  debutTime: Dayjs;
  type?: number;
  description: string;
}

const router = useRouter();
const route = useRoute();
const isLoading = ref<boolean>(false);
const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
  stageName: "",
  identityNumber: undefined,
  description: "",
  type: undefined,
  debutTime: dayjs(),
  identityCardPhoto: "",
});

const routeId = Number.parseInt(String(route.params.id));

const disabledDebutTime = (debutTime: Dayjs) => {
  return debutTime && debutTime > dayjs().add(-1, "day").endOf("day");
};

const types = ref<SelectProps["options"]>([
  { value: SingerType.GROUP, label: "GROUP" },
  { value: SingerType.SOLO, label: "SOLO" },
]);

onMounted(() => {
  if (route.params.id) {
    isLoading.value = true;
    SingerService.detail(routeId).then(({ data }) => {
      formState.stageName = data.data.stageName;
      formState.identityNumber = data.data.identityNumber;
      formState.description = data.data.description;
      formState.type = data.data.type;
      formState.identityCardPhoto = data.data.identityCardPhoto;
      formState.debutTime = dayjs(data.data.debutTime);
      isLoading.value = false;
    });
  }
});

const rules: Record<string, Rule[]> = {
  stageName: [{ required: true }],
  identityNumber: [{ required: true }],
  type: [{ required: true }],
  identityCardPhoto: [{ required: true }],
  debutTime: [{ required: true }],
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
    debutTime: formValues.debutTime?.format(DB_DATE_FORMAT),
  };
  SingerService.update(routeId, formData).then(() => {
    notification.success({
      message: `Singer updated successfully`,
    });
    isLoading.value = false;
    router.push({ name: "singerList" });
  });
};

const create = (formValues: FormState) => {
  isLoading.value = true;
  const formData = {
    confirm,
    ...formValues,
    role: UserRole.ADMIN,
    debutTime: formValues.debutTime?.format(DB_DATE_FORMAT),
  };
  SingerService.store(formData).then(() => {
    notification.success({
      message: `Singer created successfully`,
    });
    isLoading.value = false;
    router.push({ name: "singerList" });
  });
};
</script>
