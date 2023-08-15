import { Injectable } from '@nestjs/common';
import { CreateReactionDto } from './dtos/create-reaction.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class ReactionsService {
    constructor(
        private readonly prismaService: PrismaService,
    ) {}


    // create reaction
    async createReaction(image: Express.Multer.File, createReactionDto: CreateReactionDto) {
        return {
            success: true,
            message: 'Reaction created successfully',
            image,
            createReactionDto
        }
    }
}
