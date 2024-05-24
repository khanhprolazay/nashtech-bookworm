import { Inject, Injectable } from "@nestjs/common";
import { Book } from "@prisma/client";
import { BaseService } from "src/core/service/base.service";
import { UpdateInformationDto } from "./upate-information.dto";
import { Util } from "src/core/util/util";
import { PrismaService } from "src/core/service/prisma.service";
import { AppContext } from "src/core/type/app-context.type";
import { APP_CONTEXT } from "src/core/constant/app.constant";
import { FileUploadService } from "src/core/module/file-upload/base/file-upload.service";

@Injectable()
export class BookService extends BaseService<Book> {
  constructor(
    @Inject(APP_CONTEXT) protected readonly appContext: AppContext,
    protected readonly client: PrismaService,
    protected readonly fileUploadService: FileUploadService,
  ) {
    super(appContext, client);
  }

  model() {
    return this.client.book;
  }

  async findByPage(page: number) {
    return this.client.$queryRaw` 
      select b.title, b.slug, string_agg(A."name" , ', ') authors, b.price , b.discount, b."mainImage" , b.price * (100 - b.discount) / 100 total
      from "Book" b
      left join "BookToAuthor" bta on bta."bookId" =b.id
      left join "Author" a  on a.id  = bta."authorId"
      group by b.title , b.price, b.discount, b."mainImage", b.slug
      limit ${this.appContext.pagination.limit}
      offset ${(page - 1) * this.appContext.pagination.limit}
    `;
  }

  override findBySlug(slug: string) {
    return this.model().findFirst({
      where: {
        slug,
      },
      include: {
        authors: {
          select: {
            author: true,
          },
        },
        categories: {
          select: {
            category: true,
          },
        },
      },
    });
  }

  updateInformation(id: string, dto: UpdateInformationDto) {
    const slug = Util.slugify(dto.title);
    return this.model().update({
      where: {
        id,
      },
      data: {
        ...dto,
        slug,
      },
    });
  }

  getCategories() {
    return this.client.category.findMany();
  }

  getAuthors() {
    return this.client.author.findMany();
  }

  async updateImage(id: string, image: Express.Multer.File) {
    const book = await this.findById(id);
    const splits = book.mainImage.split("/");
    const oldImageName = splits[splits.length - 1];
    const [_, file] = await Promise.all([
      this.fileUploadService.delete(oldImageName),
      this.fileUploadService.upload(image),
    ]);
    return this.model().update({
      where: {
        id,
      },
      data: {
        mainImage: file,
      },
    });
  }

  addCategory(id: string, categoryId: string) {
    return this.client.bookToCategory.create({
      data: {
        bookId: id,
        categoryId,
      },
    });
  }

  removeCategory(bookId: string, categoryId: string) {
    return this.model().update({
      where: { id: bookId },
      data: {
        categories: {
          delete: [
            {
              bookId_categoryId: {
                bookId,
                categoryId,
              },
            },
          ],
        },
      },
    });
  }

  addAuthor(bookId: string, authorId: string) {
    return this.client.bookToAuthor.create({
      data: {
        bookId,
        authorId,
      },
    });
  }

  removeAuthor(bookId: string, authorId: string) {
    return this.model().update({
      where: {
        id: bookId,
      },
      data: {
        authors: {
          delete: [
            {
              bookId_authorId: {
                bookId,
                authorId,
              },
            },
          ],
        },
      },
    });
  }
}
