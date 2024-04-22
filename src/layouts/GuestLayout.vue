<template>
  <div class="h-screen overflow-hidden bg-gray-100">
    <GuestHeader class="z-20" />
    <div class="mt-16">
      <div class="h-content flex overflow-hidden bg-gray-100">
        <div class="hidden md:flex md:flex-shrink-0">
          <div class="flex w-64 flex-col">
            <GuestSidebar class="z-10" />
          </div>
        </div>
        <div class="flex w-0 flex-1 flex-col overflow-hidden">
          <main class="relative z-0 flex-1 overflow-y-auto focus:outline-none">
            <router-view :key="$route.fullPath" @choiceSongPlay="playSong" @addToPlayList="addSongToPlayList" />
          </main>
        </div>
        <MusicPlayer :song="songIsPlay" :added="songAdded" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MusicPlayer from "@/layouts/partials/MusicPlayer.vue";
import GuestSidebar from "@/layouts/partials/GuestNavigation.vue";
import GuestHeader from "@/layouts/partials/GuestHeader.vue";
import { ref } from "vue";

const songIsPlay = ref<object>({});
const songAdded = ref<object>({});

const playSong = (song: any) => {
  songIsPlay.value = song;
};

const addSongToPlayList = (song: any) => {
  songAdded.value = song;
};
</script>

<style lang="less" scoped></style>
