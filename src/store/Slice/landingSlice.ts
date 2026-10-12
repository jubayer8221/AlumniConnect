import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface HeroSlide {
  slideID: string;
  image?: string | null;
  badge?: string | null;
  title: string;
  subtitle?: string | null;
  tag?: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface Stat {
  statID: number;
  section: "HERO" | "ABOUT";
  iconKey: string;
  value: string;
  label: string;
  displayOrder: number;
  isActive: boolean;
}

export interface GalleryPhoto {
  photoID: string;
  imageURL: string;
  caption?: string | null;
  span: 1 | 2;
  displayOrder: number;
  isActive: boolean;
}

export interface LandingContent {
  heroSlides: HeroSlide[];
  heroStats: Stat[];
  aboutStats: Stat[];
  galleryPhotos: GalleryPhoto[];
}

interface LandingState extends LandingContent {
  loading: boolean;
  error: string | null;
  loaded: boolean;
}

const initialState: LandingState = {
  heroSlides: [],
  heroStats: [],
  aboutStats: [],
  galleryPhotos: [],
  loading: false,
  error: null,
  loaded: false,
};

const landingSlice = createSlice({
  name: "landing",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setContent(state, action: PayloadAction<LandingContent>) {
      state.heroSlides = action.payload.heroSlides ?? [];
      state.heroStats = action.payload.heroStats ?? [];
      state.aboutStats = action.payload.aboutStats ?? [];
      state.galleryPhotos = action.payload.galleryPhotos ?? [];
      state.loading = false;
      state.error = null;
      state.loaded = true;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    clearLanding(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { setLoading, setContent, setError, clearLanding } =
  landingSlice.actions;
export default landingSlice.reducer;
