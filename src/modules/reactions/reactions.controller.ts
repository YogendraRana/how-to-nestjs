import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ReactionsService } from './reactions.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateReactionDto } from './dtos/create-reaction.dto';
import { UpdateReactionDto } from './dtos/update-reaction.dto';
import { Controller, Post, Body, UseInterceptors, UploadedFile, Get, HttpCode, Param, Patch, Delete } from '@nestjs/common';


@ApiTags('Reactions')
@Controller('reactions')
export class ReactionsController {
    constructor (
        private readonly reactionsService: ReactionsService,
    ) {}
    

    // create reaction
    @Post()
    @ApiBody({type: CreateReactionDto}) 
    @UseInterceptors(FileInterceptor('image'))
    async createReaction(@UploadedFile() image: Express.Multer.File, @Body() createReactionDto: CreateReactionDto) {      
        return this.reactionsService.createReaction(image, createReactionDto);
    }


    // read all reactions
    @Get()
    @HttpCode(200)
    async readAllReactions() {
        return this.reactionsService.readAllReactions();
    }


    // read a reaction
    @Get(':id')
    @HttpCode(200)
    async readReaction(@Param('id') reactionId: string) {
        return this.reactionsService.readReaction(reactionId);
    }


    // update a reaction
    @Patch(':id')
    @HttpCode(200)
    @UseInterceptors(FileInterceptor('image'))
    async updateReaction(@UploadedFile() image: Express.Multer.File, @Param('id') reactionId: string, @Body() updateReactionDto: UpdateReactionDto) {
        return this.reactionsService.updateReaction(image, reactionId, updateReactionDto);
    }


    // delete a reaction
    @Delete(':id')
    @HttpCode(200)
    async deleteReaction(@Param('id') reactionId: string) {
        return this.reactionsService.deleteReaction(reactionId)
    }
}
