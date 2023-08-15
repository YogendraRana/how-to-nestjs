import { ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { CreatePostDto } from 'src/modules/posts/dtos/create-post.dto';
import { UpdatePostDto } from 'src/modules/posts/dtos/update-post.dto';
import { Controller, Get, Param, Post, Delete, UseInterceptors, UploadedFiles, Body, Patch, Query } from '@nestjs/common';


@ApiTags('Posts')
@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
    ) { }


    // create post
    @Post()
    @UseInterceptors(FilesInterceptor('images'))
    async createPost(@UploadedFiles() images: Array<Express.Multer.File>, @Body() createPostDto: CreatePostDto, @CurrentUser() currentUser: UserInterface) {
        return this.postsService.createPost(images, createPostDto, currentUser);
    }


    // get all posts
    @Get()
    async readPosts() {
        return this.postsService.readPosts();
    }


    // get specific post
    @Get(':id')
    async readPostById(@Param('id') postId: string) {
        return this.postsService.readPostById(postId);
    }


    // update post
    @Patch(':id')
    async updatePost(@Param('id') postId: string, @Body() updatePostDto: UpdatePostDto) {
        return this.postsService.updatePost(postId, updatePostDto);
    }


    // delete post
    @Delete(':id')
    async deletePost(@Param('id') postId: string) {
        return this.postsService.deletePost(postId);
    }


    // get posts of a user
    @Get()
    async readPostsOfUser(@Query('userId') userId: string) {
        return this.postsService.readPostsOfUser(userId);
    }
}
