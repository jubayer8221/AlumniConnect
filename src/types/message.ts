export interface MessageItem {
  messageID: number;
  senderID: number;
  receiverID: number;
  content: string;
  sentAt: string;
  readAt?: string | null;
}

export interface ConversationSummary {
  partnerID: number;
  alumniID?: number | null;
  alumniCode?: string | null;
  fullName?: string | null;
  profilePhoto?: string | null;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  lastMessageSenderID?: number | null;
  unreadCount: number;
}
