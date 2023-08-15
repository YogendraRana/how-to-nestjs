import { ApiTags } from '@nestjs/swagger';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dtos/create-reaction.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';


@ApiTags('Reactions')
@Controller('reactions')
export class ReactionsController {
    constructor (
        private readonly reactionsService: ReactionsService,
    ) {}
    

    // create reaction 
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async createReaction(@UploadedFile() image: Express.Multer.File, @Body() createReactionDto: CreateReactionDto) {
        return this.reactionsService.createReaction(image, createReactionDto);
    }
}
