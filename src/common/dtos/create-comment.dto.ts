import { IsString } from "class-validator";

export class CreateCommentDto {
    @IsString()
    userId: string;

    @IsString()
    postId: string;

    @IsString()
    comment: string;
}