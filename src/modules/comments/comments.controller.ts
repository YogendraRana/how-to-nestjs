import { ApiTags } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { AccessTokenAuthGuard } from '../auth/guards/access-token.guard';
import { CreateCommentDto } from 'src/modules/comments/dtos/create-comment.dto';
import { Controller, Delete, Get, Patch, Post, Body, Param } from '@nestjs/common';


@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
    constructor (
        private readonly commentsService: CommentsService,
    ) {}


    // create comment to a post
    @Post()
    async createComment (@Body() createCommentDto: CreateCommentDto) {
        return this.commentsService.createComment(createCommentDto);
    }


    // read comments of a post
    @Get(':id')
    async readComments (@Param('id') postId: string) {
        return this.commentsService.readComments(postId);
    }


    // update comment
    @Patch(':id')
    async updateComment (@Param('id') commentId: string, @Body('content') content: string) {
        return this.commentsService.updateComment(commentId, content);
    }


    // delete comment
    @Delete(':id')
    async deleteComment (@Param('id') commentId: string) {
        return this.commentsService.deleteComment(commentId);
    }
}
