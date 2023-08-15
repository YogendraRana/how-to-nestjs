import { ApiTags } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { CreateCommentDto } from 'src/modules/comments/dtos/create-comment.dto';
import { Controller, Delete, Get, Patch, Post, Body, Param } from '@nestjs/common';
import { UpdateCommentDto } from './dtos/update-commet.dto';


@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
    constructor (
        private readonly commentsService: CommentsService,
    ) {}


    // create comment to a post
    @Post()
    async createComment (@Body() createCommentDto: CreateCommentDto, @CurrentUser() currentUser: UserInterface) {
        return this.commentsService.createComment(createCommentDto, currentUser);
    }


    // read comments of a post
    @Get(':id')
    async readComments (@Param('id') postId: string) {
        return this.commentsService.readComments(postId);
    }


    // update comment
    @Patch(':id')
    async updateComment (@Param('id') commentId: string, @Body() updateCommentDto: UpdateCommentDto) {
        return this.commentsService.updateComment(commentId, updateCommentDto);
    }


    // delete comment
    @Delete(':id')
    async deleteComment (@Param('id') commentId: string) {
        return this.commentsService.deleteComment(commentId);
    }
}
