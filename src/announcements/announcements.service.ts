import { Injectable, BadRequestException } from '@nestjs/common';
import type { Announcement, Comment, ReactionType } from './announcement.model';

@Injectable()
export class AnnouncementsService {
  private announcements: Announcement[] = [];
  private idCounter = 1;

  // Store comments and reactions in memory
  private comments: Map<number, Comment[]> = new Map();
  private reactions: Map<number, Map<string, ReactionType>> = new Map(); // announcementId -> userId -> reactionType
  private idempotencyCache: Map<string, number> = new Map(); // key -> timestamp

  // ---------------- Announcements ----------------
  create(title: string, description?: string): Announcement {
    const newAnnouncement: Announcement = {
      id: this.idCounter++,
      title,
      description,
      status: 'active',
      createdAt: new Date(),
    };
    this.announcements.unshift(newAnnouncement);
    return newAnnouncement;
  }

  findAll(): any[] {
    return this.announcements.map((a) => {
      const comments = this.comments.get(a.id) || [];
      const reactions = this.reactions.get(a.id) || new Map();

      const reactionBreakdown: Record<ReactionType, number> = {
        up: 0,
        down: 0,
        heart: 0,
      };

      reactions.forEach((type) => {
        if (reactionBreakdown[type] !== undefined) {
          reactionBreakdown[type]++;
        }
      });

      const lastActivityAt = comments.length
        ? comments[comments.length - 1].createdAt
        : a.createdAt;

      return {
        ...a,
        commentCount: comments.length,
        reactions: reactionBreakdown,
        lastActivityAt,
      };
    });
  }

  updateStatus(
    id: number,
    status: 'active' | 'closed',
  ): Announcement | undefined {
    const announcement = this.announcements.find((a) => a.id === id);
    if (announcement) {
      announcement.status = status;
    }
    return announcement;
  }

  // ---------------- Comments ----------------
  addComment(id: number, payload: { authorName: string; text: string }) {
    if (!this.announcements.find((a) => a.id === id)) {
      throw new BadRequestException('Announcement not found');
    }
    const newComment = {
      id: Date.now(),
      authorName: payload.authorName,
      text: payload.text,
      createdAt: new Date(),
    };
    const comments = this.comments.get(id) || [];
    comments.push(newComment);
    this.comments.set(id, comments);
    return newComment;
  }

  getComments(id: number, cursor?: string, limit = 10) {
    const comments = this.comments.get(id) || [];
    let startIndex = 0;

    if (cursor) {
      const cursorIndex = comments.findIndex((c) => c.id.toString() === cursor);
      startIndex = cursorIndex >= 0 ? cursorIndex + 1 : 0;
    }

    const paginated = comments.slice(startIndex, startIndex + limit);
    const nextCursor =
      paginated.length === limit ? paginated[paginated.length - 1].id : null;

    return { data: paginated, nextCursor };
  }

  // ---------------- Reactions ----------------
  addReaction(
    id: number,
    type: ReactionType,
    userId: string,
    idempotencyKey: string,
  ) {
    if (!this.announcements.find((a) => a.id === id)) {
      throw new BadRequestException('Announcement not found');
    }

    // Idempotency check (5 min window)
    const now = Date.now();
    const cachedTime = this.idempotencyCache.get(idempotencyKey);
    if (cachedTime && now - cachedTime < 5 * 60 * 1000) {
      return { message: 'Duplicate ignored' };
    }
    this.idempotencyCache.set(idempotencyKey, now);

    const reactions = this.reactions.get(id) || new Map();
    reactions.set(userId, type);
    this.reactions.set(id, reactions);

    return { success: true };
  }

  removeReaction(id: number, userId: string) {
    const reactions = this.reactions.get(id);
    if (reactions) {
      reactions.delete(userId);
      this.reactions.set(id, reactions);
    }
    return { success: true };
  }
}
