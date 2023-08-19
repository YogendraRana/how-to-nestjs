import { Module } from '@nestjs/common';
import { PostReactionsService } from './postreactions.service';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { PostReactionsController } from './postreactions.controller';


@Module({
  controllers: [PostReactionsController],
  providers: [PostReactionsService, PrismaService]
})


export class PostReactionsModule {}