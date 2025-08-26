import { Controller, Post, Get, Patch, Body, Param } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import type { Announcement } from './announcement.model';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  create(
    @Body('title') title: string,
    @Body('description') description?: string,
  ): Announcement {
    return this.announcementsService.create(title, description);
  }

  @Get()
  findAll(): Announcement[] {
    return this.announcementsService.findAll();
  }

  @Patch(':id')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'active' | 'closed',
  ): Announcement | undefined {
    return this.announcementsService.updateStatus(+id, status);
  }
}
