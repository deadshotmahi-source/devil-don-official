import type { Timestamp } from "firebase/firestore";

export type PlanName = "7 Days Plan" | "30 Days Plan" | "VIP Plan";
export type UserStatus = "active" | "banned";
export type KeyStatus = "unused" | "active" | "expired" | "banned";
export type PaymentStatus = "pending" | "approved" | "rejected";

export type AppUser = {
  uid: string;
  username: string;
  role: "user" | "admin";
  status: UserStatus;
  createdAt?: Timestamp;
  activeKeyId?: string;
  subscriptionType?: PlanName;
  keyExpiry?: Timestamp;
};

export type PaymentRequest = {
  id: string;
  userId: string;
  username: string;
  plan: PlanName;
  transactionId: string;
  screenshotUrl: string;
  status: PaymentStatus;
  createdAt?: Timestamp;
};

export type AccessKey = {
  id: string;
  code: string;
  plan: PlanName;
  status: KeyStatus;
  userId?: string;
  username?: string;
  expiryAt?: Timestamp;
  createdAt?: Timestamp;
  activatedAt?: Timestamp;
};

export type ApkFile = {
  id: string;
  version: string;
  fileName: string;
  url: string;
  createdAt?: Timestamp;
};
