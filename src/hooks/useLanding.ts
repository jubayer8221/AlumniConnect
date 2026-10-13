import { useCallback } from "react";
import { isAxiosError } from "axios";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  setContent,
  setLoading,
  setError,
  type LandingContent,
} from "@/store/Slice/landingSlice";
import api from "@/services/api/apiClient";

export interface CreateUpdateHeroSlidePayload {
  slideID?: string | null;
  image?: string;
  badge?: string;
  title: string;
  subtitle?: string;
  tag?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface CreateUpdateGalleryPhotoPayload {
  photoID?: string | null;
  imageURL: string;
  caption?: string;
  span?: 1 | 2;
  displayOrder?: number;
  isActive?: boolean;
}

let landingContentRequest: Promise<LandingContent | null> | null = null;

const unwrapError = (err: unknown, fallback: string): string => {
  if (isAxiosError<{ message?: string }>(err)) {
    return err.response?.data?.message ?? err.message ?? fallback;
  }
  return err instanceof Error ? err.message : fallback;
};

export const useLanding = () => {
  const dispatch = useAppDispatch();
  const {
    heroSlides,
    heroStats,
    aboutStats,
    galleryPhotos,
    loading,
    error,
    loaded,
  } = useAppSelector((s) => s.landing);

  /* ---------- GET /api/Landing/GetLandingContent ---------- */
  const fetchLandingContent = useCallback(
    async (force = false) => {
      if (loaded && !force) return;
      if (landingContentRequest) return landingContentRequest;

      dispatch(setLoading(true));
      const request = api
        .get<LandingContent>("/Landing/GetLandingContent")
        .then((res) => {
          dispatch(setContent(res.data));
          return res.data;
        })
        .catch((err: unknown) => {
          dispatch(setError(unwrapError(err, "Failed to load landing content")));
          return null;
        })
        .finally(() => {
          landingContentRequest = null;
        });
      landingContentRequest = request;
      return request;
    },
    [dispatch, loaded],
  );

  /* ---------- POST /api/Landing/CreateUpdateHeroSlide ---------- */
  const createUpdateHeroSlide = useCallback(
    async (payload: CreateUpdateHeroSlidePayload) => {
      try {
        await api.post("/Landing/CreateUpdateHeroSlide", payload);
        await fetchLandingContent(true);
      } catch (err: unknown) {
        throw new Error(unwrapError(err, "Failed to save hero slide"));
      }
    },
    [fetchLandingContent],
  );

  /* ---------- POST /api/Landing/DeleteHeroSlide ---------- */
  const deleteHeroSlide = useCallback(
    async (slideID: string) => {
      try {
        await api.post("/Landing/DeleteHeroSlide", { slideID });
        await fetchLandingContent(true);
      } catch (err: unknown) {
        throw new Error(unwrapError(err, "Failed to delete hero slide"));
      }
    },
    [fetchLandingContent],
  );

  /* ---------- Slide helpers ---------- */
  const getSlideById = useCallback(
    (id: string) => heroSlides.find((s) => s.slideID === id) ?? null,
    [heroSlides],
  );

  const createUpdateGalleryPhoto = useCallback(
    async (payload: CreateUpdateGalleryPhotoPayload) => {
      try {
        await api.post("/Landing/CreateUpdateGalleryPhoto", payload);
        await fetchLandingContent(true);
      } catch (err: unknown) {
        throw new Error(unwrapError(err, "Failed to save gallery photo"));
      }
    },
    [fetchLandingContent],
  );

  const deleteGalleryPhoto = useCallback(
    async (photoID: string) => {
      try {
        await api.post("/Landing/DeleteGalleryPhoto", { photoID });
        await fetchLandingContent(true);
      } catch (err: unknown) {
        throw new Error(unwrapError(err, "Failed to delete gallery photo"));
      }
    },
    [fetchLandingContent],
  );

  const getPhotoById = useCallback(
    (id: string) => galleryPhotos.find((p) => p.photoID === id) ?? null,
    [galleryPhotos],
  );

  return {
    heroSlides,
    heroStats,
    aboutStats,
    galleryPhotos,
    loading,
    error,
    loaded,
    fetchLandingContent,
    createUpdateHeroSlide,
    deleteHeroSlide,
    createUpdateGalleryPhoto,
    deleteGalleryPhoto,
    getSlideById,
    getPhotoById,
  };
};
