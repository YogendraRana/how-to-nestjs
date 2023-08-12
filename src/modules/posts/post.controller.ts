import { ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from 'src/modules/posts/dtos/create-post.dto';
import { UpdatePostDto } from 'src/modules/posts/dtos/update-post.dto';
import { AccessTokenAuthGuard } from '../auth/guards/access-token.guard';
import { Controller, Get, Param, Post, Delete, UseGuards, UseInterceptors, UploadedFiles, Body, Patch, Query } from '@nestjs/common';


@ApiTags('Posts')
@Controller('posts')
// @UseGuards(AccessTokenAuthGuard)
export class PostController {
    constructor(
        private readonly postService: PostService,
    ) { }


    // create post
    @Post()
    @UseInterceptors(FilesInterceptor('images'))
    async createPost(@UploadedFiles() images: Array<Express.Multer.File>, @Body() createPostDto: CreatePostDto) {
        return this.postService.createPost(images, createPostDto);
    }


    // get all posts
    @Get()
    async readPosts() {
        return this.postService.readPosts();
    }


    // get specific post
    @Get(':id')
    async readPostById(@Param('id') postId: string) {
        return this.postService.readPostById(postId);
    }


    // update post
    @Patch(':id')
    async updatePost(@Param('id') postId: string, @Body() updatePostDto: UpdatePostDto) {
        return this.postService.updatePost(postId, updatePostDto);
    }


    // delete post
    @Delete(':id')
    async deletePost(@Param('id') postId: string) {
        return this.postService.deletePost(postId);
    }


    // get posts of a user
    @Get()
    async readPostsOfUser(@Query('userId') userId: string) {
        return this.postService.readPostsOfUser(userId);
    }
}
