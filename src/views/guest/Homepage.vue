<template>
  <div class="m-2 overflow-hidden rounded opacity-90">
    <Carousel :after-change="onChangeSlide">
      <div v-for="banner in banners" :key="banner.image" class="relative">
        <h1 class="absolute text-8xl text-white" style="top: 50%; left: 20px; transform: translateY(-50%)">
          {{ banner.title }}
        </h1>
        <img :src="banner.image" alt="" class="w-full object-cover" style="height: 420px" />
      </div>
    </Carousel>
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

  <div class="px-4sm:px-6 mx-auto mt-2 max-w-7xl bg-white p-5 lg:px-8 2xl:max-w-screen-2xl">
    <span class="text-3xl font-semibold text-gray-900">New release</span>
  </div>
  <div
    class="mx-auto grid max-w-7xl grid-cols-12 gap-3 space-y-2 bg-white p-5 px-4 sm:px-6 lg:px-8 2xl:max-w-screen-2xl"
  >
    <div
      v-for="(song, index) in musics"
      :key="song.id"
      class="song_item col-span-6 flex w-full border-b-2 border-b-gray-300 p-2"
    >
      <div class="flex w-2/3">
        <div class="mr-4 flex-initial">
          <img
            :id="index"
            :src="song.thumbnail"
            alt=""
            class="mini_thumbnail cursor-pointer"
            @click="choiceSong(song)"
          />
        </div>
        <div class="flex-initial">
          <span class="text-base font-bold text-indigo-800">{{ song.name }}</span>
          <br />
          <span v-for="(singer, i) in song.singers" :key="singer.id">
            <span :id="i">
              <router-link
                :to="{ name: 'singerProfile', params: { id: singer.id } }"
                class="decoration-stage cursor-pointer text-xs font-medium text-indigo-600"
                >{{ singer.stageName }}</router-link
              >
              <span v-if="song.singers.length > 1 && singer.id !== song.singers[song.singers.length - 1].id">, </span>
            </span>
          </span>
        </div>
      </div>
      <div class="flex w-1/6">
        <div class="mr-4 flex w-full flex-col">
          <span class="text-xs text-indigo-400">{{ song.view }} view</span>
        </div>
      </div>
      <div class="flex w-1/6 flex-row-reverse">
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

  <div class="px-4sm:px-4 mx-auto mt-2 max-w-7xl max-w-7xl bg-white p-5 lg:px-6 2xl:max-w-screen-2xl">
    <div class="pl-4 pb-4">
      <span class="text-3xl font-semibold text-gray-900">Popular singer</span>
    </div>
    <div class="grid grid-cols-5">
      <div v-for="(singer, index) in singers" :key="index" class="col-span-1">
        <div class="p-4">
          <div class="wg-box-content singer_avatar relative mx-auto h-52 w-52 overflow-hidden">
            <router-link :to="{ name: 'singerProfile', params: { id: singer.id } }">
              <img
                :src="singer.user.avatar"
                alt=""
                class="image-album-scale h-full w-full cursor-pointer rounded-full object-cover"
              />
            </router-link>
            <div class="wg-box-content-overlay"></div>
            <div class="wg-box-content-details absolute flex w-full flex-row-reverse items-center justify-center">
              <div class="icon-menu-album line-height-0 flex-initial rounded-full p-2"></div>
            </div>
          </div>
          <div class="w-full py-2">
            <router-link :to="{ name: 'singerProfile', params: { id: singer.id } }">
              <div
                class="decoration-stage truncate text-center text-base font-semibold leading-6 text-indigo-800 hover:text-sky-700"
              >
                {{ singer.stageName }}
              </div>
            </router-link>
            <div class="pt-1.5 text-center text-xs font-semibold text-blue-900">
              <span> {{ singer.numberFollow }} Follower</span>
            </div>
            <!--            <div class="py-3 text-center">-->
            <!--              <Button-->
            <!--                  v-if="!isFollow"-->
            <!--                  class="button-follow mx-auto w-32 rounded-full border-blue-700 text-blue-700"-->
            <!--                  html-type="submit"-->
            <!--                  @click="handleFollow()"-->
            <!--              >-->
            <!--                <UserAddOutlined class="icon-follow text-sm"></UserAddOutlined>-->
            <!--                Follow-->
            <!--              </Button>-->
            <!--              <Button-->
            <!--                  v-else-->
            <!--                  class="button-follow mx-auto w-32 rounded-full border-blue-700 text-blue-700"-->
            <!--                  html-type="submit"-->
            <!--                  @click="handleFollow()"-->
            <!--              >-->
            <!--                <CheckOutlined class="text-sm"></CheckOutlined>-->
            <!--                Followed-->
            <!--              </Button>-->
            <!--            </div>-->
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="px-4sm:px-4 mx-auto mt-2 max-w-7xl bg-white p-5 lg:px-6 2xl:max-w-screen-2xl">
    <RelatedCategories :title="title" />
  </div>

  <div class="px-4sm:px-4 mx-auto mt-2 max-w-7xl bg-white p-5 pb-40 lg:px-6 2xl:max-w-screen-2xl">
    <div class="pl-4 pb-4">
      <span class="text-3xl font-semibold text-gray-900">Countries</span>
    </div>
    <div class="grid grid-cols-4">
      <div v-for="(country, index) in countries" :id="index" :key="country.id" class="col-span-1 py-4">
        <div class="">
          <div class="h-44 w-full overflow-hidden p-4 pb-2 pt-0">
            <router-link :to="{ name: 'clientDetailCountry', params: { id: country.id } }">
              <img
                :alt="country.name"
                :src="country.image"
                class="h-full w-full cursor-pointer rounded-md object-cover"
              />
            </router-link>
          </div>
          <div class="pl-4">
            <router-link :to="{ name: 'clientDetailCountry', params: { id: country.id } }">
              <div class="truncate text-base font-medium leading-6 text-gray-900 hover:text-sky-600">
                {{ country.name }}
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CommentOutlined, MenuOutlined } from "@ant-design/icons-vue";
import { FavoriteSong, RelatedCategories } from "@/components";
import { Button, Carousel, Dropdown, Menu, MenuItem, Modal, notification, Textarea } from "ant-design-vue";
import { onMounted, ref } from "vue";
import { SongService } from "@/services/song";

import type { PaginationRequest } from "@/types/pagination";
import type { Comment, Country, LikeSong, Singer } from "@/types/models";
import { useAuthStore } from "@/stores/auth";
import CommentView from "../../layouts/partials/Comment.vue";
import { SingerService } from "@/services/singer";
import { CountryService } from "@/services/country";
import { useRouter } from "vue-router";

const router = useRouter();
const isFollow = ref(false);
const isLoading = ref(true);
let amountFollow = ref(0);
const title = ref("Categories");
const pagination = ref<PaginationRequest>({
  currentPage: 1,
  perPage: 10,
});

const banners = ref([
  {
    image:
      "https://png.pngtree.com/thumb_back/fw800/back_our/20190622/ourmid/pngtree-purple-minimalist-music-note-banner-background-image_233650.jpg",
    title: "Discover",
  },
  {
    image: "https://res.cloudinary.com/kee/image/upload/v1675487872/img_mouseover3_rgx3om.jpg",
    title: "Life",
  },
  {
    image:
      "https://res.cloudinary.com/kee/image/upload/v1675487953/pngtree-blue-geometric-flat-music-banner-background-image_210611_k7o4an.jpg",
    title: "Moment",
  },
  {
    image:
      "https://res.cloudinary.com/kee/image/upload/v1675488064/1000_F_245558111_VvoBPyZrDXEseNy2Y4cqmgUGzuYcscJE_fi37oi.jpg",
    title: "Fetterless",
  },
]);

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

const countries = ref<Country[]>([]);

const singers = ref<Singer[]>([]);

const myComments = ref("");
const idSongSubmit = ref(0);
const showComment = ref(false);
const comments = ref<Comment[]>([]);

const user = useAuthStore();

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

const musics = ref<LikeSong[]>();
const getTopFiveFollow = () => {
  SingerService.topFiveFollow().then(({ data }) => {
    singers.value = data.data;
    isLoading.value = false;
  });
};
const getListCountry = () => {
  CountryService.random().then(({ data }) => {
    countries.value = data.data;
    isLoading.value = false;
  });
};
onMounted(() => {
  getTopFiveFollow();
  getListCountry();
  return SongService.list(pagination.value)
    .then(({ data }) => {
      musics.value = data.data.items.map((e) => {
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
});

const emits = defineEmits(["choiceSongPlay", "addToPlayList"]);

const choiceSong = (song: any) => {
  emits("choiceSongPlay", song);
};

const addToPlayList = (song: any) => {
  emits("addToPlayList", song);
};

const onChangeSlide = () => {
  window.console.clear();
};
</script>

<style scoped>
#main > * {
  @apply pt-12;
}

.mini_thumbnail {
  height: 70px;
  width: 70px;
  object-fit: cover;
  border-radius: 4px;
}

.song_item {
  transition: 0.4s;
  border-radius: 5px;
}

.song_item:hover {
  transform: translateY(-5px);
  background: #e5e5e5;
}

.decoration-stage:hover {
  text-decoration: underline;
}

.button-follow:hover {
  background-color: #1d97ea;
  color: #fff;
  transition: all 0.3s ease-in-out 0s;
}
</style>
