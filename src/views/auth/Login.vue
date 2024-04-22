<template>
  <!--Form Login -->
  <div id="form-login" class="flex min-h-screen items-center justify-center px-4 pt-12 pb-20 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div>
        <Logo class="mx-auto h-12 w-12 text-black" fill="currentcolor" />
        <router-link :to="{ name: 'home' }" class="cursor-pointer">
          <h2 class="mt-4 text-center text-3xl font-extrabold text-gray-900">NineT Music</h2>
        </router-link>

        <p class="mt-2 text-center text-sm text-gray-600">
          <template v-if="isLoading">
            <Spin />
            <span class="mt-4 ml-2 inline-block">Please wait</span>
          </template>
          <span v-else>Login to your account</span>
        </p>

        <form class="mt-8 space-y-6" @submit.prevent>
          <div class="-space-y-px rounded-md shadow-sm">
            <div>
              <label class="sr-only" for="email-address">Email address</label>
              <input
                id="email-address"
                v-model="loginRequest.email"
                autocomplete="email"
                class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                name="email"
                placeholder="Email address"
                required
                type="email"
              />
            </div>
            <div>
              <label class="sr-only" for="password">Password</label>
              <input
                id="password"
                v-model="loginRequest.password"
                autocomplete="current-password"
                class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                name="password"
                placeholder="Password"
                required
                type="password"
              />
            </div>
          </div>

          <div v-if="validate" class="text-center">
            <span class="text-red-700">Please enter your credentials</span>
          </div>

          <div>
            <button
              class="group relative flex w-full justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              type="submit"
              @click="login"
            >
              Sign in
            </button>
            <div class="mt-3" style="text-align: center">
              <span class="text-red-700">Don't have an Oracle Account? </span>
              <button @click="changeForm(1)"><b style="font-weight: bolder">Create Account </b></button>
            </div>
          </div>
        </form>
      </div>
      <div class="mt-8 space-y-6">
        <div class="flex hidden items-center justify-center">
          <GoogleLogin v-if="!isLoading" :callback="callback" :client-id="clientId" />
        </div>
      </div>
    </div>
  </div>
  <!--Form Register -->
  <div
    id="form-register"
    class="flex min-h-screen items-center justify-center px-4 pt-12 pb-20 sm:px-6 lg:px-8"
    style="display: none"
  >
    <div class="w-full max-w-md space-y-8">
      <div>
        <Logo class="mx-auto h-12 w-12 text-black" fill="currentcolor" />
        <router-link :to="{ name: 'home' }" class="cursor-pointer">
          <h2 class="mt-4 text-center text-3xl font-extrabold text-gray-900">NineT Music</h2>
        </router-link>

        <p class="mt-2 text-center text-sm text-gray-600">
          <template v-if="isLoading">
            <Spin />
            <span class="mt-4 ml-2 inline-block">Please wait</span>
          </template>
          <span v-else>Register to your account</span>
        </p>

        <Form
          ref="formRef"
          :model="formState"
          :rules="rules"
          class="mt-8 space-y-6"
          layout="vertical"
          @finish="register(formState)"
        >
          <div class="-space-y-px rounded-md shadow-sm">
            <!--Dòng 1 -->
            <div class="ant-row mb-5">
              <div class="ant-col-12 mr-2">
                <label class="sr-only" for="password">FirstName</label>
                <BaseFormItem name="firstName">
                  <Input
                    id="firstName"
                    v-model:value="formState.firstName"
                    autocomplete="current-firstName"
                    class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                    name="firstName"
                    placeholder="FirstName"
                    type="text"
                  />
                </BaseFormItem>
              </div>
              <div class="ant-col-11 ml-2">
                <label class="sr-only" for="password">LastName</label>
                <BaseFormItem name="lastName">
                  <Input
                    id="lastName"
                    v-model:value="formState.lastName"
                    autocomplete="current-lastName"
                    class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                    name="lastName"
                    placeholder="LastName"
                    type="text"
                  />
                </BaseFormItem>
              </div>
            </div>
            <!--Dòng 2 -->
            <div class="ant-row mb-5">
              <div class="ant-col-24">
                <label class="sr-only" for="email-address">Email address</label>
                <BaseFormItem name="email">
                  <Input
                    id="email-address"
                    v-model:value="formState.email"
                    autocomplete="email"
                    class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                    name="email"
                    placeholder="Email address"
                    type="email"
                  />
                </BaseFormItem>
              </div>
            </div>
            <!--Dòng 3 -->
            <div class="ant-row" style="margin-bottom: 1.25rem !important; margin-top: 1.25rem !important">
              <div class="ant-col-12 mr-2">
                <label class="sr-only" for="password">PhoneNumber</label>
                <BaseFormItem name="phoneNumber">
                  <Input
                    id="PhoneNumber"
                    v-model:value="formState.phoneNumber"
                    autocomplete="current-PhoneNumber"
                    class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                    name="phoneNumber"
                    placeholder="PhoneNumber"
                    type="tel"
                  />
                </BaseFormItem>
              </div>
              <div class="ant-col-11 ml-2">
                <!--              <label class="sr-only" for="password">Password</label>-->
                <DatePicker
                  v-model:value="formState.dateOfBirth"
                  :disabled-date="disabledBirthday"
                  :format="DISPLAY_DATE_FORMAT"
                  class="rounded-b-md"
                  style="width: 100%; height: 37px !important"
                />
              </div>
            </div>
            <!--Dòng 4 -->
            <div class="ant-row">
              <div class="ant-col-12 mb-5">
                <label class="sr-only" for="password">Password</label>
                <BaseFormItem name="password">
                  <Input
                    id="password"
                    v-model:value="formState.password"
                    autocomplete="current-password"
                    class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                    name="password"
                    placeholder="Password"
                    type="password"
                  />
                </BaseFormItem>
              </div>
              <div class="ant-col-11 ml-4">
                <label class="sr-only" for="confirm">Confirm Password</label>
                <BaseFormItem name="confirm">
                  <Input
                    id="confirm"
                    v-model:value="formState.confirm"
                    autocomplete="current-confirm"
                    class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                    name="confirm"
                    placeholder="Confirm Password"
                    type="password"
                  />
                </BaseFormItem>
              </div>
            </div>
            <!--Dòng 5 -->
            <div class="ant-row">
              <div class="ant-col-24">
                <BaseFormItem :col-span="2" label="Gender" name="gender">
                  <Select v-model:value="formState.gender" :options="genders" class="w-full" />
                </BaseFormItem>
              </div>
            </div>
          </div>

          <div v-if="validate" id="validate-login" class="text-center">
            <span class="text-red-700">Please enter your credentials</span>
          </div>

          <div>
            <Button
              id="register"
              class="group relative flex w-full justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              html-type="submit"
            >
              Register
            </Button>
          </div>
          <div class="mt-3" style="text-align: center">
            <span class="text-red-700">If you have account !!! </span>
            <button type="button" @click="changeForm(0)"><b style="font-weight: bolder">Sign In </b></button>
          </div>
        </Form>
      </div>
      <div class="mt-8 space-y-6">
        <div class="flex hidden items-center justify-center">
          <GoogleLogin v-if="!isLoading" :callback="callback" :client-id="clientId" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AuthService } from "@/services/auth";
import { useAuthStore } from "@/stores/auth";
import type { SelectProps } from "ant-design-vue";
import { Button, DatePicker, Form, Input, notification, Select, Spin } from "ant-design-vue";
import { BaseFormItem, Logo } from "@/components";
import { onMounted, reactive, ref } from "vue";
import type { CallbackTypes } from "vue3-google-login";
import { GoogleLogin, googleOneTap } from "vue3-google-login";
import type { LoginRequest } from "@/types/models";
import { AUTHORIZATION_KEY, DB_DATE_FORMAT, DISPLAY_DATE_FORMAT } from "@/utils/constants";
import { useRouter } from "vue-router";
import { Gender } from "@/types/enums";
import dayjs, { Dayjs } from "dayjs";
import type { Rule } from "ant-design-vue/es/form";

const userStore = useAuthStore();
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const isLoading = ref(false);
const validate = ref(false);
const router = useRouter();

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

const formState = reactive<FormState>({
  email: "",
  firstName: "",
  lastName: "",
  gender: undefined,
  phoneNumber: "",
  dateOfBirth: dayjs(),
  address: "",
  confirm: "",
  avatar: ""
});

const disabledBirthday = (birthday: Dayjs) => {
  return birthday && birthday > dayjs().add(-1, "day").endOf("day");
};

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

const genders = ref<SelectProps["options"]>([
  { value: Gender.MALE, label: "Male" },
  { value: Gender.FEMALE, label: "Female" }
]);

const rules: Record<string, Rule[]> = {
  firstName: [{ required: true }],
  lastName: [{ required: true }],
  identityNumber: [{ required: true }],
  gender: [{ required: true }],
  email: [{ required: true }],
  dateOfBirth: [{ required: true }],
  password: [{ required: true }],
  confirm: [{ validator: validatePass }]
};

const onSuccess = (token: string) => {
  isLoading.value = true;
  AuthService.loginWithGoogle({
    token
  })
    .then(({ data }) => {
      window.localStorage.setItem(AUTHORIZATION_KEY, data.access_token);
      userStore.setUser(data.data);
      router.push({ name: "dashboard" });
      isLoading.value = false;
    })
    .catch(() => {
      notification.error({
        message: "Authentication failed."
      });
      isLoading.value = false;
    });
};

const showGoogleOneTap = () => {
  googleOneTap({ clientId })
    .then((response) => {
      onSuccess(response.credential);
    })
    .catch((e) => {
      console.log(e);
    });
};

const callback: CallbackTypes.CredentialCallback = (response) => {
  onSuccess(response.credential);
};

onMounted(() => {
  showGoogleOneTap();
});

const loginRequest = reactive<LoginRequest>({
  email: "",
  password: ""
});

const login = () => {
  if (loginRequest.email != "" && loginRequest.password != "") {
    isLoading.value = true;
    AuthService.login(loginRequest)
      .then(({ data }) => {
        window.localStorage.setItem(AUTHORIZATION_KEY, data.access_token);
        userStore.setUser(data.data);
        router.push({ name: "dashboard" });
        isLoading.value = false;
      })
      .catch(() => {
        notification.error({
          message: "Authentication failed."
        });
        isLoading.value = false;
      });
  } else {
    validate.value = true;
  }
};

const register = (formValues: FormState) => {
  console.log(formValues.email);
  isLoading.value = true;
  const formData = {
    confirm,
    ...formValues,
    dateOfBirth: formValues.dateOfBirth?.format(DB_DATE_FORMAT)
  };
  console.log(formData.dateOfBirth);
  AuthService.register(formData).then((response) => {
    console.log(response);
    notification.success({
      message: `Account created successfully`
    });
    isLoading.value = false;
    changeForm(0);
  });
};

const changeForm = (type: number) => {
  let formLogin = document.getElementById("form-login");
  let formRegister = document.getElementById("form-register");
  if (type == 1) {
    if (formLogin != null && formRegister != null) {
      formLogin.style.display = "none";
      formRegister.style.removeProperty("display");
    }
  } else {
    if (formLogin != null && formRegister != null) {
      formRegister.style.display = "none";
      formLogin.style.removeProperty("display");
    }
  }
};
</script>

<style scoped>
:deep(.ant-spin-dot-item) {
  @apply bg-black;
}
</style>
