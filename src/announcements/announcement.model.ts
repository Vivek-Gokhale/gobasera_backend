export interface Announcement {
  id: number;
  title: string;
  description?: string;
  status: 'active' | 'closed';
  createdAt: Date;
}
