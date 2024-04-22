<template>
  <HeartOutlined
    v-if="!song.isLike"
    class="cursor-pointer text-base font-bold text-indigo-800"
    @click="handleFavorite(song)"
  />
  <HeartFilled v-else @click="handleFavorite(song)" class="cursor-pointer text-red-700" />
</template>

<script lang="ts" setup>
import { HeartOutlined, HeartFilled } from "@ant-design/icons-vue";
import { Modal } from "ant-design-vue";
import type { LikeSong } from "@/types/models";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { LikeService } from "@/services/like";

interface FavoriteSongProps {
  song: LikeSong;
}

defineProps<FavoriteSongProps>();
const user = useAuthStore();
const favoriteLimit = user.package ? user.package?.quantityFavorite : 10;
const router = useRouter();

console.log(user.amountSongLike);

const handleFavorite = (song: LikeSong) => {
  const data = {
    songId: song.id,
  };
  if (user.fullName === "") {
    Modal.confirm({
      title: "Insufficient rights",
      content: "You need to login to be able to use this function. Please press the ok button to go to the login page",
      onOk() {
        router.push({ name: "login" });
      },
    });
  } else if (!song.isLike && user.amountSongLike >= favoriteLimit) {
    Modal.confirm({
      title: "Capacity max",
      content: "To increase the capacity, please press the ok button to go to the premium service to increase the capacity",
      onOk() {
        router.push({ name: "premium" });
      },
    });
  } else {
    LikeService.likeOrUnlike(data).then(() => {
      song.isLike = !song.isLike;
      if (song.isLike) {
        user.setAmountSongLike(user.amountSongLike + 1);
        user.songLikes.push(song.id);
      } else {
        user.setAmountSongLike(user.amountSongLike - 1);
        user.setSongLikes(user.songLikes.filter((e) => e !== song.id));
      }
    });
  }
};
</script>
