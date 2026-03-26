
export interface JotProps {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  bumpCount: number;
  status: "active" | "archived";
  relevancy: number | 1;
  onBump?: () => void;
  archiveReason?: "faded" | "completed";
  archivedAt?: string;
}
