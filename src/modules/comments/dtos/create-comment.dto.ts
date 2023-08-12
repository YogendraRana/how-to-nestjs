import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCommentDto {
    @ApiProperty({example: "This is a comment content."})
    @IsString()
    @IsNotEmpty()
    content: string;


    @ApiProperty({example: "cll36uuxa0000yzh8vte1hcqw"})
    @IsString()
    @IsNotEmpty()
    userId: string;


    @ApiProperty({example: "cll515laq0007yzo0md3m20qm"})
    @IsString()
    @IsNotEmpty()
    postId: string;

    
    @ApiProperty({example: "cll36azxa0000yzo8vte1hcqw"})
    @IsOptional()
    @IsString()
    parentId?: string;
}