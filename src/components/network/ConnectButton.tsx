import { useEffect } from "react";
import { Button, ButtonGroup, Stack, CircularProgress } from "@mui/material";
import { UserPlus, Clock, Check, MessageSquare, UserMinus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useConnections } from "@/hooks/useConnections";

interface ConnectButtonProps {
  /** The other user's *user id* (not alumni id). */
  otherUserID: number;
  /** Optional: hide "Message" button if we're on our own profile. */
  compact?: boolean;
}

export default function ConnectButton({
  otherUserID,
  compact = false,
}: ConnectButtonProps) {
  const navigate = useNavigate();
  const {
    statuses,
    loading,
    fetchStatus,
    sendRequest,
    respondRequest,
    removeConnection,
  } = useConnections();

  const info = statuses[otherUserID];

  useEffect(() => {
    if (!otherUserID) return;
    if (info === undefined) {
      void fetchStatus(otherUserID);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherUserID]);

  // Loading state (first fetch)
  if (info === undefined) {
    return (
      <Button
        variant="outlined"
        disabled
        startIcon={<CircularProgress size={16} />}
        sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
      >
        Loading…
      </Button>
    );
  }

  const status = info.status;

  /* ---------- No connection → Connect ---------- */
  if (status === null) {
    return (
      <Button
        variant="contained"
        startIcon={<UserPlus size={18} />}
        disabled={loading}
        onClick={() => void sendRequest(otherUserID)}
        sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
      >
        Connect
      </Button>
    );
  }

  /* ---------- PENDING ---------- */
  if (status === "PENDING") {
    // If I sent it → "Pending" (disabled, with Remove option)
    if (info.isRequester) {
      return (
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<Clock size={18} />}
            disabled
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
          >
            Pending
          </Button>
          {!compact && (
            <Button
              variant="text"
              color="error"
              onClick={() => void removeConnection(otherUserID)}
              disabled={loading}
              sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
            >
              Cancel
            </Button>
          )}
        </Stack>
      );
    }
    // They sent it to me → Accept / Reject
    return (
      <ButtonGroup variant="contained">
        <Button
          startIcon={<Check size={18} />}
          disabled={loading || info.connectionID == null}
          onClick={() =>
            info.connectionID != null &&
            void respondRequest(info.connectionID, true)
          }
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Accept
        </Button>
        <Button
          color="inherit"
          disabled={loading || info.connectionID == null}
          onClick={() =>
            info.connectionID != null &&
            void respondRequest(info.connectionID, false)
          }
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Reject
        </Button>
      </ButtonGroup>
    );
  }

  /* ---------- ACCEPTED → Message + Remove ---------- */
  if (status === "ACCEPTED") {
    return (
      <Stack direction="row" spacing={1}>
        <Button
          variant="contained"
          startIcon={<MessageSquare size={18} />}
          onClick={() => navigate(`/alumni/network/messages?to=${otherUserID}`)}
          sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
        >
          Message
        </Button>
        {!compact && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<UserMinus size={18} />}
            disabled={loading}
            onClick={() => void removeConnection(otherUserID)}
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
          >
            Disconnect
          </Button>
        )}
      </Stack>
    );
  }

  /* ---------- REJECTED / BLOCKED → allow re-request ---------- */
  return (
    <Button
      variant="contained"
      startIcon={<UserPlus size={18} />}
      disabled={loading}
      onClick={() => void sendRequest(otherUserID)}
      sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
    >
      Connect
    </Button>
  );
}
