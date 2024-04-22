<template>
  <div
    :style="{
      backgroundImage: 'url(' + imageBanner + ')',
    }"
    class="relative mx-auto h-80 bg-transparent bg-cover bg-center bg-no-repeat px-4 pt-24 pb-6 bg-blend-overlay transition-colors duration-500 sm:px-6 md:px-8"
  >
    <div class="col-span-full mx-auto px-4 py-6 sm:px-6 md:px-8" style="z-index: 2">
      <div class="grid grid-flow-col">
        <div class="col-span-8 grid-rows-2" style="z-index: 2">
          <div class="mb-5 text-7xl font-bold text-white" style="width: fit-content">New Song</div>
        </div>
      </div>
    </div>
  </div>
  <Modal width="1000px" v-model:visible="showComment" title="Comments" centered @ok="showComment = false">
    <CommentView :comments="comments" :song-id="songIdC"></CommentView>
    <template #footer v-if="user.email !== ''">
      <div class="grid grid-cols-3 gap-4">
        <div class="col-span-2">
          <Textarea v-model:value="myComments" :rows="1" placeholder="Enter your comment" />
        </div>
        <div>
          <Button key="back" @click="handleOk">Close</Button>
          <Button @click="SupmitComment(idSongSubmit)" key="submit" type="primary">Submit</Button>
        </div>
      </div>
    </template>
  </Modal>
  <Spin :spinning="isLoading">
    <BaseMain>
      <div class="rounded-md pb-52">
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
          :page-size="sizeSong"
          :show-total="(count) => `${count} songs`"
          :total="totalSongs"
          class="mt-4 text-right"
          show-less-items
          @change="onChange"
        />
      </div>
    </BaseMain>
  </Spin>
</template>

<script lang="ts" setup>
import { BaseMain, FavoriteSong } from "@/components";
import { Button, Dropdown, Menu, MenuItem, Modal, notification, Pagination, Spin, Textarea } from "ant-design-vue";
import CommentView from "../../layouts/partials/Comment.vue";
import { CommentOutlined, MenuOutlined } from "@ant-design/icons-vue";
import { SongService } from "@/services/song";
import { onMounted, ref } from "vue";
import type { Comment, LikeSong } from "@/types/models";
import type { PageRequest } from "@/types/pagination";
import { useAuthStore } from "@/stores/auth";

const user = useAuthStore();
const songs = ref<LikeSong[]>([]);
const isLoading = ref<boolean>(false);
const totalSongs = ref(0);
const sizeSong = ref(0);
const showComment = ref(false);
const imageBanner = ref("https://res.cloudinary.com/albiceleste/image/upload/v1675089033/opyfe8czticdcd8llbts.jpg");
const pagination = ref<PageRequest>({
  page: 1,
});
const myComments = ref("");

onMounted(() => {
  getListNewSong();
});

const emits = defineEmits(["choiceSongPlay", "addToPlayList"]);
const choiceSong = (song: any) => {
  emits("choiceSongPlay", song);
};

const idSongSubmit = ref(0);
const songIdC = ref(0);
const comments = ref<Comment[]>([]);

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

const opentCommentBox = (songId: number) => {
  fetchComment(songId);

  idSongSubmit.value = songId;
  showComment.value = true;
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

const handleOk = () => {
  showComment.value = false;
};

const addToPlayList = (song: any) => {
  emits("addToPlayList", song);
};
const getListNewSong = () => {
  SongService.listNewSong(pagination.value)
    .then(({ data }) => {
      totalSongs.value = data.data.totalItems;
      sizeSong.value = data.data.size;
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
};
const onChange = (page: number) => {
  pagination.value.page = page;
  getListNewSong();
};
</script>

<style scoped>
#main > * {
  @apply pt-12;
}

.media-item {
  border-bottom: 1px rgba(0, 0, 0, 0.08) solid;
}

.media-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
