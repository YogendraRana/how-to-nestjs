import axios from 'axios'
import * as FormData from 'form-data';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from 'src/common/dtos/create-post.dto';
import { UpdatePostDto } from '../../common/dtos/update-post.dto';
import { UserInterface } from 'src/common/interfaces/user.interface';

@Injectable()
export class PostService {
    constructor(
        private prismaService: PrismaService,
    ) { }


    // get all posts
    async getAllPosts() {
        const posts = await this.prismaService.post.findMany();
        return {
            success: true,
            message: 'Posts fetched successfully',
            data: posts
        }
    }


    // get specific post
    async getPostById(postId: string) {
        const post = await this.prismaService.post.findUnique({where: {id: postId}});
        if(!post) throw new NotFoundException('Post not found');
        
        return {
            success: true,
            message: 'Post fetched successfully',
            data: post
        }
    }


    // create post
    async createPost(images: Array<Express.Multer.File>, createPostDto: CreatePostDto, user: UserInterface) {
        createPostDto.userId = createPostDto.userId || user.id;
        createPostDto.images = createPostDto.images || [];

        const uploadPromises = images.map(async (image) => {
            const formData = new FormData();
            formData.append('file', image.buffer, image.originalname);
            formData.append('requireSignedURLs', 'false');

            const response = await axios.post(process.env.CLOUDFLARE_POST_URL, formData, {
                headers: {
                    Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            createPostDto.images.push({ imageId: response.data.result.id, url: response.data.result.variants[0] });
        });

        await Promise.all(uploadPromises);

        await this.prismaService.post.create({ data: createPostDto })

        return {
            success: true,
            message: 'Post created successfully',
        }
    }


    // delete post
    async deletePost(postId: string) {
        const post = await this.prismaService.post.findUnique({where: {id: postId}});
        if(!post) throw new NotFoundException('Post not found');

        // delete images from cloudflare
        const deleteImagesPromises = post.images.map(async (image: {url: string, imageId: string}) => {
            await axios.delete(`${process.env.CLOUDFLARE_POST_URL}/${image.imageId}`, {
                headers: {
                    Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
                    "Content-Type": "application/json",
                },
            });
        })

        await Promise.all(deleteImagesPromises);

        // delete post from database
        await this.prismaService.post.delete({where: {id: postId}});

        return {
            success: true,
            message: 'Post deleted successfully',
        }
    }

    
    // update post
    async updatePost(postId: string, updatePostDto: UpdatePostDto) {
        const post = await this.prismaService.post.findUnique({where: {id: postId}});
        if(!post) throw new NotFoundException('Post not found');

        post.caption = updatePostDto.caption || post.caption;
        post.location = updatePostDto.location || post.location;
        post.isPublic = updatePostDto.isPublic || post.isPublic;

        await this.prismaService.post.update({where: {id: postId}, data: post});

        return {
            success: true,
            message: 'Post updated successfully',
        };
    }


    // get post of a user
    async getPostsOfUser(userId: string) {
        const posts = await this.prismaService.post.findMany({
            where: {userId: userId},
            orderBy: {createdAt: 'desc'},
        });
        return {
            success: true,
            message: 'Posts fetched successfully',
            data: posts
        }
    }
}
