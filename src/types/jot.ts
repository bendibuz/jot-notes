import { Timestamp } from "firebase/firestore";

export interface Jot {
  id: string;
  content: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  bumpCount: number;
  status: "active" | "archived";
  archiveReason?: "faded" | "completed";
  archivedAt?: Timestamp;
}
