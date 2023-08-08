import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/decorators/user.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from 'src/common/dtos/create-post.dto';
import { UpdatePostDto } from 'src/common/dtos/update-post.dto';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { Controller, Get, Param, Post, Delete, UseGuards, UseInterceptors, UploadedFiles, Body, Patch } from '@nestjs/common';

@Controller('posts')
export class PostController {
    constructor(
        private readonly postService: PostService,
    ) { }


    // get all posts
    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getAllPosts() {
        return this.postService.getAllPosts();
    }


    // get specific post
    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    async getPostById(@Param('id') postId: string) {
        return this.postService.getPostById(postId);
    }


    // create post
    @Post()
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FilesInterceptor('images', 10))
    async createPost(@UploadedFiles() images: Array<Express.Multer.File>, @Body() createPostDto: CreatePostDto, @User() user: UserInterface) {
        return this.postService.createPost(images, createPostDto, user);
    }


    // delete post
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    async deletePost(@Param('id') postId: string) {
        return this.postService.deletePost(postId);
    }


    // update post
    @Patch(':id')
    @UseGuards(AuthGuard('jwt'))
    async updatePost(@Param('id') postId: string, @Body() updatePostDto: UpdatePostDto) {
        return this.postService.updatePost(postId, updatePostDto);
    }

    
    // get posts of a user
    @Get('/user/:id')
    @UseGuards(AuthGuard('jwt'))
    async getPostsOfUser(@Param('id') userId: string) {
        return this.postService.getPostsOfUser(userId);
    }
}
