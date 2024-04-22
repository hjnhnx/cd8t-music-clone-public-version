import { defineStore } from "pinia";
import { CategoryService } from "@/services/category";
import type { Category } from "@/types/models";

interface CategoryState {
  categories: Category[];
  hasFetched: boolean;
}

export const useCategoryStore = defineStore({
  id: "category",
  state: (): CategoryState => ({
    categories: [],
    hasFetched: false,
  }),
  actions: {
    get() {
      CategoryService.getAll().then(({ data }) => {
        this.categories = Array.from(data.data);
        this.hasFetched = true;
      });
    },
    setUser(categories: Category[]) {
      this.categories = categories;
      this.hasFetched = true;
    },
  },
});
