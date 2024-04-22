<template>
  <BasePageHeader />
  <Spin :spinning="isLoading">
    <BaseMain>
      <Form ref="formRef" :model="formState" :rules="rules" class="space-y-6" layout="vertical" @finish="onFinish">
        <TwoColumnsCard description="Identity and contact information of the user" title="Basic information">
          <BaseFormItem :col-span="6" label="First name" name="firstName">
            <Input v-model:value="formState.firstName" />
          </BaseFormItem>
          <BaseFormItem :col-span="6" label="Last name" name="lastName">
            <Input v-model:value="formState.lastName" />
          </BaseFormItem>
          <BaseFormItem :col-span="2" label="Gender" name="gender">
            <Select v-model:value="formState.gender" :options="genders" class="w-full" />
          </BaseFormItem>
          <BaseFormItem :col-span="4" label="Date of birth" name="dateOfBirth">
            <DatePicker
              v-model:value="formState.dateOfBirth"
              :disabled-date="disabledBirthday"
              :format="DISPLAY_DATE_FORMAT"
              style="width: 100%"
            />
          </BaseFormItem>
          <BaseFormItem :col-span="4" label="Email" name="email">
            <Input v-model:value="formState.email" />
          </BaseFormItem>
          <BaseFormItem :col-span="4" label="Phone" name="phoneNumber">
            <Input v-model:value="formState.phoneNumber" />
          </BaseFormItem>
          <BaseFormItem :col-span="12" label="Avatar" name="avatar">
            <ImageUpload v-model="formState.avatar" />
          </BaseFormItem>
        </TwoColumnsCard>
        <TwoColumnsCard
          :description="
            (routeId ? 'Fill in to reset the user\'s password.' : 'The user will use this to login to the portal.') +
            ' Must have at least 6 characters.'
          "
          title="Login credentials"
        >
          <BaseFormItem :col-span="4" label="Password" name="password">
            <Input v-model:value="formState.password" type="password" />
          </BaseFormItem>
          <BaseFormItem :col-span="4" label="Password confirmation" name="confirm">
            <Input v-model:value="formState.confirm" type="password" />
          </BaseFormItem>
        </TwoColumnsCard>
        <BaseFormSubmit />
      </Form>
    </BaseMain>
  </Spin>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { DatePicker, notification, Input, Select, Form, Spin } from "ant-design-vue";
import type { SelectProps } from "ant-design-vue";
import type { FormInstance } from "ant-design-vue";
import { BasePageHeader, BaseMain, BaseFormItem, BaseFormSubmit, TwoColumnsCard, ImageUpload } from "@/components";
import { DB_DATE_FORMAT, DISPLAY_DATE_FORMAT } from "@/utils/constants";
import type { Rule } from "ant-design-vue/es/form";
import { UserService } from "@/services/user";
import { useRouter, useRoute } from "vue-router";
import dayjs, { Dayjs } from "dayjs";
import { Gender, UserRole } from "@/types/enums";

interface FormState {
  email: string;
  firstName: string;
  password?: string;
  confirm?: string;
  lastName: string;
  gender?: number;
  phoneNumber: string;
  dateOfBirth: Dayjs;
  address: string;
  role?: number;
  avatar?: string;
}

const router = useRouter();
const route = useRoute();
const isLoading = ref<boolean>(false);
const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
  email: "",
  firstName: "",
  lastName: "",
  gender: undefined,
  phoneNumber: "",
  dateOfBirth: dayjs(),
  address: "",
  confirm: "",
  avatar: "",
});

const routeId = Number.parseInt(String(route.params.id));

const disabledBirthday = (birthday: Dayjs) => {
  return birthday && birthday > dayjs().add(-1, "day").endOf("day");
};

const genders = ref<SelectProps["options"]>([
  { value: Gender.MALE, label: "Male" },
  { value: Gender.FEMALE, label: "Female" },
]);

let validatePass = async (_rule: Rule, value: string) => {
  if (value === "") {
    return Promise.reject("Please input the password again");
  }
  if (value !== formState.password) {
    return Promise.reject("Two inputs don't match!");
  } else {
    return Promise.resolve();
  }
};

let validatePassUpdate = async (_rule: Rule, value: string) => {
  if (formState.password) {
    if (value === "") {
      return Promise.reject("Please input the password again");
    }
    if (value !== formState.password) {
      return Promise.reject("Two inputs don't match!");
    } else {
      return Promise.resolve();
    }
  }
};

onMounted(() => {
  if (route.params.id) {
    isLoading.value = true;
    UserService.detail(routeId).then(({ data }) => {
      formState.gender = data.data.gender;
      formState.email = data.data.email;
      formState.firstName = data.data.firstName;
      formState.lastName = data.data.lastName;
      formState.phoneNumber = data.data.phoneNumber;
      formState.dateOfBirth = data.data.dateOfBirth ? dayjs(data.data.dateOfBirth) : dayjs();
      formState.avatar = data.data.avatar;
      isLoading.value = false;
    });
  }
});

const rules: Record<string, Rule[]> = {
  firstName: [{ required: true }],
  lastName: [{ required: true }],
  identityNumber: [{ required: true }],
  gender: [{ required: true }],
  email: [{ required: true }],
  dateOfBirth: [{ required: true }],
  password: route.params.id ? [] : [{ required: true }],
  confirm: route.params.id ? [{ validator: validatePassUpdate }] : [{ validator: validatePass }],
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
    dateOfBirth: formValues.dateOfBirth?.format(DB_DATE_FORMAT),
  };
  UserService.update(routeId, formData).then(() => {
    notification.success({
      message: `Account updated successfully`,
    });
    isLoading.value = false;
    router.push({ name: "adminList" });
  });
};

const create = (formValues: FormState) => {
  isLoading.value = true;
  const formData = {
    confirm,
    ...formValues,
    role: UserRole.ADMIN,
    dateOfBirth: formValues.dateOfBirth?.format(DB_DATE_FORMAT),
  };
  UserService.store(formData).then(() => {
    notification.success({
      message: `Account created successfully`,
    });
    isLoading.value = false;
    router.push({ name: "adminList" });
  });
};
</script>
