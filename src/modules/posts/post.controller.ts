import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Controller, Get, Param, Post, Delete, Put, UseGuards } from '@nestjs/common';

@Controller('posts')
export class PostController {
    constructor(
        private readonly postService: PostService,
    ) { }

    // get posts
    @Get()
    @UseGuards(JwtAuthGuard)
    async handleGetPosts() {
        return this.postService.handleGetPosts();
    }

    // get specific post
    @Get(':id')
    async handleGetPost(@Param('id') postId: string) {
        return this.postService.handleGetPost(postId);
    }

    // create post
    @Post()
    async handleCreatePost () {
        return this.postService.handleCreatePost();
    }

    // delete post
    @Delete(':id')
    async handleDeletePost(@Param('id') postId: string) {
        return this.postService.handleDeletePost(postId);
    }

    // update post
    @Put(':id')
    async handleUpdatePost(@Param('id') postId: string) {
        return this.postService.handleUpdatePost(postId);
    }
}
