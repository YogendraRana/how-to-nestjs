import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class CreatePostReactionDto {
    @ApiProperty({example: "clldkq33e0000yz1ovwdxur9c"})
    @IsString()
    @IsNotEmpty()
    userId: string;


    @ApiProperty({example: "ckldkq33e0000yz1ovwdxur9c"})
    @IsString()
    @IsNotEmpty()
    postId: string;


    @ApiProperty({example: "ckldkq33e0000yz1ovwdxur9c"})
    @IsString()
    @IsNotEmpty()
    reactionId: string;
}