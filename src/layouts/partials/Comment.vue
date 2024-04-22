<template>
  <div style="max-height: 600px; overflow: scroll" class="comment_box">
    <section class="relative flex min-h-screen justify-center bg-white bg-gray-100 antialiased">
      <div v-if="comments.length === 0" class="container mx-auto px-0 sm:px-5">
        <div class="mx-auto w-full flex-col py-4 text-center sm:rounded-lg sm:px-2 sm:py-4 md:w-4/5 md:px-2">
          There are no comments yet
        </div>
      </div>
      <div v-else class="container mx-auto px-0 sm:px-5">
        <div
          v-for="comment in commentList"
          :key="comment.id"
          class="comment_item relative mx-auto my-2 w-full flex-col border-b-2 border-r-2 border-gray-200 bg-white py-4 sm:rounded-lg sm:px-2 sm:py-4 sm:shadow-sm md:w-4/5 md:px-2"
        >
          <DeleteOutlined
            @click="confirmDelete(comment.id)"
            v-if="comment.userId === userId"
            style="position: absolute; right: 10px; top: 10px"
          />
          <div class="flex flex-row">
            <img
              class="h-12 w-12 rounded-full border-2 border-gray-300 object-cover"
              alt="Noob master's avatar"
              :src="comment.avatar"
            />
            <div class="mt-1 flex-col">
              <div class="flex flex-1 items-center px-4 font-bold leading-tight">
                {{ comment.commentBy }}
                <span class="ml-2 text-xs font-normal text-gray-500">{{
                  formatDate(new Date(comment.commentAt))
                }}</span>
              </div>
              <div
                class="ml-2 flex-1 px-2 text-sm font-medium leading-loose text-gray-600"
                v-html="comment.message"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import type { Comment } from "@/types/models";
import { DeleteOutlined } from "@ant-design/icons-vue";
import { useAuthStore } from "@/stores/auth";
import { onMounted, ref, watch } from "vue";
import { SongService } from "@/services/song";
import { Modal, notification } from "ant-design-vue";

const user = useAuthStore();

const userId = ref(0);
const commentList = ref<Comment[]>([]);

interface CommentSongProps {
  comments: Comment[];
  songId: number;
}

const commentsP = defineProps<CommentSongProps>();

watch(
  () => commentsP.comments,
  () => {
    commentList.value = commentsP.comments;
  }
);

onMounted(() => {
  if (user.user) userId.value = user.user.id;
});

const month = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
const formatDate = (date: Date) => {
  return (
    date.getDate() +
    "/" +
    month[date.getMonth()] +
    "/" +
    date.getFullYear() +
    " - " +
    date.getHours() +
    "h" +
    date.getMinutes()
  );
};

const deleteComment = (id: number) => {
  SongService.deleteComment(id)
    .then((res) => {
      if (res.data.code === 200) fetchComment(commentsP.songId);
    })
    .catch(({ message }) => {
      if (message) {
        notification.error({
          message,
        });
      }
    });
};

const fetchComment = (songId: number) => {
  SongService.detail(songId)
    .then((res) => {
      commentList.value = res.data.data.listComment.sort(function (a, b) {
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

const confirmDelete = (id: number) => {
  Modal.confirm({
    title: "Confirm",
    content: "Are you sure you want to delete this comment?",
    okText: "OK",
    cancelText: "Cancel",
    onOk() {
      deleteComment(id);
      notification.success({ message: "delete comment success!" });
    },
  });
};
</script>

<style scoped>
.comment_box::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.comment_item {
  transition: 0.3s;
}

.comment_item:hover {
  box-shadow: #1f2937 1px 2px 10px;
}
</style>
