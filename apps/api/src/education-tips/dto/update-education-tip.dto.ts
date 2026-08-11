import { PartialType } from '@nestjs/swagger';
import { CreateEducationTipDto } from './create-education-tip.dto';

export class UpdateEducationTipDto extends PartialType(CreateEducationTipDto) {}
