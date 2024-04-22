import { defineStore } from "pinia";
import { SingerService } from "@/services/singer";
import type { Singer } from "@/types/models";

interface SingerState {
  singers: Singer[];
  hasFetched: boolean;
}

export const useSingerStore = defineStore({
  id: "singer",
  state: (): SingerState => ({
    singers: [],
    hasFetched: false,
  }),
  actions: {
    get() {
      SingerService.getAll().then(({ data }) => {
        this.singers = Array.from(data.data);
        this.hasFetched = true;
      });
    },
    setUser(singers: Singer[]) {
      this.singers = singers;
      this.hasFetched = true;
    },
  },
});
