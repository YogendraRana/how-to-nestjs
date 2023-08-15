import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';


@Module({
    controllers: [CommentsController],
    providers: [CommentsService, PrismaService]
})

export class CommentsModule { }
