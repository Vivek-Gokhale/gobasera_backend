import { Injectable } from '@nestjs/common';
import type { Announcement } from './announcement.model';

@Injectable()
export class AnnouncementsService {
  private announcements: Announcement[] = [];
  private idCounter = 1;

  create(title: string, description?: string): Announcement {
    const newAnnouncement: Announcement = {
      id: this.idCounter++,
      title,
      description,
      status: 'active',
      createdAt: new Date(),
    };
    this.announcements.unshift(newAnnouncement); // newest first
    return newAnnouncement;
  }

  findAll(): Announcement[] {
    return this.announcements;
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
}
