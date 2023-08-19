import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateCommentDto {
    @ApiProperty({example: "This is a updated comment content."})
    @IsString()
    @IsNotEmpty()
    content: string;
}