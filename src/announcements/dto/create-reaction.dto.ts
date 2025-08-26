// src/announcements/dto/create-reaction.dto.ts
import { IsIn, IsString } from 'class-validator';

export class CreateReactionDto {
  @IsString()
  @IsIn(['up', 'down', 'heart'])
  type: 'up' | 'down' | 'heart';
}
