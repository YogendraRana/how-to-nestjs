import { ApiTags } from '@nestjs/swagger';
import { PostReactionsService } from './postreactions.service';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { CreatePostReactionDto } from './dtos/create-post-reaction.dto';
import { Body, Controller, Get, Post, Query, Delete } from '@nestjs/common';


@ApiTags('Post Reactions')
@Controller('post/reactions')
export class PostReactionsController {
    constructor(
        private readonly postReactionsService: PostReactionsService,
    ) { }


    // create post reactions
    @Post()
    async createPostReaction(@Body() createPostReactionDto: CreatePostReactionDto, @CurrentUser() user: UserInterface) {
        return await this.postReactionsService.createPostReaction(createPostReactionDto, user);
    }


    // read post reactions
    @Get()
    async readPostReactions(@Query('postId') postId: string) {
        return this.postReactionsService.readPostReactions(postId);
    }


    // delete post reactions
    @Delete()
    async deletePostReaction(@Query('postId') postId: string, @CurrentUser() user: UserInterface) { 
        return this.postReactionsService.deletePostReaction(postId, user);
    }
}
