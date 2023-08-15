import axios from 'axios'
import * as FormData from 'form-data';
import { UpdatePostDto } from './dtos/update-post.dto';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { CreatePostDto } from 'src/modules/posts/dtos/create-post.dto';


@Injectable()
export class PostsService {
    constructor(
        private prismaService: PrismaService,
    ) { }


    // create post
    async createPost(images: Array<Express.Multer.File>, createPostDto: CreatePostDto, currentUser: UserInterface) {
        if(currentUser.id !== createPostDto.userId) throw new ForbiddenException('You are not authorized to create a post for this user.');

        const post = await this.prismaService.post.create({ data: createPostDto })

        Promise.all(images.map(async (image) => {
            const formData = new FormData();
            formData.append('file', image.buffer, image.originalname);
            formData.append('requireSignedURLs', 'false');

            const response = await axios.post(process.env.CLOUDFLARE_IMAGES_URL, formData, {
                headers: {
                    Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
                    'Content-Type': 'multipart/form-data',
                },
            });


            let publicUrl: string, postUrl: string;
            const variants = response.data.result.variants;

            for (const variant of variants) {
                if (variant.includes('/public')) {
                    publicUrl = variant;
                } else if (variant.includes('/post')) {
                    postUrl = variant;
                }
            }

            await this.prismaService.image.create({
                data: {
                    imageId: response.data.result.id,
                    publicUrl: publicUrl,
                    postUrl: postUrl,
                    postId: post.id,
                }
            })

        }));

        return {
            success: true,
            message: 'Post created successfully',
        }
    }


    // get all posts
    async readPosts() {
        const posts = await this.prismaService.post.findMany();
        return {
            success: true,
            message: 'Posts fetched successfully',
            posts: posts
        }
    }


    // get specific post
    async readPostById(postId: string) {
        const post = await this.prismaService.post.findUnique({ where: { id: postId } });
        if (!post) throw new NotFoundException('Post not found');

        return {
            success: true,
            message: 'Post fetched successfully',
            post: post
        }
    }


    // update post
    async updatePost(postId: string, updatePostDto: UpdatePostDto) {
        const post = await this.prismaService.post.findUnique({ where: { id: postId } });
        if (!post) throw new NotFoundException('Post not found');

        await this.prismaService.post.update({
            where: { id: postId },
            data: {
                caption: updatePostDto.caption || post.caption,
                location: updatePostDto.location || post.location,
                isPrivate: updatePostDto.isPrivate || post.isPrivate,
            }
        });

        return {
            success: true,
            message: 'Post updated successfully',
        };
    }


    // delete post
    async deletePost(postId: string) {
        const post = await this.prismaService.post.findUnique({ where: { id: postId } });
        if (!post) throw new NotFoundException('Post not found');

        const images = await this.prismaService.image.findMany({ where: { postId } });

        // delete images from cloudflare
        await Promise.all(images.map(async (image: { publicUrl: string, postUrl: string, imageId: string }) => {
            await axios.delete(`${process.env.CLOUDFLARE_IMAGES_URL}/${image.imageId}`, {
                headers: {
                    Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
                    "Content-Type": "application/json",
                },
            });
        }))

        // delete post from database
        await this.prismaService.post.delete({ where: { id: postId } });

        return {
            success: true,
            message: 'Post deleted successfully',
        }
    }


    // get post of a user
    async readPostsOfUser(userId: string) {
        const posts = await this.prismaService.post.findMany({
            where: { userId: userId },
            orderBy: { createdAt: 'desc' },
        });
        return {
            success: true,
            message: 'Posts fetched successfully',
            data: posts
        }
    }
}
