import { defineStore } from "pinia";
import { UserRole } from "@/types/enums";

interface StarPointState {
  price: number;
}

export const useStarPointState = defineStore({
  id: "starPoint",
  state: (): StarPointState => ({
    price: 0,
  }),
  getters: {
    money: (state) => (state.price ? state.price : 0),
  },
  actions: {
    setPrice(price: number) {
      this.price = price;
    },
  },
});
