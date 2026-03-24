
export interface Jot {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  bumpCount: number;
  status: "active" | "archived";
  archiveReason?: "faded" | "completed";
  archivedAt?: string;
}
