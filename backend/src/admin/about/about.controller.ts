import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import { Role } from "src/core/constant/user.constant";
import { Roles } from "src/core/decorator/roles.decorator";
import { HttpExceptionFilter } from "src/core/filter/http-exception.filter";
import { CookieTokenGuard } from "src/core/guard/cookie-token.guard";
import { RolesGuard } from "src/core/guard/roles.guard";
import { UpdateContentDto } from "./update-content.dto";
import { PrismaService } from "src/core/service/prisma.service";

@Controller("admin/about")
@UseFilters(HttpExceptionFilter)
export class AboutController {
  private id: string = "clx0nts2u0000i1ifwj1fpk74";
  constructor(private readonly client: PrismaService) {}

  @Get()
  @Render("about")
  @Roles([Role.Admin])
  @UseGuards(CookieTokenGuard, RolesGuard)
  async index() {
    const data = await this.client.aboutContent.findFirst({
      where: {
        id: this.id,
      },
    });
    return { title: "About", content: data.content };
  }

  @Get("content")
  @Render("about-content")
  async getContent() {
    const about = await this.client.aboutContent.findUnique({
      where: {
        id: this.id,
      },
    });
    return {
      content: about.content,
    };
  }

  @Post()
  @Roles([Role.Admin])
  @UseGuards(CookieTokenGuard, RolesGuard)
  updateContent(@Body() dto: UpdateContentDto) {
    return this.client.aboutContent.upsert({
      where: { id: this.id },
      update: { content: dto.data },
      create: { content: dto.data },
    });
  }
}
