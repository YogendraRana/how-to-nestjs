import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { CreatePostReactionDto } from './dtos/create-post-reaction.dto';


@Injectable()
export class PostReactionsService {
    constructor(
        private readonly prismaService: PrismaService,
    ) { }


    // create posts reactions
    async createPostReaction(createPostReactionDto: CreatePostReactionDto, user: UserInterface) {
        // check if user has already reacted to post
        const postReaction = await this.prismaService.postReaction.findFirst({
            where: {
                userId: user.id,
                postId: createPostReactionDto.postId,
            }
        })

        // if already reacted, remove the reaction
        if (postReaction && postReaction.reactionId === createPostReactionDto.reactionId) {
            await this.prismaService.postReaction.delete({
                where: { id: postReaction.id }
            })

            return {
                success: true,
                message: "Post reaction removed successfully"
            }
        }

        // if already reacted with a different reaction, update the reaction
        if (postReaction && postReaction.reactionId !== createPostReactionDto.reactionId) {
            await this.prismaService.postReaction.update({
                where: { id: postReaction.id },
                data: { reactionId: createPostReactionDto.reactionId }
            })

            return {
                success: true,
                message: "Post reaction updated successfully"
            }
        }

        // if not reacted, create the reaction
        await this.prismaService.postReaction.create({
            data: createPostReactionDto
        })

        return {
            success: true,
            message: "Post reaction created successfully"
        };
    }


    // read post reactions
    async readPostReactions(postId: string) {
        // check if post exists
        const post = await this.prismaService.post.findUnique({
            where: { id: postId },
        })

        if (!post) throw new HttpException("Post not found", 404);

        // get post reactions
        const postReactions = await this.prismaService.postReaction.findMany({
            where: { postId },
        })

        return {
            success: true,
            message: "Post reactions retrieved successfully",
            data: postReactions
        };
    }


    // delete post reactions
    async deletePostReaction(postId: string, user: UserInterface) {
        const postReaction = await this.prismaService.postReaction.findFirst({
            where: {
                userId: user.id,
                postId: postId,
            }
        })

        // check if post reaction exists
        if (!postReaction) throw new HttpException("Post reaction not found", 404);

        // delete post reaction
        await this.prismaService.postReaction.delete({
            where: { id: postReaction.id }
        })

        return {
            success: true,
            message: "Post reaction deleted successfully"
        }
    }
}
