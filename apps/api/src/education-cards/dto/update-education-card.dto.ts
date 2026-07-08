import { PartialType } from '@nestjs/swagger';
import { CreateEducationCardDto } from './create-education-card.dto';

export class UpdateEducationCardDto extends PartialType(
  CreateEducationCardDto,
) {}
