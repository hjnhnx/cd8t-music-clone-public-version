<template>
  <Spin :spinning="isLoading">
    <div class="p-5 pb-32">
      <div class="grid grid-cols-7 px-4 pb-5">
        <div class="col-start-1 col-end-3 p-4 pt-0">
          <div class="wg-box-content relative h-72 w-72 overflow-hidden rounded-lg">
            <a href="#">
              <img :src="album?.thumbnail" alt="" class="image-album-scale h-full w-full cursor-pointer object-cover" />
              <div class="wg-box-content-overlay"></div>
              <div class="wg-box-content-details absolute flex w-full flex-row-reverse items-center justify-center">
                <div class="line-height-0 flex-initial rounded-full p-2">
                  <PlayCircleOutlined
                    class="line-height-0 scale-100 cursor-pointer text-4xl font-bold text-white transition-all hover:scale-110"
                  ></PlayCircleOutlined>
                </div>
              </div>
            </a>
          </div>
          <div class="w-72 pt-4 text-center">
            <div class="truncate text-center text-xl font-semibold leading-6 text-gray-900">
              {{ album?.name }}
            </div>
            <div class="truncate pt-1 text-center text-sm font-normal leading-6 text-gray-500">
              Cập nhật: {{ album ? formatDate(album?.createdAt) : "--" }}
            </div>
            <div class="truncate text-center text-base font-normal leading-6 text-gray-500">
              {{ album?.singer }}
            </div>
            <div class="mx-auto mt-5 text-xs font-medium text-gray-900" style="width: fit-content; font-size: 14px">
              <Button class="rounded-full px-6" html-type="submit" type="primary" @click="syncList">
                <CaretRightOutlined class="text-sm"></CaretRightOutlined>
                PLAY NOW
              </Button>
            </div>
          </div>
          <Modal v-model:visible="showSong" centered title="List Song" width="1000px" @ok="showComment = false">
            <Table
              :columns="columns"
              :data-source="allSongs"
              :pagination="false"
              :row-selection="rowSelection"
              class="h-96 overflow-auto"
              row-key="id"
            ></Table>
            <template #footer>
              <div>
                <Button key="back" @click="handleClose">Close</Button>
                <Button key="submit" type="primary" @click="AddSongToAlbum">Add To Album</Button>
              </div>
            </template>
          </Modal>
        </div>
        <div class="col-start-3 col-end-8">
          <Modal
            v-model:visible="showComment"
            centered
            class="h-96"
            title="Comments"
            width="1000px"
            @ok="showComment = false"
          >
            <CommentView :comments="comments" :song-id="songIdC"></CommentView>
            <template v-if="user.email !== ''" #footer>
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
          <div class="mx-auto h-full max-w-7xl rounded-md bg-white py-4 pt-0 2xl:max-w-screen-2xl">
            <div class="media-item-title flex items-center justify-between px-3">
              <div class="rounded p-2.5 text-lg text-gray-900">Songs</div>
              <div v-if="authStore.singerId === singerId" class="">
                <Button class="rounded-full px-2" type="primary" @click="openListSongBox">
                  <PlusCircleFilled class="text-sm"></PlusCircleFilled>
                  ADD SONG TO ALBUM
                </Button>
              </div>
            </div>
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
      </div>
      <Pagination
        v-if="totalSongs > 5"
        :current="pagination.page"
        :disabled="isLoading"
        :page-size="sizeSong"
        :show-total="(count) => `${count} songs`"
        :total="totalSongs"
        class="mt-4 pr-5 text-right"
        show-less-items
        @change="onChange"
      />
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
  Table,
  Textarea,
} from "ant-design-vue";
import { h, onMounted, ref } from "vue";
import { formatDate } from "@/utils/utils";
import type { Album, Category, Comment, LikeSong, Song } from "@/types/models";
import type { BaseTableColumn } from "@/components/base/BaseTable.vue";
import { useRoute } from "vue-router";
import { AlbumService } from "@/services/album";
import { FavoriteSong, RelatedCategories } from "@/components";
import {
  CaretRightOutlined,
  CommentOutlined,
  HeartOutlined,
  MenuOutlined,
  PlayCircleOutlined,
  PlusCircleFilled,
} from "@ant-design/icons-vue";
import { CategoryService } from "@/services/category";
import type { PageRequest } from "@/types/pagination";
import { useAuthStore } from "@/stores/auth";
import CommentView from "../../layouts/partials/Comment.vue";
import { SongService } from "@/services/song";
import {UserRole} from "@/types/enums";

const songs = ref<LikeSong[]>([]);
const allSongs = ref<Song[]>([]);
const songId = ref<number[]>([]);
const user = useAuthStore();
const album = ref<Album>();
const totalSongs = ref(0);
const sizeSong = ref(0);
const categories = ref<Category[]>([]);
const authStore = useAuthStore();
const isLoading = ref(true);
const pagination = ref<PageRequest>({
  page: 1,
});
const route = useRoute();
const id = route.params.id ? parseInt(route.params.id as string) : null;
const singerId = ref<number>();

const myComments = ref("");
const idSongSubmit = ref(0);
const showComment = ref(false);
const showSong = ref(false);
const comments = ref<Comment[]>([]);
const title = ref("Maybe you are interested");
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

const opentCommentBox = (songId: number) => {
  fetchComment(songId);

  idSongSubmit.value = songId;
  showComment.value = true;
};
const openListSongBox = () => {
  showSong.value = true;
};

const handleOk = () => {
  showComment.value = false;
};
const handleClose = () => {
  showSong.value = false;
};
const columns: BaseTableColumn[] = [
  {
    title: "Thumbnail",
    dataIndex: "thumbnail",
    customRender: ({ record }) => {
      return h("div", {
        innerHTML: `<div class="border-painting group relative max-w-full overflow-hidden sm:w-24 lg:w-32"><div class="hover:shine relative w-full cursor-pointer"><img src="${record.thumbnail}" alt="" class="w-full"></div></div>`,
      });
    },
    key: "thumbnail",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Singer",
    dataIndex: "stageName",
    key: "stageName",
  },
];
const rowSelection = ref({
  checkStrictly: false,
  onChange: (selectedRowKeys: number[]) => {
    songId.value = selectedRowKeys;
  },
});
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
const AddSongToAlbum = () => {
  isLoading.value = true;
  const formData = {
    songId: songId.value,
    albumId: id,
  };
  AlbumService.addSongToAlbum(formData).then(() => {
    notification.success({
      message: `Add song to album successfully`,
    });
    songId.value = [];
    getListSong();
    handleClose();
    albumDetail();
    isLoading.value = false;
  });
};
const albumDetail = () => {
  if (id) {
    AlbumService.detail(id, pagination.value)
      .then(({ data }) => {
        album.value = data.data;
        sizeSong.value = data.data.songs.size;
        totalSongs.value = data.data.songs.totalItems;
        singerId.value = data.data.singerId;
        songs.value = data.data.songs.items.map((e) => {
          return {
            ...e,
            isLike: user.songLikes.includes(e.id),
          };
        });
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
onMounted(() => {
  albumDetail();
  getListCategories();
  if(authStore.role === UserRole.SINGER)
  getListSong();
});

const onChange = (page: number) => {
  pagination.value.page = page;
  albumDetail();
};
const getListCategories = () => {
  CategoryService.listClient(pagination.value).then(({ data }) => {
    categories.value = data.data.items;
  });
};
const getListSong = () => {
  SongService.listNotAlbum().then(({ data }) => {
    allSongs.value = data.data;
  });
};

const emits = defineEmits(["choiceSongPlay", "addToPlayList"]);

const choiceSong = (song: any) => {
  emits("choiceSongPlay", song);
};
const addToPlayList = (song: any) => {
  emits("addToPlayList", song);
};

const syncList = () => {
  const songList = songs.value;
  window.localStorage.setItem("playList", JSON.stringify(songList));
  choiceSong(songList[0]);
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

.media-item-title {
  border-bottom: 1px rgba(0, 0, 0, 0.08) solid;
}

.media-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
