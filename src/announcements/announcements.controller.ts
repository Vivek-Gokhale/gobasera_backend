import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Headers,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import type { Announcement, Comment, ReactionType } from './announcement.model';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  // ---------------- Announcements ----------------
  @Post()
  create(
    @Body('title') title: string,
    @Body('description') description?: string,
  ): Announcement {
    return this.announcementsService.create(title, description);
  }

  @Get()
  findAll(): any[] {
    return this.announcementsService.findAll();
  }

  @Patch(':id')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'active' | 'closed',
  ): Announcement | undefined {
    return this.announcementsService.updateStatus(+id, status);
  }

  // ---------------- Comments ----------------
  @Post(':id/comments')
  addComment(
    @Param('id') id: string,
    @Body('authorName') authorName: string,
    @Body('text') text: string,
  ): Comment {
    return this.announcementsService.addComment(+id, { authorName, text });
  }

  @Get(':id/comments')
  getComments(
    @Param('id') id: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit = 10,
  ) {
    return this.announcementsService.getComments(+id, cursor, limit);
  }

  // ---------------- Reactions ----------------
  @Post(':id/reactions')
  addReaction(
    @Param('id') id: string,
    @Body('type') type: ReactionType,
    @Headers('idempotency-key') idempotencyKey: string,
    @Headers('x-user-id') userId: string,
  ) {
    return this.announcementsService.addReaction(
      +id,
      type,
      userId,
      idempotencyKey,
    );
  }

  @Delete(':id/reactions')
  removeReaction(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string,
  ) {
    return this.announcementsService.removeReaction(+id, userId);
  }
}
