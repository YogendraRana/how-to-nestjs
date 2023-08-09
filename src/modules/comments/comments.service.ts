import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { CreateCommentDto } from 'src/common/dtos/create-comment.dto';


@Injectable()
export class CommentsService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }


    // create comment to a post
    async createComment(createCommentDto: CreateCommentDto, user: UserInterface) {
        if (createCommentDto.userId !== user.id) throw new NotFoundException('User not found');

        // check if post exists
        const post = await this.prismaService.post.findUnique({ where: { id: createCommentDto.postId } });
        if (!post) throw new NotFoundException('Post not found');

        // check if parent comment exists
        if (createCommentDto.parentId) {
            const parentComment = await this.prismaService.comment.findUnique({ where: { id: createCommentDto.parentId } });
            if (!parentComment) throw new NotFoundException('Parent comment does not exist!');
        }

        await this.prismaService.comment.create({ data: createCommentDto })

        return {
            success: true,
            message: 'Comment created successfully'
        }
    }


    // get comments of a post
    async readComments(postId: string) {
        // check if post exists
        const post = await this.prismaService.post.findUnique({ where: { id: postId } });
        if (!post) throw new NotFoundException('Post not found');

        const comments = await this.prismaService.comment.findMany({ where: { postId } });

        return {
            success: true,
            message: 'Comments retrieved successfully',
            data: comments
        }
    }


    // update comment
    async updateComment(commentId: string, content: string) {
        const comment = await this.prismaService.comment.findUnique({ where: { id: commentId } });
        if (!comment) throw new NotFoundException('Comment not found');
        
        // Update the comment in the database
        const updatedComment = await this.prismaService.comment.update({
            where: { id: commentId },
            data: { 
                content: content || comment.content
            },
        });

        return {
            success: true,
            message: 'Comment updated successfully',
            updatedComment,
        };
    }


    // delete comment
    async deleteComment(commentId: string) {
    const comment = await this.prismaService.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');

    console.log(comment)

    await this.prismaService.comment.delete({ where: { id: commentId } })

    return {
        success: true,
        message: 'Comment deleted successfully'
    }
}
}
