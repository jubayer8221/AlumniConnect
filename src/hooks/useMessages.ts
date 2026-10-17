// src/hooks/useMessages.ts
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "@/services/api/apiClient";
import type { RootState } from "@/store/store";
import {
  appendMessage,
  clearMessageData,
  setActivePartner,
  setConversations,
  setThread,
} from "@/store/Slice/messageSlice";
import type { ConversationSummary, MessageItem } from "@/types/message";
import { useAuth } from "@/hooks/useAuth";

export const useMessages = () => {
  const { authUser } = useAuth();
  const dispatch = useDispatch();
  const { conversations, threads, activePartnerID } = useSelector(
    (state: RootState) => state.message,
  );
  const [loading, setLoading] = useState(false);

  const handleError = (error: unknown, fallback: string) => {
    const msg =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || (error as Error).message;
    console.error(fallback, msg);
    throw error;
  };

  /* ---------- GET /api/Message/GetConversations ---------- */
  const fetchConversations = useCallback(async () => {
    if (!authUser) return;
    setLoading(true);
    try {
      const res = await api.get<ConversationSummary[]>(
        "/Message/GetConversations",
      );
      dispatch(setConversations(res.data ?? []));
      return res.data;
    } catch (error) {
      handleError(error, "Error fetching conversations:");
    } finally {
      setLoading(false);
    }
  }, [authUser, dispatch]);

  /* ---------- GET /api/Message/GetConversation/{otherUserId} ---------- */
  const fetchConversation = useCallback(
    async (otherUserID: number) => {
      if (!authUser || !otherUserID) return;
      setLoading(true);
      try {
        const res = await api.get<MessageItem[]>(
          `/Message/GetConversation/${otherUserID}`,
        );
        dispatch(
          setThread({ partnerID: otherUserID, messages: res.data ?? [] }),
        );
        dispatch(setActivePartner(otherUserID));
        return res.data;
      } catch (error) {
        handleError(error, "Error fetching conversation:");
      } finally {
        setLoading(false);
      }
    },
    [authUser, dispatch],
  );

  /* ---------- POST /api/Message/Send ---------- */
  const sendMessage = useCallback(
    async (receiverUserID: number, content: string) => {
      if (!authUser || !content.trim()) return;
      try {
        await api.post("/Message/Send", { receiverUserID, content });
        // Re-fetch conversation to include the newly sent message
        await fetchConversation(receiverUserID);
      } catch (error) {
        handleError(error, "Error sending message:");
      }
    },
    [authUser, fetchConversation],
  );

  /* ---------- POST /api/Message/MarkRead/{messageId} ---------- */
  const markMessageRead = useCallback(
    async (messageID: number) => {
      if (!authUser) return;
      try {
        await api.post(`/Message/MarkRead/${messageID}`);
      } catch (error) {
        handleError(error, "Error marking message read:");
      }
    },
    [authUser],
  );

  const clearMessageDataHandler = useCallback(() => {
    dispatch(clearMessageData());
  }, [dispatch]);

  return {
    conversations,
    threads,
    activePartnerID,
    loading,
    fetchConversations,
    fetchConversation,
    sendMessage,
    markMessageRead,
    clearMessageDataHandler,
    authUser,
  };
};
