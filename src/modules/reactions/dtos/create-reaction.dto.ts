import { Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

@Injectable()
export class CreateReactionDto {
    @ApiProperty({ example: "Love" })
    @IsString()
    @IsNotEmpty()
    name: string;


    @ApiProperty({ example: 0 })
    @IsString()
    @IsNotEmpty()
    price: number;
}