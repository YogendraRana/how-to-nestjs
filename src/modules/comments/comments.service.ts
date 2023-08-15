import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { CreateCommentDto } from 'src/modules/comments/dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-commet.dto';


@Injectable()
export class CommentsService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }


    // create comment to a post
    async createComment(createCommentDto: CreateCommentDto, currentUser: UserInterface) {
        // check if user id matches the current user id
        if(currentUser.id !== createCommentDto.userId) throw new ForbiddenException('You are not authorized to create a comment for this user.');

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
    async updateComment(commentId: string, updateCommentDto: UpdateCommentDto) {
        // check if comment exists
        const comment = await this.prismaService.comment.findUnique({ where: { id: commentId } });
        if (!comment) throw new NotFoundException('Comment not found');

        // Update the comment in the database
        await this.prismaService.comment.update({
            where: { id: commentId },
            data: {
                content: updateCommentDto.content || comment.content
            },
        });

        return {
            success: true,
            message: 'Comment updated successfully',
        };
    }


    // delete comment
    async deleteComment(commentId: string) {
        // check if comment exists
        const comment = await this.prismaService.comment.findUnique({ where: { id: commentId } });
        if (!comment) throw new NotFoundException('Comment not found');

        await this.prismaService.comment.delete({ where: { id: commentId } })

        return {
            success: true,
            message: 'Comment deleted successfully'
        }
    }
}
