export interface Comment {
  id: number;
  authorName: string;
  text: string;
  createdAt: Date;
}

export type ReactionType = 'up' | 'down' | 'heart';

export interface Reaction {
  userId: string;
  type: ReactionType;
  createdAt: Date;
}

export interface Announcement {
  id: number;
  title: string;
  description?: string;
  status: 'active' | 'closed';
  createdAt: Date;
  comments?: Comment[];
  reactions?: Reaction[];
}
