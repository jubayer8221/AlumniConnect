import { useEffect, useMemo, useRef, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ArrowLeft, Send, MessageSquare, Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { CommonAvatar, CommonPageHeader } from "@/components/common";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";
import { formatDateTime } from "@/utils/dateUtils";
import type { ConversationSummary, MessageItem } from "@/types/message";

export default function MessagesPage() {
  const [params, setParams] = useSearchParams();
  const { authUser: me } = useAuth();
  const {
    conversations,
    threads,
    activePartnerID,
    fetchConversations,
    fetchConversation,
    sendMessage,
  } = useMessages();

  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toParam = params.get("to");
  const initialPartnerID = toParam ? Number(toParam) : null;

  useEffect(() => {
    void fetchConversations().catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initialPartnerID && initialPartnerID !== activePartnerID) {
      void fetchConversation(initialPartnerID).catch(() => undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPartnerID]);

  const activeMessages: MessageItem[] = activePartnerID
    ? (threads[activePartnerID] ?? [])
    : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages.length]);

  const filteredConversations = useMemo(
    () =>
      conversations.filter(
        (c) =>
          !search.trim() ||
          (c.fullName ?? "").toLowerCase().includes(search.toLowerCase()) ||
          (c.lastMessage ?? "").toLowerCase().includes(search.toLowerCase()),
      ),
    [conversations, search],
  );

  const activePartner: ConversationSummary | undefined = useMemo(() => {
    if (!activePartnerID) return undefined;
    return conversations.find((c) => c.partnerID === activePartnerID);
  }, [conversations, activePartnerID]);

  const openThread = (partnerID: number) => {
    setParams({ to: String(partnerID) });
    if (partnerID !== activePartnerID) {
      void fetchConversation(partnerID).catch(() => undefined);
    }
  };

  const closeThread = () => {
    setParams({});
  };

  const handleSend = async () => {
    if (!activePartnerID || !draft.trim() || sending) return;
    setSending(true);
    try {
      await sendMessage(activePartnerID, draft.trim());
      setDraft("");

      await Promise.all([
        fetchConversation(activePartnerID).catch(() => undefined),
        fetchConversations().catch(() => undefined),
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const isMobileThreadOpen = Boolean(activePartnerID);

  return (
    <Box
      // maxWidth="xl"
      sx={{
        height: { xs: "auto", md: "calc(100dvh - 150px)" },
        display: "flex",
        flexDirection: "column",
        pb: 2,
        overflow: { xs: "visible", md: "hidden" },
      }}
    >
      {/* ---------- MOBILE-ONLY header (above the card) ---------- */}
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          flexShrink: 0,
        }}
      >
        <CommonPageHeader
          title="Messages"
          breadcrumbs={[
            { label: "Home", path: "/alumni/dashboard" },
            { label: "Messages" },
          ]}
        />
      </Box>

      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          border: "none",
          bgcolor: "background.paper",
          boxShadow: (t) => `0 32px 32px ${t.palette.text.primary}08`,
          overflow: "hidden",
          flex: 1,
          minHeight: 0,
          display: "flex",
          height: { xs: "calc(100dvh - 220px)", md: "auto" },
        }}
      >
        {/* ---------- LEFT: Conversation list ---------- */}
        <Box
          sx={{
            width: { xs: "100%", md: 360 },
            bgcolor: "background.paper",
            display: {
              xs: isMobileThreadOpen ? "none" : "flex",
              md: "flex",
            },
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          {/* ---------- DESKTOP-ONLY header (inside sidebar) ---------- */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              flexShrink: 0,
              px: 2.5,
              pt: 2,
            }}
          >
            <CommonPageHeader
              title="Messages"
              breadcrumbs={[
                { label: "Home", path: "/alumni/dashboard" },
                { label: "Messages" },
              ]}
            />
          </Box>

          <Box sx={{ p: 2.5, flexShrink: 0 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  bgcolor: "background.default",
                  "& fieldset": { border: "none" },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={16} style={{ opacity: 0.6 }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <Box sx={{ flex: 1, overflowY: "auto", px: 1, minHeight: 0 }}>
            {filteredConversations.length === 0 ? (
              <Box sx={{ p: 4, textAlign: "center", mt: 4 }}>
                <MessageSquare
                  size={40}
                  style={{ opacity: 0.3, marginBottom: 12 }}
                />
                <Typography variant="body2" color="text.secondary">
                  No conversations yet.
                </Typography>
              </Box>
            ) : (
              <List
                disablePadding
                sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
              >
                {filteredConversations.map((c) => {
                  const isActive = c.partnerID === activePartnerID;
                  return (
                    <ListItemButton
                      key={c.partnerID}
                      selected={isActive}
                      onClick={() => openThread(c.partnerID)}
                      sx={{
                        py: 1.5,
                        px: 2,
                        borderRadius: 3,
                        transition: "all 0.2s ease",
                        "&.Mui-selected": {
                          bgcolor: (t) => `${t.palette.primary.main}12`,
                          "&:hover": {
                            bgcolor: (t) => `${t.palette.primary.main}18`,
                          },
                        },
                        "&:hover": {
                          bgcolor: "action.hover",
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Badge
                          color="error"
                          badgeContent={c.unreadCount || undefined}
                          max={99}
                        >
                          <CommonAvatar
                            src={c.profilePhoto ?? undefined}
                            name={c.fullName ?? "User"}
                            size={44}
                          />
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              fontWeight: c.unreadCount > 0 ? 700 : 600,
                              fontSize: "0.9rem",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {c.fullName ?? "Unknown"}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: "block",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              mt: 0.25,
                            }}
                          >
                            {c.lastMessage ?? "No messages yet"}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  );
                })}
              </List>
            )}
          </Box>
        </Box>

        {/* ---------- RIGHT: Active thread ---------- */}
        <Box
          sx={{
            flex: 1,
            bgcolor: "background.default",
            display: {
              xs: isMobileThreadOpen ? "flex" : "none",
              md: "flex",
            },
            flexDirection: "column",
            minHeight: 0,
            minWidth: 0,
          }}
        >
          {!activePartnerID ? (
            <Box
              sx={{
                flex: 1,
                display: "grid",
                placeItems: "center",
                color: "text.secondary",
                p: 4,
              }}
            >
              <Stack spacing={2} sx={{ alignItems: "center" }}>
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    bgcolor: (t) => `${t.palette.primary.main}10`,
                    display: "grid",
                    placeItems: "center",
                    color: "primary.main",
                  }}
                >
                  <MessageSquare size={32} />
                </Box>
                <Typography sx={{ fontWeight: 600 }}>
                  Select a conversation to start messaging
                </Typography>
              </Stack>
            </Box>
          ) : (
            <>
              {/* Header */}
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  bgcolor: "background.paper",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  boxShadow: (t) => `0 1px 3px ${t.palette.text.primary}04`,
                  zIndex: 1,
                  flexShrink: 0,
                }}
              >
                <IconButton
                  onClick={closeThread}
                  sx={{ display: { xs: "flex", md: "none" }, ml: -1 }}
                >
                  <ArrowLeft size={20} />
                </IconButton>
                <CommonAvatar
                  src={activePartner?.profilePhoto ?? undefined}
                  name={activePartner?.fullName ?? "User"}
                  size={42}
                />
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                    {activePartner?.fullName ?? "Conversation"}
                  </Typography>
                  {/* <Typography variant="caption" color="text.secondary">
                    Active connection
                  </Typography> */}
                </Box>
              </Box>

              {/* Messages */}
              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  p: 3,
                  minHeight: 0,
                }}
              >
                {activeMessages.length === 0 ? (
                  <Box sx={{ textAlign: "center", mt: 6 }}>
                    <Typography color="text.secondary" variant="body2">
                      No messages yet. Say hi 👋
                    </Typography>
                  </Box>
                ) : (
                  <Stack spacing={2}>
                    {activeMessages.map((m) => {
                      const mine = me && String(m.senderID) === String(me.id);
                      return (
                        <Box
                          key={m.messageID}
                          sx={{
                            display: "flex",
                            justifyContent: mine ? "flex-end" : "flex-start",
                          }}
                        >
                          <Paper
                            elevation={0}
                            sx={{
                              px: 2.5,
                              py: 1.5,
                              maxWidth: "70%",
                              borderRadius: mine
                                ? "20px 20px 4px 20px"
                                : "20px 20px 20px 4px",
                              bgcolor: mine
                                ? "primary.main"
                                : "background.paper",
                              color: mine
                                ? "primary.contrastText"
                                : "text.primary",
                              boxShadow: mine
                                ? (t) =>
                                    `0 4px 12px ${t.palette.primary.main}30`
                                : (t) =>
                                    `0 2px 8px ${t.palette.text.primary}06`,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "0.95rem",
                                lineHeight: 1.5,
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                              }}
                            >
                              {m.content}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                display: "block",
                                mt: 0.5,
                                textAlign: mine ? "right" : "left",
                                opacity: 0.7,
                                fontSize: "0.68rem",
                              }}
                            >
                              {formatDateTime(m.sentAt)}
                            </Typography>
                          </Paper>
                        </Box>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </Stack>
                )}
              </Box>

              {/* Composer */}
              <Box
                sx={{
                  p: 2.5,
                  bgcolor: "background.paper",
                  display: "flex",
                  gap: 1.5,
                  alignItems: "flex-end",
                  boxShadow: (t) => `0 -1px 3px ${t.palette.text.primary}04`,
                  flexShrink: 0,
                }}
              >
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  size="small"
                  placeholder="Type a message..."
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      bgcolor: "background.default",
                      py: 1,
                      "& fieldset": { border: "none" },
                    },
                  }}
                />
                <Button
                  variant="contained"
                  endIcon={<Send size={16} />}
                  onClick={() => void handleSend()}
                  disabled={!draft.trim() || sending}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 3,
                    px: 3,
                    py: 1.1,
                    minWidth: 100,
                    boxShadow: (t) => `0 6px 16px ${t.palette.primary.main}30`,
                  }}
                >
                  Send
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Card>
    </Box>
  );
}
