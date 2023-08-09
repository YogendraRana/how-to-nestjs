import { IsOptional, IsString } from "class-validator";

export class CreateCommentDto {
    @IsString()
    content: string;

    @IsString()
    userId: string;

    @IsString()
    postId: string;

    @IsOptional()
    @IsString()
    parentId: string;
}