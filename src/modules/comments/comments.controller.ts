import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
    constructor (
        private readonly commentsService: CommentsService,
    ) {}


    // create comment to a post
    @Post()
    async createComment () {
        return this.commentsService.createComment();
    }


    // read comments of a post
    @Get()
    async readComments () {
        return this.commentsService.readComments();
    }


    // update comment
    @Patch(':id')
    async updateComment () {
        return this.commentsService.updateComment();
    }


    // delete comment
    @Delete(':id')
    async deleteComment () {
        return this.commentsService.deleteComment();
    }


    // reply on a comment
    @Post('/reply')
    async replyToComment () {
        return this.commentsService.replyToComment();
    }

}
