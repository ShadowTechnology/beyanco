export interface Subscription {
  id?: number;
  userId?: number;
  userName?: string;
  userEmail?: string;
  planId?: number;
  planName?: string;
  amount?: number;
  startAt?: string;    // ISO string
  expiresAt?: string;  // ISO string or null
  status?: string;     // ACTIVE | EXPIRED | CANCELLED
  createdAt?: string;
}
