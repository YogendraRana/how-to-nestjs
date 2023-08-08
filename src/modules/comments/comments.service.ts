import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentsService {

    // create comment to a post
    async createComment () {
        return {
            success: true,
            message: 'Comment created successfully'
        }
    }


    // get comments of a post
    async readComments () {
        return {
            success: true,
            message: 'Comments retrieved successfully'
        }
    }


    // update comment
    async updateComment() {
        return {
            success: true,
            message: 'Comment updated successfully'
        }
    }


    // delete comment
    async deleteComment() {
        return {
            success: true,
            message: 'Comment deleted successfully'
        }
    }


    // reply on a comment
    async replyToComment () {
        return {
            success: true,
            message: 'Reply created successfully'
        }
    }
}
