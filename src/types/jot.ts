
export interface JotProps {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  bumpCount: number;
  status: "active" | "archived";
  onBump?: () => void;
  archiveReason?: "faded" | "completed";
  archivedAt?: string;
}
