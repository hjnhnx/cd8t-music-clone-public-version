<template>
  <div
    :style="{
      backgroundImage: 'url(' + country?.image + ')',
    }"
    class="relative mx-auto h-80 bg-transparent bg-cover bg-center bg-no-repeat px-4 pt-24 pb-6 bg-blend-overlay transition-colors duration-500 sm:px-6 md:px-8"
  >
    <div class="col-span-full mx-auto px-4 py-6 sm:px-6 md:px-8" style="z-index: 2">
      <div class="grid grid-flow-col">
        <div class="col-span-8 grid-rows-2" style="z-index: 2">
          <div class="mb-5 text-7xl font-bold text-white" style="width: fit-content">{{ country?.name }}</div>
        </div>
      </div>
    </div>
  </div>
  <Modal v-model:visible="showComment" centered title="Comments" width="1000px" @ok="showComment = false">
    <CommentView :comments="comments" :song-id="songIdC"></CommentView>
    <template #footer v-if="user.email !== ''">
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
    <div class="p-5 pb-32">
      <div class="py-4 pl-4">
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
      <div class="px-4 pb-5">
        <div class="bg-white">
          <div class="px-3">
            <div class="media-item-title rounded p-2.5 text-xl font-medium text-blue-900">Songs</div>
          </div>
          <div
            class="mx-auto grid h-full max-w-7xl grid-cols-2 p-5 pt-1 pb-4 pb-5 sm:px-4 lg:px-1 2xl:max-w-screen-2xl"
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
          :current="pagination.page"
          :disabled="isLoading"
          :page-size="pagination.size"
          :show-total="(count) => `${count} songs`"
          :total="totalSongs"
          class="mt-4 text-right"
          show-less-items
          @change="onChange"
        />
      </div>
      <RelatedCategories :title="title" />
    </div>
  </Spin>
</template>

<script lang="ts" setup>
import {
  Button,
  Dropdown,
  Menu,
  MenuDivider,
  MenuItem,
  Modal,
  notification,
  Pagination,
  Spin,
  Textarea,
} from "ant-design-vue";
import { onMounted, ref } from "vue";
import type { Album, Category, Comment, Country, LikeSong } from "@/types/models";
import { useRoute } from "vue-router";
import { CommentOutlined, HeartOutlined, MenuOutlined, PlayCircleOutlined } from "@ant-design/icons-vue";
import { CategoryService } from "@/services/category";
import { CountryService } from "@/services/country";
import { SongService } from "@/services/song";
import type { PageRequest } from "@/types/pagination";
import { FavoriteSong, RelatedCategories } from "@/components";
import { AlbumService } from "@/services/album";
import { useAuthStore } from "@/stores/auth";
import CommentView from "../../layouts/partials/Comment.vue";

const title = ref("Categories");
const myComments = ref("");
const idSongSubmit = ref(0);
const showComment = ref(false);
const comments = ref<Comment[]>([]);
const songIdC = ref(0);

const opentCommentBox = (songId: number) => {
  fetchComment(songId);

  idSongSubmit.value = songId;
  showComment.value = true;
};

const songs = ref<LikeSong[]>([]);
const albums = ref<Album[]>([]);
const totalSongs = ref(0);
const categories = ref<Category[]>([]);
const country = ref<Country>();
const isLoading = ref(true);
const route = useRoute();
const user = useAuthStore();
const id = route.params.id ? parseInt(route.params.id as string) : null;
const pagination = ref<PageRequest>({
  page: 1,
  countryId: id?.valueOf(),
  size: 10,
});

const handleOk = () => {
  showComment.value = false;
};

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
const categoryDetail = () => {
  if (id) {
    CountryService.detail(id).then(({ data }) => {
      country.value = data.data;
      isLoading.value = false;
    });
    SongService.listNewSong(pagination.value)
      .then(({ data }) => {
        totalSongs.value = data.data.totalItems;
        songs.value = data.data.items.map((e) => {
          return {
            ...e,
            isLike: user.songLikes.includes(e.id),
          };
        });
      })
      .catch(({ message }) => {
        if (message) {
          notification.error({
            message,
          });
        }
      });
    AlbumService.random(id).then(({ data }) => {
      albums.value = data.data;
      isLoading.value = false;
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

onMounted(() => {
  categoryDetail();
  getListCategories();
});

const onChange = (page: number) => {
  pagination.value.page = page;
  categoryDetail();
};
const getListCategories = () => {
  CategoryService.listClient(pagination.value).then(({ data }) => {
    categories.value = data.data.items;
  });
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
