// src/hooks/useConnections.ts
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "@/services/api/apiClient";
import type { RootState } from "@/store/store";
import {
  clearConnectionData,
  clearConnectionStatus,
  setConnectionStatus,
  setConnections,
  setPendingRequests,
} from "@/store/Slice/connectionSlice";
import type { ConnectionItem, ConnectionStatusInfo } from "@/types/connection";
import { useAuth } from "@/hooks/useAuth";

export const useConnections = () => {
  const { authUser } = useAuth();
  const dispatch = useDispatch();
  const { connections, pendingRequests, statuses } = useSelector(
    (state: RootState) => state.connection,
  );
  const [loading, setLoading] = useState(false);

  const handleError = (error: unknown, fallback: string) => {
    const msg =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || (error as Error).message;
    console.error(fallback, msg);
    throw error;
  };

  /* ---------- GET /api/Connection/GetMyConnections ---------- */
  const fetchMyConnections = useCallback(async () => {
    if (!authUser) return;
    setLoading(true);
    try {
      const res = await api.get<ConnectionItem[]>(
        "/Connection/GetMyConnections",
      );
      dispatch(setConnections(res.data ?? []));
      return res.data;
    } catch (error) {
      handleError(error, "Error fetching connections:");
    } finally {
      setLoading(false);
    }
  }, [authUser, dispatch]);

  /* ---------- GET /api/Connection/GetPendingRequests ---------- */
  const fetchPendingRequests = useCallback(async () => {
    if (!authUser) return;
    setLoading(true);
    try {
      const res = await api.get<ConnectionItem[]>(
        "/Connection/GetPendingRequests",
      );
      dispatch(setPendingRequests(res.data ?? []));
      return res.data;
    } catch (error) {
      handleError(error, "Error fetching pending requests:");
    } finally {
      setLoading(false);
    }
  }, [authUser, dispatch]);

  /* ---------- GET /api/Connection/GetStatus/{otherUserId} ---------- */
  const fetchStatus = useCallback(
    async (otherUserID: number) => {
      if (!authUser || !otherUserID) return;
      try {
        const res = await api.get<ConnectionStatusInfo>(
          `/Connection/GetStatus/${otherUserID}`,
        );
        dispatch(
          setConnectionStatus({
            otherUserID,
            info: res.data ?? { status: null, isRequester: false },
          }),
        );
        return res.data;
      } catch (error) {
        handleError(error, "Error fetching connection status:");
      }
    },
    [authUser, dispatch],
  );

  /* ---------- POST /api/Connection/SendRequest ---------- */
  const sendRequest = useCallback(
    async (addresseeUserID: number) => {
      if (!authUser) return;
      setLoading(true);
      try {
        await api.post("/Connection/SendRequest", { addresseeUserID });
        // status is now PENDING from this side
        dispatch(
          setConnectionStatus({
            otherUserID: addresseeUserID,
            info: {
              connectionID: null,
              status: "PENDING",
              isRequester: true,
            },
          }),
        );
      } catch (error) {
        handleError(error, "Error sending request:");
      } finally {
        setLoading(false);
      }
    },
    [authUser, dispatch],
  );

  /* ---------- POST /api/Connection/Respond ---------- */
  const respondRequest = useCallback(
    async (connectionID: number, accept: boolean) => {
      if (!authUser) return;
      setLoading(true);
      try {
        await api.post("/Connection/Respond", { connectionID, accept });
        await fetchPendingRequests();
        await fetchMyConnections();
      } catch (error) {
        handleError(error, "Error responding to request:");
      } finally {
        setLoading(false);
      }
    },
    [authUser, fetchMyConnections, fetchPendingRequests],
  );

  /* ---------- POST /api/Connection/Remove ---------- */
  const removeConnection = useCallback(
    async (otherUserID: number) => {
      if (!authUser) return;
      setLoading(true);
      try {
        await api.post("/Connection/Remove", { otherUserID });
        dispatch(clearConnectionStatus(otherUserID));
        await fetchMyConnections();
      } catch (error) {
        handleError(error, "Error removing connection:");
      } finally {
        setLoading(false);
      }
    },
    [authUser, dispatch, fetchMyConnections],
  );

  const clearConnectionDataHandler = useCallback(() => {
    dispatch(clearConnectionData());
  }, [dispatch]);

  return {
    connections,
    pendingRequests,
    statuses,
    loading,
    fetchMyConnections,
    fetchPendingRequests,
    fetchStatus,
    sendRequest,
    respondRequest,
    removeConnection,
    clearConnectionDataHandler,
    authUser,
  };
};
