import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { AuthGuard } from "@/common/guard";
import { TagService } from "@/modules/tag/tag.service";
import { CreateTagDto } from "@/modules/tag/dto";

@Controller("tag")
export class TagController {
  constructor(private tagService: TagService) {}
  @UseGuards(AuthGuard)
  @Post()
  create(@Body(new ValidationPipe()) createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }
  @Get()
  findAll() {
    return this.tagService.findAll();
  }
}
