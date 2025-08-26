// src/announcements/dto/create-comment.dto.ts
import { IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  authorName: string;

  @IsString()
  @Length(1, 500)
  text: string;
}
