export interface TrackerKey {
  id: string;
  name: string;
  color: string;
}

export interface DayEntry {
  date: string; // YYYY-MM-DD format
  keyId: string | null;
}

export interface Tracker {
  id: string;
  userId: string;
  name: string;
  icon: string;
  keys: TrackerKey[];
  entries: Record<string, string | null>; // date -> keyId
  createdAt: Date;
}
