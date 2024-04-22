import { defineStore } from "pinia";
import type { ResponseData, UserProfile } from "@/types/models";
import { UserRole } from "@/types/enums";
import { AuthService } from "@/services/auth";
import { appLocalStorage } from "@/utils/storage";
import { AUTHORIZATION_KEY } from "@/utils/constants";
import router from "@/router";

interface ProgramState {
  user?: UserProfile;
  amountSongLike: number;
  songLikes: number[];
  starPoints: number;
}

export const useAuthStore = defineStore({
  id: "auth",
  state: (): ProgramState => ({
    user: undefined,
    amountSongLike: 0,
    songLikes: [],
    starPoints: 0
  }),
  getters: {
    isRole: (state) => {
      return (role: UserRole) => state.user?.role === role;
    },
    isAdmin: (state) => state.user?.role === UserRole.ADMIN,
    isModerator: (state) => state.user?.role === UserRole.MODERATOR,
    isSinger: (state) => state.user?.role === UserRole.SINGER,
    isUser: (state) => state.user?.role === UserRole.USER,
    role: (state) => (state.user ? state.user.role : 0),
    fullName: (state) => (state.user ? state.user.firstName + " " + state.user.lastName : ""),
    email: (state) => (state.user ? state.user.email : ""),
    singerId: (state) => (state.user ? state.user.singerId : undefined),
    roleText: (state) => (state.user ? UserRole[state.user.role] : ""),
    avatar: (state) => (state.user ? state.user.avatar : undefined),
    package: (state) => (state.user ? state.user.packaged : undefined),
    singerFollow: (state) => (state.user ? state.user.singerFollow : []),
    starPoint: (state) => (state.starPoints),
    themeRgb: (state) => {
      switch (state.user?.role) {
        case UserRole.ADMIN:
          return "30, 58, 138"; // blue #1e3a8a
        case UserRole.MODERATOR:
          return "127, 29, 29"; // red #7f1d1d
        case UserRole.SINGER:
          return "88, 28, 135"; // purple #581c87
        case UserRole.USER:
        default:
          return "17, 24, 39"; // black #111827
      }
    },
    themeColor(): string {
      return `rgba(${this.themeRgb}, 1)`;
    },
  },
  actions: {
    async getProfile() {
      await AuthService.getProfile().then(({ data }: { data: ResponseData<UserProfile> }) => {
        if (data.data) {
          this.setUser(data.data);
          this.setAmountSongLike(data.data.amountSongLike);
          this.setSongLikes(data.data.songLike);
          this.setStarPoint(data.data.starPoint);
          return Promise.resolve(data.data);
        } else {
          appLocalStorage.removeItem(AUTHORIZATION_KEY);
          router.push({ name: "login" });
        }
      }).catch((err) => {
        appLocalStorage.removeItem(AUTHORIZATION_KEY);
        router.push({ name: "login" });
      });
    },
    setUser(user: UserProfile) {
      this.user = user;
    },
    removeUser() {
      this.user = undefined;
    },
    setAmountSongLike(amount: number) {
      this.amountSongLike = amount;
    },
    setSongLikes(arr: number[]) {
      this.songLikes = arr;
    },
    setStarPoint(amount: number){
      this.starPoints = amount;
    }
  },
});
