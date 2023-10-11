import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateChatDto {
    @ApiProperty({example: "Friends"})
    @IsString()
    name?: string;


    @ApiProperty({example: "adminId"})
    @IsString()
    adminId?: string;
}