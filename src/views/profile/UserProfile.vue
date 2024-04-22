<template>
  <div
    :style="{
      backgroundImage: 'url(' + user?.avatar + ')',
    }"
    class="relative mx-auto border-b border-gray-200 bg-transparent bg-cover bg-center bg-no-repeat px-4 pt-24 pb-6 bg-blend-overlay transition-colors duration-500 sm:px-6 md:px-8"
  >
    <div
      class="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/50 backdrop-brightness-150 backdrop-grayscale"
    ></div>
    <div class="col-span-full mx-auto px-4 py-6 sm:px-6 md:px-8" style="z-index: 2">
      <Modal v-model:visible="showComment" centered title="Comments" width="1000px" @ok="showComment = false">
        <CommentView :comments="comments" :song-id="songIdC"></CommentView>
        <template v-if="userIsLogin.email !== ''" #footer>
          <div class="grid grid-cols-3 gap-4">
            <div class="col-span-2">
              <Textarea v-model:value="myComments" :rows="1" placeholder="Enter your comment" />
            </div>
            <div>
              <Button key="back" @click="handleOk">Close</Button>
              <Button key="submit" type="primary" @click="SupmitComment(idSongSubmit)">Submit</Button>
            </div>
          </div>
        </template>
      </Modal>
      <div class="grid grid-cols-6 gap-6">
        <div class="relative col-span-1">
          <div class="h-40 w-40">
            <Avatar :src="user?.avatar" style="width: 100%; height: 100%" />
          </div>
        </div>
        <div class="col-span-2 grid-rows-2" style="z-index: 2">
          <div v-if="authStore.isSinger" class="text-5xl" style="font-weight: 700; width: fit-content">
            {{ formState.stageName }}
            <span
              v-if="user?.packaged != null"
              class="inline-block truncate rounded bg-yellow-300 align-middle text-xs font-black text-red-700"
              style="right: 5px; padding: 2px 3px 3px 3px"
              >{{ authStore.package?.name }}</span
            >
          </div>
          <div v-else class="text-5xl" style="font-weight: 700; width: fit-content">
            {{ user?.firstName + " " + user?.lastName }}
            <span
              v-if="user?.packaged != null"
              class="inline-block rounded bg-yellow-300 py-1 px-2.5 align-middle text-xs font-black text-red-700"
              style="right: 5px"
              >{{ authStore.package?.name }}</span
            >
          </div>
          <div
            v-if="authStore.isSinger"
            class="text-xs font-medium text-gray-900"
            style="width: fit-content; font-size: 14px"
          >
            <span> {{ formState.numberFollow }} Follower</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <BaseMain>
    <Spin :spinning="isLoading">
      <div class="tabs-container mt-4 pb-52">
        <Tabs v-model:activeKey="isShowProfile" class="text-gray-500">
          <TabPane :key="1" tab="Profile">
            <div class="grid grid-cols-1 gap-6 lg:grid-flow-col-dense lg:grid-cols-3">
              <div class="space-y-6 lg:col-span-2 lg:col-start-1">
                <section aria-labelledby="applicant-information-title">
                  <div class="bg-white shadow sm:rounded-lg">
                    <div class="px-4 py-5 sm:px-6">
                      <h2 id="applicant-information-title" class="text-lg font-medium leading-6 text-gray-900">
                        Information
                      </h2>
                      <p class="mt-1 mb-0 max-w-2xl text-sm text-gray-500">User information.</p>
                    </div>
                    <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
                      <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <ProfileField label="Full name">
                          {{ user?.firstName + " " + user?.lastName }}
                        </ProfileField>
                        <ProfileField label="Phone number">
                          {{ user?.phoneNumber }}
                        </ProfileField>
                        <ProfileField label="Gender">
                          {{ user ? formatGender(user?.gender) : "--" }}
                        </ProfileField>
                        <ProfileField label="Date of birth">
                          {{ user ? formatDate(user?.dateOfBirth) : "--" }}
                        </ProfileField>
                        <ProfileField label="Email address">
                          {{ user?.email }}
                        </ProfileField>
                      </dl>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </TabPane>
          <TabPane v-if="authStore.isUser" :key="0" tab="Register as a singer">
            <div class="grid grid-cols-1 lg:grid-flow-col-dense">
              <div class="space-y-6 lg:col-span-2 lg:col-start-1">
                <section aria-labelledby="applicant-information-title">
                  <div class="bg-white shadow sm:rounded-lg">
                    <Form
                      ref="formRef"
                      :model="formState"
                      :rules="rules"
                      class="space-y-6"
                      layout="vertical"
                      @finish="onFinish"
                    >
                      <TwoColumnsCard description="Singer's identity and information" title="Singer information">
                        <BaseFormItem :col-span="6" label="Stage name" name="stageName">
                          <Input v-model:value="formState.stageName" />
                        </BaseFormItem>
                        <BaseFormItem :col-span="6" label="Identity number" name="identityNumber">
                          <Input v-model:value="formState.identityNumber" :maxlength="10" />
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
                        <BaseFormItem :col-span="12">
                          <BaseFormSubmit />
                        </BaseFormItem>
                      </TwoColumnsCard>
                    </Form>
                  </div>
                </section>
              </div>
            </div>
          </TabPane>
          <TabPane v-if="authStore.isSinger" :key="2" tab="Songs">
            <div>
              <div class="flex justify-between pb-8 pt-4">
                <span class="text-3xl text-gray-900">Song</span>
                <div>
                  <router-link :to="{ name: 'songCreate' }">
                    <Button type="primary">Create Song</Button>
                  </router-link>
                </div>
              </div>
              <div
                class="mx-auto grid h-full max-w-7xl grid-cols-2 bg-white p-5 px-4 pb-5 sm:px-4 lg:px-1 2xl:max-w-screen-2xl"
              >
                <div v-for="(song, index) in songs" :key="song.id" class="mt-0">
                  <div class="px-3">
                    <div class="media-item flex grid w-full grid-cols-2 grid-rows-1 gap-2 rounded p-2.5">
                      <div class="flex">
                        <div>
                          <div class="mr-4 h-12 w-12 flex-initial">
                            <img
                              :id="index"
                              :src="song.thumbnail"
                              alt=""
                              class="mini_thumbnail h-full w-full cursor-pointer rounded object-cover"
                              @click="choiceSong(song)"
                            />
                          </div>
                        </div>
                        <div class="flex-initial">
                          <span class="truncate text-base font-bold text-indigo-800">{{ song.name }}</span>
                          <br />
                          <span v-for="(singer, i) in song.singers" :key="singer.id">
                            <span :id="i">
                              <router-link
                                :to="{ name: 'singerProfile', params: { id: singer.id } }"
                                class="cursor-pointer text-xs font-medium text-indigo-600"
                                >{{ singer.stageName }}</router-link
                              >
                              <span
                                v-if="song.singers.length > 1 && singer.id !== song.singers[song.singers.length - 1].id"
                                >,
                              </span>
                            </span>
                          </span>
                        </div>
                      </div>
                      <div class="inline flex flex-row-reverse">
                        <div class="mr-4 flex-initial">
                          <Dropdown>
                            <template #overlay>
                              <Menu>
                                <MenuItem>
                                  <router-link :to="{ name: 'songUpdate', params: { id: song.id } }"
                                    >Update
                                  </router-link>
                                </MenuItem>
                                <MenuItem v-if="user.fullName && user.package"
                                  ><a :href="song.link" target="_blank">Download</a>
                                </MenuItem>
                              </Menu>
                            </template>
                            <MenuOutlined class="cursor-pointer text-base font-bold text-indigo-800"></MenuOutlined>
                          </Dropdown>
                        </div>
                        <div class="mr-4 flex-initial">
                          <FavoriteSong :song="song" />
                        </div>
                        <div class="mr-4 flex-initial">
                          <CommentOutlined
                            class="cursor-pointer text-base font-bold text-indigo-800"
                            @click="opentCommentBox(song.id)"
                          ></CommentOutlined>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Pagination
              v-if="totalSongs > 10"
              :current="pagination.pageSong"
              :disabled="isLoading"
              :page-size="sizeSong"
              :show-total="(count) => `${count} songs`"
              :total="totalSongs"
              class="mt-4 text-right"
              show-less-items
              @change="onChange"
            />
          </TabPane>
          <TabPane v-if="authStore.isSinger" :key="3" tab="Album">
            <div>
              <div class="mb-8 flex justify-between">
                <span class="text-3xl text-gray-900">Album</span>
                <div>
                  <router-link :to="{ name: 'albumCreate' }">
                    <Button type="primary">Create Album</Button>
                  </router-link>
                </div>
              </div>
              <div class="grid grid-cols-5">
                <div v-for="(album, index) in albums" :key="album.id" class="col-span-1 py-4">
                  <div>
                    <div class="wg-box-content relative h-52 w-52 overflow-hidden">
                      <router-link :to="{ name: 'albumDetail', params: { id: album.id } }">
                        <img
                          :id="index"
                          :src="album.thumbnail"
                          alt=""
                          class="image-album-scale h-full w-full cursor-pointer rounded object-cover"
                          @click="choiceSong(song)"
                        />
                        <div class="wg-box-content-overlay"></div>
                        <div
                          class="wg-box-content-details absolute flex w-full flex-row-reverse items-center justify-center"
                        >
                          <div class="icon-menu-album line-height-0 flex-initial rounded-full p-2">
                            <Dropdown>
                              <template #overlay>
                                <Menu>
                                  <MenuItem key="0">
                                    <router-link :to="{ name: 'albumUpdate', params: { id: album.id } }"
                                      >Update
                                    </router-link>
                                  </MenuItem>
                                  <MenuItem key="1">
                                    <a href="http://www.taobao.com/">2nd menu item</a>
                                  </MenuItem>
                                  <MenuDivider />
                                  <MenuItem key="3">3rd menu item</MenuItem>
                                </Menu>
                              </template>
                              <MenuOutlined
                                class="line-height-0 cursor-pointer text-base font-bold text-white"
                              ></MenuOutlined>
                            </Dropdown>
                          </div>
                          <div class="line-height-0 flex-initial rounded-full p-2">
                            <PlayCircleOutlined
                              class="line-height-0 scale-100 cursor-pointer text-3xl font-bold text-white transition-all hover:scale-110"
                            ></PlayCircleOutlined>
                          </div>
                          <div class="icon-menu-album line-height-0 flex-initial rounded-full p-2">
                            <HeartOutlined
                              class="line-height-0 cursor-pointer text-base font-bold text-white"
                            ></HeartOutlined>
                          </div>
                        </div>
                      </router-link>
                    </div>
                    <div class="w-52 py-2">
                      <router-link :to="{ name: 'albumDetail', params: { id: album.id } }">
                        <div class="truncate text-base font-medium leading-6 text-gray-900 hover:text-sky-600">
                          {{ album.name }}
                        </div>
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
              <Pagination
                v-if="totalAlbums > 10"
                :current="pagination.pageAlbum"
                :disabled="isLoading"
                :page-size="sizeAlbum"
                :show-total="(count) => `${count} albums`"
                :total="totalAlbums"
                class="mt-4 text-right"
                show-less-items
                @change="onChangeAlbums"
              />
            </div>
          </TabPane>
          <TabPane v-if="likeSongs.length > 0" :key="4" tab="Songs Like">
            <div>
              <div class="flex justify-between pb-8 pt-4">
                <span class="text-3xl text-gray-900">Song Like</span>
              </div>
              <div
                class="mx-auto grid h-full max-w-7xl grid-cols-2 bg-white p-5 px-4 pb-5 sm:px-4 lg:px-1 2xl:max-w-screen-2xl"
              >
                <div v-for="(song, index) in likeSongs" :key="song.id" class="mt-0">
                  <div class="px-3">
                    <div class="media-item flex grid w-full grid-cols-2 grid-rows-1 gap-2 rounded p-2.5">
                      <div class="flex">
                        <div>
                          <div class="mr-4 h-12 w-12 flex-initial">
                            <img
                              :id="index"
                              :src="song.thumbnail"
                              alt=""
                              class="mini_thumbnail h-full w-full cursor-pointer rounded object-cover"
                              @click="choiceSong(song)"
                            />
                          </div>
                        </div>
                        <div class="flex-initial">
                          <span class="truncate text-base font-bold text-indigo-800">{{ song.name }}</span>
                          <br />
                          <span v-for="(singer, i) in song.singers" :key="singer.id">
                            <span :id="i">
                              <router-link
                                :to="{ name: 'singerProfile', params: { id: singer.id } }"
                                class="cursor-pointer text-xs font-medium text-indigo-600"
                                >{{ singer.stageName }}</router-link
                              >
                              <span
                                v-if="song.singers.length > 1 && singer.id !== song.singers[song.singers.length - 1].id"
                                >,
                              </span>
                            </span>
                          </span>
                        </div>
                      </div>
                      <div class="inline flex flex-row-reverse">
                        <div class="mr-4 flex-initial">
                          <Dropdown>
                            <template #overlay>
                              <Menu>
                                <MenuItem @click="addToPlayList(song)"> Add to playList</MenuItem>
                                <MenuItem v-if="user.fullName && user.package"
                                  ><a :href="song.link" target="_blank">Download</a>
                                </MenuItem>
                              </Menu>
                            </template>
                            <MenuOutlined class="cursor-pointer text-base font-bold text-indigo-800"></MenuOutlined>
                          </Dropdown>
                        </div>
                        <div class="mr-4 flex-initial">
                          <CommentOutlined
                            class="cursor-pointer text-base font-bold text-indigo-800"
                            @click="opentCommentBox(song.id)"
                          ></CommentOutlined>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Pagination
              v-if="totalLikeSongs > 10"
              :current="paginationLikeSong.page"
              :disabled="isLoading"
              :page-size="sizeSong"
              :show-total="(count) => `Total ${count} items`"
              :total="totalLikeSongs"
              class="mt-4 text-right"
              show-less-items
              @change="onChangeLikeSongs"
            />
          </TabPane>
          <TabPane :key="5" tab="Transaction">
            <Table :columns="columns" :data-source="transactions" :pagination="false" row-key="id"></Table>
            <Pagination
              :current="paginationListTransaction.page"
              :disabled="isLoading"
              :page-size="10"
              :show-total="(count) => `${count} transactions`"
              :total="totalTransactions"
              class="mt-4 text-right"
              show-less-items
              @change="onChangeListTransaction"
            />
          </TabPane>
        </Tabs>
      </div>
    </Spin>
  </BaseMain>
</template>

<script lang="ts" setup>
import { BaseFormItem, BaseFormSubmit, BaseMain, FavoriteSong, ImageUpload, TwoColumnsCard } from "@/components";
import { DB_DATE_FORMAT, DISPLAY_DATE_FORMAT } from "@/utils/constants";
import type { FormInstance, SelectProps } from "ant-design-vue";
import {
  Avatar,
  Button,
  DatePicker,
  Dropdown,
  Form,
  Input,
  Menu,
  MenuDivider,
  MenuItem,
  Modal,
  notification,
  Pagination,
  Select,
  Spin,
  Table,
  TabPane,
  Tabs,
  Textarea,
} from "ant-design-vue";
import CommentView from "../../layouts/partials/Comment.vue";
import type { BaseTableColumn } from "@/components/base/BaseTable.vue";
import { onMounted, reactive, ref } from "vue";
import { UserService } from "@/services/user";
import { SingerService } from "@/services/singer";
import { SongService } from "@/services/song";
import type { Album, Comment, LikeSong, Transaction, User } from "@/types/models";
import { formatDate, formatDatetime, formatGender } from "@/utils/utils";
import ProfileField from "@/views/profile/components/ProfileField.vue";
import { useRoute, useRouter } from "vue-router";
import dayjs, { Dayjs } from "dayjs";
import { SingerType, UserRole } from "@/types/enums";
import type { Rule } from "ant-design-vue/es/form";
import { useAuthStore } from "@/stores/auth";
import { CommentOutlined, HeartOutlined, MenuOutlined, PlayCircleOutlined } from "@ant-design/icons-vue";
import type { PageRequest } from "@/types/pagination";
import { StarPointService } from "@/services/starPoint";

const authStore = useAuthStore();
const user = ref<User | null>(null);
const songs = ref<LikeSong[]>([]);
const transactions = ref<Transaction[]>([]);
const likeSongs = ref<LikeSong[]>([]);
const totalLikeSongs = ref(0);
const totalTransactions = ref(0);
const albums = ref<Album[]>([]);
const totalSongs = ref(0);
const sizeSong = ref(10);
const totalAlbums = ref(0);
const sizeAlbum = ref(0);
const currentPageLikeSong = ref(1);

const route = useRoute();
const router = useRouter();
const isLoading = ref(true);
const isShowProfile = ref<number>(1);
const formRef = ref<FormInstance>();

const myComments = ref("");
const idSongSubmit = ref(0);
const showComment = ref(false);
const comments = ref<Comment[]>([]);

const songIdC = ref(0);

const fetchComment = (songId: number) => {
  songIdC.value = songId;
  SongService.detail(songId)
    .then((res) => {
      comments.value = res.data.data.listComment.sort(function (a, b) {
        return b.id - a.id || a.message.localeCompare(b.message);
      });
    })
    .catch(({ message }) => {
      if (message) {
        notification.error({
          message,
        });
      }
    });
};

const handleOk = () => {
  showComment.value = false;
};

const SupmitComment = (songId: number) => {
  if (myComments.value !== "") {
    SongService.comment({
      message: myComments.value,
      songId: songId,
    })
      .then((res) => {
        if (res.data.code === 200) {
          fetchComment(songId);
        }
      })
      .catch(({ message }) => {
        if (message) {
          notification.error({
            message,
          });
        }
      });
    myComments.value = "";
  } else {
    notification.warning({ message: "Please enter your comment first" });
  }
};

const emits = defineEmits(["choiceSongPlay", "addToPlayList"]);

const choiceSong = (song: any) => {
  emits("choiceSongPlay", song);
};

const opentCommentBox = (songId: number) => {
  fetchComment(songId);

  idSongSubmit.value = songId;
  showComment.value = true;
};

interface FormState {
  stageName: string;
  identityCardPhoto: string;
  identityNumber?: number;
  debutTime: Dayjs;
  type?: number;
  numberFollow?: number;
  description: string;
}

const formState = reactive<FormState>({
  stageName: "",
  identityNumber: undefined,
  description: "",
  type: undefined,
  debutTime: dayjs(),
  identityCardPhoto: "",
});
const userIsLogin = useAuthStore();
const routeId = Number.parseInt(String(route.params.id));
const id = authStore.singerId;
const disabledDebutTime = (debutTime: Dayjs) => {
  return debutTime && debutTime > dayjs().add(-1, "day").endOf("day");
};
const types = ref<SelectProps["options"]>([
  { value: SingerType.GROUP, label: "GROUP" },
  { value: SingerType.SOLO, label: "SOLO" },
]);

const pagination = ref<PageRequest>({
  pageSong: 1,
  pageAlbum: 1,
  page: 1,
  size: 10,
});
const paginationLikeSong = ref<PageRequest>({
  page: 1,
});
const paginationListTransaction = ref<PageRequest>({
  page: 1,
});
const singerDetail = () => {
  if (id) {
    SingerService.detail(id, pagination.value).then(({ data }) => {
      totalSongs.value = data.data.lstSongs.totalItems;
      sizeSong.value = data.data.lstSongs.size;
      totalAlbums.value = data.data.lstAlbums.totalItems;
      sizeAlbum.value = data.data.lstAlbums.size;
      albums.value = data.data.lstAlbums.items;
      formState.stageName = data.data.stageName;
      formState.identityNumber = data.data.identityNumber;
      formState.description = data.data.description;
      formState.type = data.data.type;
      formState.identityCardPhoto = data.data.identityCardPhoto;
      formState.debutTime = dayjs(data.data.debutTime);
      formState.numberFollow = data.data.numberFollow;
      songs.value = data.data.lstSongs.items.map((e) => {
        return {
          ...e,
          isLike: userIsLogin.songLikes.includes(e.id),
        };
      });
      isLoading.value = false;
    });
  }
};
const getListLikeSongs = () => {
  SongService.listLikeSong(paginationLikeSong.value).then(({ data }) => {
    totalLikeSongs.value = data.data.totalItems;
    likeSongs.value = data.data.items.map((e) => {
      return {
        ...e,
        isLike: userIsLogin.songLikes.includes(e.id),
      };
    });
    isLoading.value = false;
  });
};
onMounted(() => {
  userGetProfile();
  singerDetail();
  getListLikeSongs();
  getListTransaction();
});
const rules: Record<string, Rule[]> = {
  stageName: [{ required: true }],
  identityNumber: [{ required: true }],
  type: [{ required: true }],
  identityCardPhoto: [{ required: true }],
  debutTime: [{ required: true }],
};

const onChange = (page: number) => {
  pagination.value.pageSong = page;
  singerDetail();
};
const onChangeAlbums = (page: number) => {
  pagination.value.pageAlbum = page;
  singerDetail();
};
const onChangeLikeSongs = (page: number) => {
  paginationLikeSong.value.page = page;
  getListLikeSongs();
};
const onChangeListTransaction = (page: number) => {
  paginationListTransaction.value.page = page;
  getListTransaction();
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
    router.push({ name: "profile" });
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
      message: `Request to become a singer is being approved`,
    });
    isLoading.value = false;
    router.push("/");
  });
};
const userGetProfile = () => {
  UserService.getProfile().then(({ data }) => {
    user.value = data.data;
    isLoading.value = false;
  });
};
const getListTransaction = () => {
  StarPointService.listTransaction(paginationListTransaction.value).then(({ data }) => {
    transactions.value = data.data.items;
    totalTransactions.value = data.data.totalItems;
    isLoading.value = false;
  });
};

const columns: BaseTableColumn[] = [
  {
    title: "",
    customRender: ({ index }) => {
      return index + 1;
    },
  },
  {
    title: "Note",
    dataIndex: "note",
  },
  {
    title: "Time",
    customRender: ({ record }) => {
      return formatDatetime(record.createdAt);
    },
  },
];
</script>
<style scoped>
#main > * {
  @apply pt-12;
}

.wg-box-content:hover .wg-box-content-overlay {
  opacity: 1;
}

.anticon-sketch {
  color: #1890ff;
  font-size: 46px;
  font-weight: bolder;
}

.wg-box-content-details {
  position: absolute;
  text-align: center;
  padding-left: 1em;
  padding-right: 1em;
  width: 100%;
  top: 50%;
  left: 50%;
  opacity: 0;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  -webkit-transition: all 0.3s ease-in-out 0s;
  -moz-transition: all 0.3s ease-in-out 0s;
  transition: all 0.3s ease-in-out 0s;
}

.wg-box-content:hover .wg-box-content-details {
  opacity: 1;
}

.wg-box-content .wg-box-content-overlay {
  background: rgba(0, 0, 0, 0.4);
  position: absolute;
  border-radius: 4px;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  opacity: 0;
  -webkit-transition: all 0.4s ease-in-out 0s;
  -moz-transition: all 0.4s ease-in-out 0s;
  transition: all 0.4s ease-in-out 0s;
}

.image-album-scale:hover {
  transform: scale(1.1) !important;
}

.icon-menu-album:hover {
  background-color: hsla(0, 0%, 100%, 0.3);
}

.line-height-0 {
  line-height: 0;
}

.media-item {
  border-bottom: 1px rgba(0, 0, 0, 0.08) solid;
}

.media-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
