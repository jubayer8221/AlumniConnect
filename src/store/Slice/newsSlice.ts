import { NewsItem } from "@/components/news/NewsSection";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NewsState {
  newsList: NewsItem[];
  selectedNews: NewsItem | null;
  loading: boolean;
  error: string | null;
}

const initialState: NewsState = {
  newsList: [],
  selectedNews: null,
  loading: false,
  error: null,
};

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setNewsList(state, action: PayloadAction<NewsItem[]>) {
      state.newsList = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedNews(state, action: PayloadAction<NewsItem | null>) {
      state.selectedNews = action.payload;
    },
    addNewsItem(state, action: PayloadAction<NewsItem>) {
      state.newsList.unshift(action.payload);
    },
    updateNewsItem(state, action: PayloadAction<NewsItem>) {
      const index = state.newsList.findIndex(
        (n) => n.NewsID === action.payload.NewsID,
      );
      if (index !== -1) {
        state.newsList[index] = action.payload;
      }
      if (state.selectedNews?.NewsID === action.payload.NewsID) {
        state.selectedNews = action.payload;
      }
    },
    deleteNewsItem(state, action: PayloadAction<string>) {
      state.newsList = state.newsList.filter(
        (n) => n.NewsID !== action.payload,
      );
      if (state.selectedNews?.NewsID === action.payload) {
        state.selectedNews = null;
      }
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setLoading,
  setNewsList,
  setSelectedNews,
  addNewsItem,
  updateNewsItem,
  deleteNewsItem,
  setError,
} = newsSlice.actions;

export default newsSlice.reducer;
