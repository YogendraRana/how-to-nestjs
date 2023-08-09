import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from './comments.service';
import { User } from 'src/common/decorators/user.decorator';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { CreateCommentDto } from 'src/common/dtos/create-comment.dto';
import { Controller, Delete, Get, Patch, Post, Body, UseGuards, Param } from '@nestjs/common';

@Controller('comments')
@UseGuards(AuthGuard('jwt'))
export class CommentsController {
    constructor (
        private readonly commentsService: CommentsService,
    ) {}


    // create comment to a post
    @Post()
    async createComment (@Body() createCommentDto: CreateCommentDto, @User() user: UserInterface) {
        return this.commentsService.createComment(createCommentDto, user);
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
