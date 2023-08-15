import { Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

@Injectable()
export class CreateReactionDto {
    @ApiProperty({example: "Love"})
    @IsString()
    @IsNotEmpty()
    name: string;


    @ApiProperty({example: "https://www.google.com/image.png"})
    @IsString()
    @IsOptional()
    url?: string;


    @ApiProperty({example: 100})
    @IsInt()
    @IsOptional()
    price?: number;
}