import { Module } from '@nestjs/common';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AuthorService } from './book/service/author.service';
import { CategoryService } from './book/service/category.service';
import { BookResolver } from './book/resolver/book.resolver';
import { AuthorResolver } from './book/resolver/author.resolver';
import { CategoryResolver } from './book/resolver/category.resolver';
import { BookService } from './book/service/book.service';
import { AnalysisService } from './book/service/analysis.service';

@Module({
  imports: [
    NestGraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
  providers: [
    BookService,
    AuthorService,
    CategoryService,
    BookResolver,
    AuthorResolver,
    CategoryResolver,
    AnalysisService,
  ],
})
export class GraphQLModule {}
