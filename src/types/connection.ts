export type ConnectionStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "BLOCKED";

export interface ConnectionItem {
  connectionID: number;
  otherUserID: number;
  alumniID?: number | null;
  alumniCode?: string | null;
  fullName?: string | null;
  profilePhoto?: string | null;
  email?: string | null;
  status: ConnectionStatus;
  createdAt?: string | null;
  respondedAt?: string | null;
}

export interface ConnectionStatusInfo {
  connectionID?: number | null;
  status: ConnectionStatus | null;
  isRequester: boolean;
}
