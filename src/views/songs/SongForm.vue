<template>
  <BasePageHeader />
  <Spin :spinning="isLoading">
    <BaseMain :disabled="isFormDisabled" class="pb-32">
      <Form ref="formRef" :model="formState" :rules="rules" class="space-y-6" layout="vertical" @finish="onFinish">
        <TwoColumnsCard description="Song's identity and information" title="Song information">
          <BaseFormItem :col-span="6" label="Name" name="name">
            <Input v-model:value="formState.name" />
          </BaseFormItem>
          <BaseFormItem :col-span="6" label="Link" name="link">
            <SongUpload v-model="formState.link" />
          </BaseFormItem>
          <BaseFormItem :col-span="6" label="Author" name="author">
            <Input v-model:value="formState.author" />
          </BaseFormItem>
          <BaseFormItem :col-span="6" label="Country" name="countryId">
            <Select v-model:value="formState.countryId" :options="options" class="w-full" />
          </BaseFormItem>
          <BaseFormItem :col-span="6" label="Thumbnail" name="thumbnail">
            <ImageUpload v-model="formState.thumbnail" />
          </BaseFormItem>
          <BaseFormItem :col-span="12" :rules="[{ required: true }]" label="Lyric" name="lyric">
            <ckeditor
              v-model="formState.lyric"
              :config="editorConfig"
              :editor="editor"
              :style="{ maxHeight: '1000px' }"
            ></ckeditor>
          </BaseFormItem>
        </TwoColumnsCard>
        <TwoColumnsCard
          description="Select a category for this song. A song can belong to many different categories."
          title="Category"
        >
          <BaseFormItem
            :col-span="12"
            :name="['categoryId']"
            :rules="[
              {
                type: 'array',
              },
              { required: true },
            ]"
            label="Category"
          >
            <CategoriesSelect v-model:value="formState.categoryId" />
          </BaseFormItem>
        </TwoColumnsCard>
        <TwoColumnsCard description="Choose a singer for this song. A song can be sung by many singers." title="Singer">
          <BaseFormItem
            :col-span="12"
            :name="['singerId']"
            :rules="[
              {
                type: 'array',
              },
            ]"
            label="Singer"
          >
            <SingersSelect v-model:value="formState.singerId" />
          </BaseFormItem>
        </TwoColumnsCard>
        <BaseFormSubmit v-if="!isFormDisabled" />
      </Form>
    </BaseMain>
  </Spin>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import type { FormInstance } from "ant-design-vue";
import { Form, Input, notification, Select, Spin } from "ant-design-vue";
import {
  BaseFormItem,
  BaseFormSubmit,
  BaseMain,
  BasePageHeader,
  ImageUpload,
  SongUpload,
  TwoColumnsCard,
} from "@/components";
import type { Rule } from "ant-design-vue/es/form";
import { useRoute, useRouter } from "vue-router";
import { UserRole } from "@/types/enums";
import { SongService } from "@/services/song";
import { CountryService } from "@/services/country";
import CategoriesSelect from "@/components/selects/CategoriesSelect.vue";
import SingersSelect from "@/components/selects/SingersSelect.vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const isFormDisabled = route.name === "draftSongView";

interface FormState {
  name: string;
  thumbnail?: string;
  link: string;
  lyric: string;
  author: string;
  categoryId: number[];
  singerId: number[];
  countryId?: number;
  draftSongId: number;
}

const router = useRouter();
const authStore = useAuthStore();
const isLoading = ref<boolean>(false);
const formRef = ref<FormInstance>();
const editorConfig = {};
const editor = ClassicEditor;
const formState = reactive<FormState>({
  name: "",
  thumbnail: "",
  link: "",
  lyric: "",
  author: "",
  categoryId: [],
  singerId: [],
  countryId: undefined,
  draftSongId: 0,
});

const routeId = Number.parseInt(String(route.params.id));

const options = ref<any>([]);
const getAllCountry = () => {
  CountryService.getAll().then(({ data }) => {
    const res = Array.from(data.data);
    options.value = res.map((e: any) => ({
      value: e.id,
      label: e.name,
    }));
  });
};

onMounted(() => {
  if (route.params.id) {
    isLoading.value = true;
    SongService.detail(routeId).then(({ data }) => {
      formState.name = data.data.name;
      formState.thumbnail = data.data.thumbnail;
      formState.link = data.data.link;
      formState.lyric = data.data.lyric;
      formState.categoryId = data.data.categoryId;
      formState.singerId = data.data.singerId.filter((e) => e !== authStore.singerId);
      formState.countryId = data.data.countryId;
      formState.author = data.data.author;
      formState.draftSongId = data.data.draftSongId;
      isLoading.value = false;
    });
  }
  getAllCountry();
});

const rules: Record<string, Rule[]> = {
  name: [{ required: true }],
  thumbnail: [{ required: true }],
  link: [{ required: true }],
  author: [{ required: true }],
  countryId: [{ required: true }],
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
  SongService.update(formState.draftSongId, formData).then(() => {
    notification.success({
      message: `Song updated successfully`,
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
    role: UserRole.ADMIN,
  };

  SongService.store(formData).then(() => {
    notification.success({
      message: `Song created successfully`,
    });
    isLoading.value = false;
    router.push({ name: "profile" });
  });
};
</script>

<style scoped>
:deep(.ck-editor__editable_inline) {
  min-height: 150px;
}
</style>
