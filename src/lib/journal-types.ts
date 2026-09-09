export type TradeOutcome = "win" | "loss";
export type UserRole = "viewer" | "member" | "admin";

export interface Profile {
  id: string;
  display_name: string;
  email: string | null;
  role: UserRole;
}

export interface JournalEntry {
  id: string;
  owner_id: string;
  symbol: string;
  trade_date: string; // yyyy-mm-dd
  outcome: TradeOutcome;
  entry_zone: string;
  entry_reason: string;
  emotions: string;
  lesson: string;
  image_urls: string[];
  created_at: string;
  updated_at: string;
}

export interface JournalComment {
  id: string;
  entry_id: string;
  author_id: string;
  body: string;
  created_at: string;
}

export interface JournalEntryFormValues {
  symbol: string;
  trade_date: string;
  outcome: TradeOutcome;
  entry_zone: string;
  entry_reason: string;
  emotions: string;
  lesson: string;
  image_urls: string[];
}
