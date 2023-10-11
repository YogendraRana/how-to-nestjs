import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateMessageDto {
    @ApiProperty({example: "1234567890"})
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    chatId: string;

    
    @ApiProperty({example: "1234567890"})
    @IsString()
    @IsNotEmpty()
    senderId: string;

    
    @ApiProperty({example: "1234567890"})
    @IsString()
    @IsNotEmpty()
    receiverId: string;


    @ApiProperty({example: "Hello World"})
    @IsString()
    @IsNotEmpty()
    text: string;
}