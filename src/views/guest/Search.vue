<template>
  <Spin :spinning="isLoading">
    <div class="search-bg fixed z-10 block w-full px-9 py-4">
      <div class="finder w-96 rounded-full">
        <div class="finder__outer rounded-full p-1.5">
          <div class="flex items-center">
            <div
              class="ml-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black"
              @click="search()"
            >
              <SearchOutlined class="finder__icon my-auto text-white" style="font-size: 20px" />
            </div>
            <div class="rm-focus ml-2">
              <Input v-model:value="keyword" class="finder__input w-72" placeholder="What do you want to listen to?" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="px-5 pt-20 pb-72">
      <div v-if="songs.length > 0" class="grid grid-cols-5 pt-7 pb-5">
        <div class="col-start-1 col-end-3 p-4 pt-0">
          <div class="mb-3">
            <span class="text-2xl font-semibold text-gray-900">Top Result</span>
          </div>
          <div class="wg-box cursor-pointer rounded-lg bg-white p-5 transition">
            <div class="image-song relative h-24 w-24 overflow-hidden rounded-lg">
              <a href="#" @click="choiceSong(songs[0])">
                <img :src="songs[0].thumbnail" alt="" class="h-full w-full cursor-pointer object-cover" />
              </a>
            </div>
            <div class="w-full pt-6">
              <div
                class="h-full cursor-pointer truncate text-center text-4xl font-bold text-gray-900"
                style="line-height: 3.5rem"
              >
                {{ songs[0].name }}
              </div>
              <div class="">
                <span v-for="(singer, i) in songs[0].singers" :key="singer.id">
                  <span :id="i">
                    <router-link
                      :to="{ name: 'singerProfile', params: { id: singer.id } }"
                      class="cursor-pointer truncate pt-5 pb-2 text-base font-semibold text-gray-800"
                      >{{ singer.stageName }}</router-link
                    >
                    <span
                      v-if="
                        songs[0].singers.length > 1 && singer.id !== songs[0].singers[songs[0].singers.length - 1].id
                      "
                      >,
                    </span>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="songs.length > 0" class="mx-auto h-full max-w-7xl rounded-md py-4 pt-0 2xl:max-w-screen-2xl">
        <div class="mb-3 pl-3">
          <span class="text-2xl font-semibold text-gray-900">Songs</span>
        </div>
        <div class="grid grid-cols-5">
          <div v-for="song in songs" :key="song.id" class="col-span-1">
            <div class="p-4">
              <div class="wg-box cursor-pointer rounded-lg bg-white p-3.5 transition">
                <div class="image-song relative mx-auto h-44 w-auto overflow-hidden rounded-lg">
                  <a href="#" @click="choiceSong(song)">
                    <img :src="song.thumbnail" alt="" class="h-full w-full cursor-pointer object-cover" />
                  </a>
                </div>
                <div class="w-full pt-4">
                  <div class="truncate text-lg font-bold leading-6 text-gray-900 hover:text-sky-700">
                    {{ song.name }}
                  </div>
                  <div class="">
                    <span v-for="(singer, i) in song.singers" :key="singer.id">
                      <span :id="i">
                        <router-link
                          :to="{ name: 'singerProfile', params: { id: singer.id } }"
                          class="cursor-pointer truncate pt-2 pb-2 text-base font-semibold text-gray-800 hover:text-sky-700"
                          >{{ singer.stageName }}</router-link
                        >
                        <span v-if="song.singers.length > 1 && singer.id !== song.singers[song.singers.length - 1].id"
                          >,
                        </span>
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Pagination
          v-if="totalSongs > 10"
          :current="currentPage"
          :disabled="isLoading"
          :page-size="pagination.perPage"
          :show-total="(count) => `${count} songs`"
          :total="totalSongs"
          class="mt-4 pr-5 text-right"
          show-less-items
          @change="onChange"
        />
      </div>
      <div v-if="songs.length < 1">
        <div class="pb-1 pt-3 pl-4">
          <span class="text-3xl font-semibold text-gray-900">{{ title }}</span>
        </div>
        <div class="grid grid-cols-5">
          <div v-for="(data, index) in categories" :key="data.id" class="col-span-1">
            <div class="p-4">
              <div class="wg-box-content relative h-52 w-full overflow-hidden">
                <router-link :to="{ name: 'clientDetailCategory', params: { id: data.id } }">
                  <img
                    :id="index"
                    :src="data.banner"
                    alt=""
                    class="image-album-scale h-full w-full cursor-pointer rounded-md object-cover"
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
                <router-link :to="{ name: 'clientDetailCategory', params: { id: data.id } }">
                  <div class="truncate text-base font-medium leading-6 text-gray-900 hover:text-sky-600">
                    {{ data.name }}
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Spin>
</template>

<script lang="ts" setup>
import { Input, Pagination, Spin } from "ant-design-vue";
import { onMounted, ref } from "vue";
import type { Category, Song } from "@/types/models";
import { useRoute } from "vue-router";
import type { PaginationRequest } from "@/types/pagination";
import { CategoryService } from "@/services/category";
import { useAuthStore } from "@/stores/auth";
import { SongService } from "@/services/song";
import { PlayCircleOutlined, SearchOutlined } from "@ant-design/icons-vue";

const title = ref("Browse all");
const songs = ref<Song[]>([]);
const categories = ref<Category[]>([]);
const isLoading = ref(true);
const route = useRoute();
const user = useAuthStore();
const id = route.params.id ? parseInt(route.params.id as string) : null;
const keyword = ref<string>("");
const currentPage = ref<number>(1);
const totalSongs = ref<number>(0);
const pagination = ref<PaginationRequest>({
  keyword: "",
  currentPage: 1,
  perPage: 10,
});
onMounted(() => {
  getAll();
});

const emits = defineEmits(["choiceSongPlay", "addToPlayList"]);

const choiceSong = (song: any) => {
  emits("choiceSongPlay", song);
};
const getAll = () => {
  CategoryService.getAll().then(({ data }) => {
    categories.value = data.data;
    isLoading.value = false;
  });
};
const search = () => {
  const params = {
    ...pagination.value,
    page: currentPage.value,
    keyword: keyword.value,
  };
  SongService.list(params).then(({ data }) => {
    totalSongs.value = data.data.totalItems;
    songs.value = data.data.items;
    isLoading.value = false;
  });
};
const onChange = (page: number, size: number) => {
  currentPage.value = page;
  pagination.value.perPage = size;
  search();
};
</script>
<style scoped>
.search-bg {
  background-color: #eaeaea;
}

.finder {
  border: 1px solid #fff;
  background-color: #f6f5f0;
  padding: 3px;
  box-shadow: 9px 9px 16px rgba(189, 189, 189, 0.6), -9px -9px 16px rgba(255, 255, 255, 0.5);
}

.finder__outer {
  box-shadow: inset 10px 10px 15px -10px #c3c3c3, inset -10px -10px 15px -10px #ffffff;
}

.finder__input {
  border: none;
  background-color: transparent;
  outline: none;
}

.rm-focus input[type="text"]:focus {
  box-shadow: none;
}

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

.wg-box:hover {
  background-color: rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease-in-out 0s;
}

.image-song {
  box-shadow: 0 8px 24px rgb(0 0 0 / 50%);
}
</style>
