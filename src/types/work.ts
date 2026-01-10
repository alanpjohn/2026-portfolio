export interface WorkItem {
  id: string;
  title: string;
  type: "project" | "experience";
  description: string;
  tags: string[];
  featured: boolean;
  url?: string;
  image?: string;
  date: Date;
  endDate?: Date | null;
  company?: string;
  role?: string;
}

export interface WorkContent {
  items: WorkItem[];
}
