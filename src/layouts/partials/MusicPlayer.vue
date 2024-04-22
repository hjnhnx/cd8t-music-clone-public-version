<template>
  <div class="mussic_player grid grid-cols-12 bg-black" :class="{ hideBar: hidePlayBar }">
    <Modal v-model:visible="visibleLyric" :title="'Lyric: ' + songIsPlay.name">
      <div class="w-full" v-html="songIsPlay.lyric"></div>
      <template #footer>
        <Button key="back" @click="hideLyric">Close</Button>
      </template>
    </Modal>
    <Modal
      v-model:visible="visiblePlayList"
      style="top: 20px; right: 20px; position: absolute"
      title="Playlist"
      width="300px"
    >
      Added to playlist success!
    </Modal>

    <Modal
      v-model:visible="visiblePlayList"
      style="top: 20px; right: 20px; position: absolute"
      title="Playlist"
      width="450px"
    >
      <div class="w-full">
        <div
          v-for="(song, index) in playList"
          :key="song.id"
          class="song_item col-span-6 flex w-full border-b-2 border-b-gray-300 p-2"
        >
          <div class="flex w-full" @click="playFromPlayList(song)">
            <div class="mr-4 flex-initial">
              <img
                v-if="song.id == songIsPlay.id && play"
                alt=""
                class="mini_thumbnail_p cursor-pointer"
                src="https://res.cloudinary.com/kee/image/upload/v1673445749/Equalizer-by-Alexander-Stets-on-Dribbble_ikax7f.gif"
              />
              <img v-else :id="index" :src="song.thumbnail" alt="" class="mini_thumbnail_p cursor-pointer" />
            </div>
            <div class="flex-initial">
              <span class="text-base font-bold text-indigo-800">{{ song.name }}</span>
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
        </div>
      </div>
      <template #footer>
        <Button key="back" @click="clearPlayList">Clear playlist</Button>
        <Button key="back" @click="hidePlayList">Close</Button>
      </template>
    </Modal>

    <Modal width="1000px" v-model:visible="showComment" title="Comments" centered @ok="showComment = false">
      <CommentView :comments="comments" :song-id="songIdC"></CommentView>
      <template #footer v-if="userIsLogin.email !== ''">
        <div class="grid grid-cols-3 gap-4">
          <div class="col-span-2">
            <Textarea v-model:value="myComments" :rows="1" placeholder="Enter your comment" />
          </div>
          <div>
            <Button key="back"  @click="handleOk">Close</Button>
            <Button @click="SupmitComment(idSongSubmit)" key="submit" type="primary">Submit</Button>
          </div>
        </div>
      </template>
    </Modal>
    <div class="relative col-span-3 box-border flex h-full p-1">
      <div class="mini_thumbnail mr-2 overflow-hidden">
        <img :src="thumbnail" alt="" />
      </div>
      <div>
        <h2 class="song-name">{{ songName }}</h2>
        <h3 class="artist-name">{{ singer }}</h3>
      </div>
      <div class="option">
        <Dropdown>
          <template #overlay>
            <Menu>
              <MenuItem @click="showLyric">Lyric</MenuItem>
              <MenuItem><a :href="song.link" target="_blank">Download</a></MenuItem>
            </Menu>
          </template>
          <i class="fas fa-bars"></i>
        </Dropdown>
      </div>
    </div>
    <div class="relative col-span-6 h-full">
      <div class="controls">
        <div class="volume"><i class="fas fa-volume-up"></i></div>
        <div class="previous"><i class="fas fa-backward" @click="back"></i></div>
        <div class="play" @click="playSong"><i :class="{ 'fa-play': !play, 'fa-pause': play }" class="fas"></i></div>
        <div class="next"><i class="fas fa-forward" @click="findList"></i></div>
        <div class="shuffle">
          <i
            :class="{ 'fa-repeat': repeatList, 'fa-random': random, 'fa-repeat one': repeatOne }"
            class="fas"
            @click="changeStatus"
          ></i>
        </div>
      </div>
      <div class="progress-bar">
        <div class="time--current">{{ currentMinutes }}:{{ currentSeconds }}</div>
        <div class="time--total">{{ durationMinutes }}:{{ durationSeconds }}</div>
        <div :style="{ width: progressPercent }" class="fill"></div>
      </div>
    </div>
    <div class="relative col-span-3">
      <div class="add_to_play_list cursor-pointer" title="Add to playlist" @click="addToPlayList(songIsPlay)">
        <i class="fas fa-list-ol" @click="showPlayList"></i>
      </div>
      <div class="comment"><i class="fa-sharp fa-solid fa-comment cursor-pointer"
                              @click="opentCommentBox(songIsPlay.id)"></i></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUpdated, ref, watch } from "vue";
import { Button, Dropdown, Menu, MenuItem, Modal, notification, Textarea } from "ant-design-vue";
import { SongService } from "@/services/song";
import CommentView from "../../layouts/partials/Comment.vue";
import {useAuthStore} from "@/stores/auth";

const props = defineProps({
  song: Object,
  added: Object
});
const userIsLogin = useAuthStore();
const repeatOne = ref(true);
const repeatList = ref(false);
const random = ref(false);

const play = ref(false);
const url = ref("http://res.cloudinary.com/kee/video/upload/v1620860346/v6xp4uvmo85ebipirffl.mp3");
const thumbnail = ref(
  "https://images.unsplash.com/photo-1611915387288-fd8d2f5f928b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80"
);
const audio = ref(new Audio(url.value));

const currentTime = ref(0);
const currentMinutes = ref(0);
const currentSeconds = ref(0);

const duration = ref(0);
const durationMinutes = ref(0);
const durationSeconds = ref(0);

const songName = ref("");
const singer = ref("");

const progressPercent = ref("0%");

const songIsPlay = ref({});

const visibleLyric = ref(false);
const visiblePlayList = ref(false);
const playList = ref([]);

const hidePlayBar = ref(true);

const viewIsAdded = ref(false);

const myComments = ref("");
const idSongSubmit = ref(0);
const showComment = ref(false);
const comments = ref([]);

const songIdC = ref(0);

const fetchComment = (songId) => {
  songIdC.value = songId;
  SongService.detail(songId)
    .then((res) => {
      comments.value = res.data.data.listComment.sort(function(a, b) {
        return b.id - a.id || a.message.localeCompare(b.message);
      });
    })
    .catch(({ message }) => {
      if (message) {
        notification.error({
          message
        });
      }
    });
};

const opentCommentBox = (songId) => {
  fetchComment(songId);

  idSongSubmit.value = songId;
  showComment.value = true;
};

const handleOk = () => {
  showComment.value = false;
};

const SupmitComment = (songId) => {
  if (myComments.value !== "") {
    SongService.comment({
      message: myComments.value,
      songId: songId
    })
      .then((res) => {
        if (res.data.code === 200) {
          fetchComment(songId);
        }
      })
      .catch(({ message }) => {
        if (message) {
          notification.error({
            message
          });
        }
      });
    myComments.value = "";
  } else {
    notification.warning({ message: "Please enter your comment first" });
  }
};

onUpdated(() => {
  const listsong = JSON.parse(window.localStorage.getItem("playList"));
  if (listsong && listsong.length > 0) {
    hidePlayBar.value = false;
  } else {
    hidePlayBar.value = true;
  }
});

const showLyric = () => {
  visibleLyric.value = true;
};
const hideLyric = () => {
  visibleLyric.value = false;
};
const showPlayList = () => {
  if (JSON.parse(window.localStorage.getItem("playList")).length > 0) {
    const listSong = JSON.parse(window.localStorage.getItem("playList"));
    window.localStorage.setItem(
      "playList",
      JSON.stringify(
        listSong.filter((e) => {
          if (JSON.stringify(e) !== "{}") return e;
        })
      )
    );
    playList.value = JSON.parse(window.localStorage.getItem("playList"));
  }
  visiblePlayList.value = true;
};
const hidePlayList = () => {
  visiblePlayList.value = false;
};

watch(
  () => visiblePlayList.value,
  () => {
    if (window.localStorage.getItem("playList") === "[{}]") {
      clearPlayList();
    }
  }
);

const changeStatus = () => {
  if (repeatList.value) {
    repeatList.value = false;
    repeatOne.value = true;
    random.value = false;
  } else if (repeatOne.value) {
    repeatOne.value = false;
    random.value = true;
    repeatList.value = false;
  } else {
    repeatOne.value = false;
    random.value = false;
    repeatList.value = true;
  }
};

onMounted(() => {
  const listsong = JSON.parse(window.localStorage.getItem("playList"));
  if (listsong && listsong.length > 0) {
    hidePlayBar.value = false;
  }
  const song = JSON.parse(window.localStorage.getItem("song"));
  if (song != null) {
    play.value = false;
    thumbnail.value = song.thumbnail;
    url.value = song.link;
    songName.value = song.name;
    currentTime.value = 0;
    singer.value = song.stageName;
    audio.value.src = song.link;
    songIsPlay.value = song;
    addToPlayList(songIsPlay.value);
  }
});

watch(
  () => props.added,
  () => {
    addToPlayList(props.added);
    let secondsToGo = 1;
    const modal = Modal.success({
      title: "Notifycation",
      content: `Added to playlist success`
    });
    const interval = setInterval(() => {
      secondsToGo -= 1;
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
      modal.destroy();
    }, secondsToGo * 1000);
  }
);

watch(
  () => props.song,
  () => {
    historySong(props.song);
    play.value = false;
    url.value = props.song.link;
    songName.value = props.song.name;
    currentTime.value = 0;
    singer.value = props.song.stageName;
    audio.value.src = props.song.link;
    thumbnail.value = props.song.thumbnail;
    songIsPlay.value = props.song;
    addToPlayList(songIsPlay.value);
    playSong();
  }
);

const playFromPlayList = (song) => {
  historySong(song);
  play.value = false;
  url.value = song.link;
  songName.value = song.name;
  currentTime.value = 0;
  singer.value = song.stageName;
  audio.value.src = song.link;
  thumbnail.value = song.thumbnail;
  songIsPlay.value = song;
  addToPlayList(songIsPlay.value);
  playSong();
};

const playSong = () => {
  viewIsAdded.value = false;
  play.value = !play.value;
  if (play.value && audio.value) {
    audio.value.play();
  } else {
    audio.value.pause();
  }

  audio.value.addEventListener("timeupdate", function() {
    duration.value = audio.value.duration;
    durationMinutes.value = Math.floor(duration.value / 60);
    durationSeconds.value = Math.floor(duration.value % 60);

    // console.log("duration: " + duration.value);
    // console.log("60% duration: " + duration.value * 0.6);
    // console.log("viewIsAdded: " + viewIsAdded.value);
    // console.log(currentTime.value);
    // console.log("-");
    // console.log("-");
    // console.log("-");
    // console.log("-");

    if (durationSeconds.value < 10) {
      durationSeconds.value = `0${durationSeconds.value}`;
    }

    currentTime.value = audio.value.currentTime;
    currentMinutes.value = Math.floor(currentTime.value / 60);
    currentSeconds.value = Math.floor(currentTime.value % 60);
    if (currentSeconds.value < 10) {
      currentSeconds.value = `0${currentSeconds.value}`;
    }

    if (currentTime.value > duration.value * 0.8 && !viewIsAdded.value) {
      SongService.addview(songIsPlay.value.id);
      viewIsAdded.value = true;
    }

    progressPercent.value = (currentTime.value / duration.value) * 100 + "%";
  });

  audio.value.addEventListener("ended", function() {
    audio.value.pause();
    viewIsAdded.value = true;
    play.value = false;
    if (repeatOne.value) {
      playSong();
      return;
    }

    if (repeatList.value) {
      findList();
    }
  });
};

const findList = () => {
  const list = JSON.parse(window.localStorage.getItem("playList"));
  if (!list && list.length === 0) {
    playSong();
  }

  const lastSongIndex = list.length - 1;
  const currentIndex = list.findIndex((s) => s.id === songIsPlay.value.id);
  const index = currentIndex < lastSongIndex ? currentIndex + 1 : 0;
  const nextSong = list[index];

  historySong(nextSong);
  play.value = false;
  url.value = nextSong.link;
  songName.value = nextSong.name;
  currentTime.value = 0;
  singer.value = nextSong.stageName;
  audio.value.src = nextSong.link;
  thumbnail.value = nextSong.thumbnail;
  songIsPlay.value = nextSong;
  playSong();
};

const back = () => {
  const list = JSON.parse(window.localStorage.getItem("playList"));
  if (!list && list.length === 0) {
    playSong();
  }

  const lastSongIndex = list.length - 1;
  const currentIndex = list.findIndex((s) => s.id === songIsPlay.value.id);
  const index = currentIndex > 0 ? currentIndex - 1 : lastSongIndex;
  const nextSong = list[index];

  historySong(nextSong);
  play.value = false;
  url.value = nextSong.link;
  songName.value = nextSong.name;
  currentTime.value = 0;
  singer.value = nextSong.stageName;
  audio.value.src = nextSong.link;
  thumbnail.value = nextSong.thumbnail;
  songIsPlay.value = nextSong;
  playSong();
};

const historySong = (song) => {
  window.localStorage.setItem("song", JSON.stringify(song));
};

const addToPlayList = (s) => {
  if (window.localStorage.getItem("playList") == null || window.localStorage.getItem("playList") === "[{}]") {
    const list = [];
    list.push(s);
    window.localStorage.setItem("playList", JSON.stringify(list));
  } else {
    const playList = JSON.parse(window.localStorage.getItem("playList"));
    const inPlayList = playList.find((e) => e.id === s.id);
    if (!inPlayList) {
      playList.push(s);
      window.localStorage.setItem("playList", JSON.stringify(playList));
    }
  }
};

const clearPlayList = () => {
  if (window.localStorage.getItem("playList")) {
    window.localStorage.removeItem("playList");
    window.localStorage.removeItem("song");
    audio.value.pause();
    songIsPlay.value = {};
    play.value = false;
  }

  hidePlayList();
};
</script>

<style>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css");
@import url("https://fonts.googleapis.com/css?family=Questrial");

.mini_thumbnail_p {
  height: 65px;
  width: 65px;
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

.one::after {
  content: "1";
  font-size: 8px;
  padding-left: 2px;
}

.mussic_player {
  height: 90px;
  width: 100%;
  position: fixed;
  bottom: 0;
  z-index: 20;
}

.heart,
.comment,
.add_to_play_list,
.play_list {
  color: #ffffff;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.add_to_play_list {
  right: 60px;
}

.comment {
  right: 90px;
}

.play_list {
  right: 30px;
}

.mini_thumbnail {
  height: 80px;
  width: 80px;
}

.mini_thumbnail > img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.progress-bar {
  height: 4px;
  width: 85%;
  margin: 15px auto 10px auto;
  background: #ffffff;
  border-radius: 10px;
  font-family: "Questrial", sans-serif;
}

.fill {
  background-color: #ffd800;
  height: 100%;
  border-radius: 2px;
}

.time--current,
.time--total {
  color: #ffffff;
  font-size: 11px;
  position: absolute;
  margin-top: -5px;
}

.time--current {
  left: 15px;
}

.time--total {
  right: 15px;
}

.song-name,
.artist-name {
  font-family: "Questrial", sans-serif;
  text-transform: uppercase;
  margin: 0;
  height: 13px !important;
}

.song-name {
  font-size: 0.7em;
  letter-spacing: 3px;
  color: #ffffff;
}

.artist-name {
  font-size: 0.6em;
  font-weight: bold;
  letter-spacing: 1.5px;
  color: #ffffff;
  margin-top: 5px;
}

.controls {
  display: flex;
  align-items: center;
  font-size: 0.9em;
  justify-content: center;
  color: #ffffff;
}

.controls,
.controls .pause {
  margin: 15px 25px;
  color: #ffffff;
}

.play {
  margin: 10px 25px;
  color: #ffffff;
}

.controls .option {
  left: 10px;
  position: absolute;
  font-size: 0.9em;
}

.controls .add {
  right: 10px;
  position: absolute;
  font-size: 0.9em;
}

.controls .volume {
  margin-right: 30px;
  font-size: 0.9em;
}

.controls .shuffle {
  margin-left: 30px;
  font-size: 0.9em;
}

.play,
.pause,
.next,
.previous,
.option,
.add,
.volume,
.shuffle {
  transition: all 0.5s ease;
}

.option {
  position: absolute;
  right: 50px;
  top: 50%;
  transform: translateY(-50%);
  color: #ffffff;
}

.play:hover,
.pause:hover,
.next:hover,
.previous:hover,
.option:hover,
.add:hover,
.volume:hover,
.shuffle:hover {
  color: #fffae7;
}

.controls i {
  font-weight: bold;
  cursor: pointer;
}

.hideBar {
  display: none !important;
}
</style>
