import { Module } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { ReactionsController } from './reactions.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Module({
    controllers: [ReactionsController],
    providers: [ReactionsService, PrismaService]
})

export class ReactionsModule { }