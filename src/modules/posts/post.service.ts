import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostService {
    constructor(
        private prismaService: PrismaService,
    ) {}

    // get all posts
    async handleGetPosts() {
        return 'posts are listed here';
    }

    // get specific post
    async handleGetPost(postId: string) {
        return postId;
    }

    // create post
    async handleCreatePost() {
        return 'create post';
    }

    // delete post
    async handleDeletePost(postId: string) {
        return postId;
    }

    // update post
    async handleUpdatePost(postId: string) {
        return postId;
    }
}
