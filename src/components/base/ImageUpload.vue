<template>
  <div class="clearfix image-upload">
    <Spin :indicator="indicator" :spinning="isUploading">
      <Upload
        :before-upload="beforeUpload"
        :class="fileList.length ? 'hide-upload' : ''"
        :custom-request="uploadFiles"
        :file-list="fileList"
        :multiple="false"
        class="w-auto"
        list-type="picture-card"
        @change="handleChange"
        @preview="handlePreview"
      >
        <div>
          <PlusOutlined />
          <div>Upload</div>
        </div>
      </Upload>
    </Spin>
    <Modal :footer="null" :visible="previewVisible" title="Preview" @cancel="handleCancel">
      <img :src="previewImage" alt="" style="width: 100%" />
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { h, ref, watch } from "vue";
import { Upload, Modal, message, Spin } from "ant-design-vue";
import type { UploadChangeParam, UploadFile, UploadProps } from "ant-design-vue";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons-vue";
import { useInjectFormItemContext } from "ant-design-vue/es/form";
import { UploadService } from "@/services/upload";
import type { RcFile } from "ant-design-vue/es/vc-upload/interface";

interface ImageUploadProps {
  modelValue?: string;
}

const props = defineProps<ImageUploadProps>();
const emits = defineEmits(["update:model-value"]);
const isUploading = ref(false);
const formItemContext = useInjectFormItemContext();

const indicator = h(LoadingOutlined, {
  style: {
    fontSize: "24px",
  },
  spin: true,
});

const getBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const fileList = ref<UploadProps["fileList"]>([]);
const previewVisible = ref(false);
const previewImage = ref("");

const handleCancel = () => {
  previewVisible.value = false;
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const handlePreview = async (file: UploadProps["fileList"][number]) => {
  if (!file.url && !file.preview) {
    file.preview = (await getBase64(file.originFileObj as File)) as string;
  }
  const url = file.url || file.preview;
  if (!url) {
    message.error("An error occurred.");
    return;
  }
  previewImage.value = url;
  previewVisible.value = true;
};

const emitChange = (fileList: UploadFile[]) => {
  const urls = fileList.map((a) => a.url);
  const emitValue = urls[0] || "";
  emits("update:model-value", emitValue);
  formItemContext.onFieldChange();
};

const handleChange = (info: UploadChangeParam) => {
  if (info.file.status === "done" || info.file.status === "removed") {
    emitChange(info.fileList);
  }
};

const mapUrlToFileObject = (url: string): UploadFile => ({
  uid: url,
  name: url,
  status: "done",
  url: url,
});

const beforeUpload = (file: File): boolean => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedFileTypes.includes(file.type)) {
    message.error("You can only upload JPG, PNG or WEBP file!");
    return false;
  }
  const allowedFileSize = 10 * 1024 * 1024; // 10mb in bytes
  if (file.size > allowedFileSize) {
    message.error("Image must smaller than 10MB!");
    return false;
  }
  return true;
};

const uploadFiles = ({ file }: { file: File | string | Blob | RcFile }) => {
  const form = new FormData();
  form.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
  form.append("file", file);
  isUploading.value = true;
  UploadService.upload(form)
    .then((res) => {
      const imageUrl = res.data.url;
      const fileObject: UploadFile = {
        uid: imageUrl,
        name: imageUrl,
        status: "done",
        url: imageUrl,
      };
      if (fileList.value) {
        fileList.value.push(fileObject);
      } else {
        fileList.value = [fileObject];
      }
      emitChange(fileList.value);
      message.success("Upload successfully.");
      isUploading.value = false;
    })
    .catch(() => {
      fileList.value?.pop();
      emitChange(fileList.value || []);
      isUploading.value = false;
    });
};

watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue || !newValue.length) {
      fileList.value = [];
    } else {
      fileList.value = [mapUrlToFileObject(newValue)];
    }
  },
  {
    immediate: true,
  }
);
</script>

<style lang="less" scoped>
.hide-upload :deep(.ant-upload.ant-upload-select-picture-card) {
  visibility: hidden;
  max-width: 1px;
}

.image-upload :deep(.ant-spin-nested-loading > div > .ant-spin) {
  width: auto;
  aspect-ratio: 1;
}
</style>
