// src/store/Slice/messageSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ConversationSummary, MessageItem } from "@/types/message";

interface MessageState {
  conversations: ConversationSummary[];
  // thread keyed by partner user id
  threads: Record<number, MessageItem[]>;
  activePartnerID: number | null;
}

const initialState: MessageState = {
  conversations: [],
  threads: {},
  activePartnerID: null,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setConversations(state, action: PayloadAction<ConversationSummary[]>) {
      state.conversations = action.payload;
    },
    setThread(
      state,
      action: PayloadAction<{ partnerID: number; messages: MessageItem[] }>,
    ) {
      state.threads[action.payload.partnerID] = action.payload.messages;
    },
    appendMessage(state, action: PayloadAction<MessageItem>) {
      const msg = action.payload;
      const partnerID =
        msg.senderID === state.activePartnerID ? msg.receiverID : msg.senderID;
      if (!state.threads[partnerID]) state.threads[partnerID] = [];
      state.threads[partnerID].push(msg);
    },
    setActivePartner(state, action: PayloadAction<number | null>) {
      state.activePartnerID = action.payload;
    },
    clearMessageData(state) {
      state.conversations = [];
      state.threads = {};
      state.activePartnerID = null;
    },
  },
});

export const {
  setConversations,
  setThread,
  appendMessage,
  setActivePartner,
  clearMessageData,
} = messageSlice.actions;

export default messageSlice.reducer;
