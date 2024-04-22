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
      <div class="grid grid-flow-col">
        <div class="col-span-1 pt-5">
          <div class="h-40 w-40">
            <Avatar :src="user?.avatar" class="h-full w-full" />
          </div>
        </div>
        <div class="col-span-8 grid-rows-2" style="z-index: 2">
          <div class="mb-5 text-7xl font-bold" style="width: fit-content">
            {{ singer?.stageName }}
          </div>
          <div class="text-xs font-medium text-gray-900" style="width: fit-content; font-size: 14px">
            <span> {{ amountFollow }} Follower</span>
            <Button
              v-if="!isFollow && !(userIsLogin.singerId === id) && userIsLogin.email !== ''"
              class="ml-5 rounded-full"
              html-type="submit"
              type="primary"
              @click="handleFollow()"
            >
              <UserAddOutlined class="text-sm"></UserAddOutlined>
              Follow
            </Button>
            <Button  v-if="isFollow && !(userIsLogin.singerId === id) && userIsLogin.email !== ''" class="ml-5 rounded-full" html-type="submit" type="primary" @click="handleFollow()">
              <CheckOutlined class="text-sm"></CheckOutlined>
              Followed
            </Button>
            <Button v-if="!(userIsLogin.singerId === id) && userIsLogin.email !== ''"
              class="ml-5 rounded-full"
              danger
              html-type="submit"
              type="primary"
              @click="showModal"
            >
              <StarOutlined class="text-sm"></StarOutlined>
              Donate
            </Button>
            <Modal v-model:visible="visible" title="Donated to singer" ok-text="Donate" @ok="handleOk">
              <p style="font-weight: bolder">Amount StarPoint:</p>
              <InputNumber
                id="inputNumber"
                v-model:value="starPoint"
                :max="9999999999999"
                :min="1"
                place
                style="width: 100%"
              />
              <p style="font-weight: bolder; margin-top: 5px">Message:</p>
              <Input id="message" v-model:value="message" placeholder="Enter Message" style="width: 100%" />
            </Modal>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Modal v-model:visible="showComment" centered title="Comments" width="1000px" @ok="showComment = false">
    <CommentView :comments="comments" :song-id="songIdC"></CommentView>
    <template #footer v-if="userIsLogin.email !== ''">
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
  <Spin :spinning="isLoading">
    <div class="p-5 pb-52">
      <div v-if="songs.length > 0" class="px-4">
        <div class="pl-4 pb-8">
          <span class="text-3xl text-gray-900">Song</span>
        </div>
        <div class="mx-auto grid h-full max-w-7xl grid-cols-2 rounded-md bg-white py-4 2xl:max-w-screen-2xl">
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
                        <span v-if="song.singers.length > 1 && singer.id !== song.singers[song.singers.length - 1].id"
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
                          <MenuItem v-if="userIsLogin.fullName && userIsLogin.package"
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
        class="mt-4 pr-5 text-right"
        show-less-items
        @change="onChange"
      />
      <div v-if="albums.length > 0">
        <div class="pt-4 pl-4">
          <span class="text-3xl text-gray-900">Album</span>
        </div>
        <div class="grid grid-cols-5">
          <div v-for="(album, index) in albums" :key="album.id" class="col-span-1 py-4">
            <div class="p-4">
              <div class="wg-box-content relative h-52 w-full overflow-hidden">
                <router-link :to="{ name: 'albumDetail', params: { id: album.id } }">
                  <img
                    :id="index"
                    :src="album.thumbnail"
                    alt=""
                    class="image-album-scale h-full w-full cursor-pointer rounded object-cover"
                  />
                  <div class="wg-box-content-overlay"></div>
                  <div class="wg-box-content-details absolute flex w-full flex-row-reverse items-center justify-center">
                    <div class="line-height-0 flex-initial rounded-full p-2">
                      <PlayCircleOutlined
                        class="line-height-0 scale-100 cursor-pointer text-3xl font-bold text-white transition-all hover:scale-110"
                      ></PlayCircleOutlined>
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
          class="pr-5 text-right"
          show-less-items
          @change="onChangeAlbums"
        />
      </div>
    </div>
  </Spin>
</template>

<script lang="ts" setup>
import {
  Avatar,
  Button,
  Dropdown,
  Input,
  InputNumber,
  Menu,
  MenuItem,
  Modal,
  notification,
  Pagination,
  Spin,
  Textarea,
} from "ant-design-vue";
import { createVNode, onMounted, ref } from "vue";
import { SingerService } from "@/services/singer";
import { FollowService } from "@/services/follow";
import { StarPointService } from "@/services/star-point";
import type { Album, Comment, LikeSong, Singer, User } from "@/types/models";
import { useRoute, useRouter } from "vue-router";
import {
  CheckOutlined,
  CommentOutlined,
  ExclamationCircleOutlined,
  MenuOutlined,
  PlayCircleOutlined,
  StarOutlined,
  UserAddOutlined,
} from "@ant-design/icons-vue";
import type { PageRequest } from "@/types/pagination";
import { useAuthStore } from "@/stores/auth";
import { FavoriteSong } from "@/components";
import CommentView from "../../layouts/partials/Comment.vue";
import { SongService } from "@/services/song";

const userIsLogin = useAuthStore();
const user = ref<User | null>(null);
const starPoint = ref<number>(0);
const message = ref<string>("");
const songs = ref<LikeSong[]>([]);
const albums = ref<Album[]>([]);
const totalSongs = ref(0);
const sizeSong = ref(0);
const totalAlbums = ref(0);
const sizeAlbum = ref(0);
const singer = ref<Singer>();
const visible = ref<boolean>(false);
const pagination = ref<PageRequest>({
  pageSong: 1,
  pageAlbum: 1,
});
const route = useRoute();
const router = useRouter();
const isLoading = ref(true);
const id = route.params.id ? parseInt(route.params.id as string) : null;
let amountFollow = ref(0);
const isFollow = ref(false);
const singerDetail = () => {
  if (id) {
    isFollow.value = userIsLogin.singerFollow.includes(id);
    SingerService.detail(id, pagination.value)
      .then(({ data }) => {
        songs.value = data.data.lstSongs.items.map((e) => {
          return {
            ...e,
            isLike: userIsLogin.songLikes.includes(e.id),
          };
        });
        singer.value = data.data;
        amountFollow.value = data.data.numberFollow;
        totalSongs.value = data.data.lstSongs.totalItems;
        sizeSong.value = data.data.lstSongs.size;
        totalAlbums.value = data.data.lstAlbums.totalItems;
        sizeAlbum.value = data.data.lstAlbums.size;
        albums.value = data.data.lstAlbums.items;
        user.value = data.data.user;
        isLoading.value = false;
      })
      .catch(({ message }) => {
        if (message) {
          notification.error({
            message,
          });
        }
      });
  }
};

const emits = defineEmits(["choiceSongPlay", "addToPlayList"]);

const choiceSong = (song: any) => {
  emits("choiceSongPlay", song);
};

const addToPlayList = (song: any) => {
  emits("addToPlayList", song);
};

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
const opentCommentBox = (songId: number) => {
  fetchComment(songId);

  idSongSubmit.value = songId;
  showComment.value = true;
};
const showModal = () => {
  visible.value = true;
};
const handleOk = (e: MouseEvent) => {
  Modal.confirm({
    title: "Do you Want to donate singer " + singer.value?.stageName + " ?",
    icon: createVNode(ExclamationCircleOutlined),
    content: createVNode("div", { style: "color:red;" }, "with " + formatPrice(starPoint.value) + " star point"),
    onOk() {
      var data = {
        point: starPoint.value,
        userId: user.value?.id,
        message: message.value,
      };
      console.log(data);
      StarPointService.donate(data).then((response) => {
        if (response.data.data) {
          notification.success({ message: "Donate Successs " });
          userIsLogin.starPoints -= data.point;
        } else {
          notification.error({ message: "Your account isn't enough balance to donate" });
        }
        isLoading.value = false;
      });
    },
    // onCancel() {
    //   console.log('Cancel');
    // },
    class: "test",
  });
  visible.value = false;
};
onMounted(() => {
  singerDetail();
});

const handleFollow = () => {
  const data = {
    singerId: id,
  };
  if (userIsLogin.fullName === "") {
    Modal.confirm({
      title: "Không đủ quyền",
      content: "Bạn cần đăng nhập để có thể dùng chức năng này. Vui lòng bấm nút ok để tới trang đăng nhập",
      onOk() {
        router.push({ name: "login" });
      },
    });
  } else if (isFollow.value === true) {
    FollowService.unFollow(data).then(() => {
      isFollow.value = !isFollow.value;
      amountFollow.value--;
      isLoading.value = false;
    });
  } else {
    FollowService.follow(data).then(() => {
      isFollow.value = !isFollow.value;
      amountFollow.value++;
      isLoading.value = false;
    });
  }
};

const formatPrice = (value: any) => {
  let val = (value / 1).toFixed(0).replace(".", ",");
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const onChange = (page: number) => {
  pagination.value.pageSong = page;
  singerDetail();
};
const onChangeAlbums = (page: number) => {
  pagination.value.pageAlbum = page;
  singerDetail();
};
</script>
<style scoped>
.wg-box-content:hover .wg-box-content-overlay {
  opacity: 1;
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
  top: 50%;
  left: 50%;
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
