import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class DeleteMessageDto {
    @ApiProperty({example: "1234567890"})
    @IsString()
    @IsNotEmpty()
    chatId: string;

    
    @ApiProperty({example: "1234567890"})
    @IsString()
    @IsNotEmpty()
    messageId: string;


    @ApiProperty({example: "1234567890"})
    @IsString()
    @IsNotEmpty()
    senderId: string;
}